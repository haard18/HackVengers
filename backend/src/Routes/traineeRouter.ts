import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../dbconfig';

const traineeRouter = express.Router();

// Schema for sign-up validation
const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string(),
    city: z.string(),
    schoolName: z.string(),
    class: z.string(),
    branch: z.string(),
    subjects: z.array(z.string())
});
// Assuming you are using zod
const sessionSchema = z.object({
    startTime: z.string(), // Keep it as a string for now
    endTime: z.string(),
    trainerId: z.string(),
    topic: z.string(),
});

// Schema for login validation
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

// Trainee sign-up route
traineeRouter.post('/signUp', async (req, res) => {
    try {
        // Validate the input data
        const { name, email, password, phone, city, schoolName, class: className, branch, subjects } = signUpSchema.parse(req.body);

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the trainee record
        const trainee = await prisma.trainee.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                city,
                schoolName,
                class: className,
                branch,
                subjects
            }
        });

        // Generate JWT token
        const token = jwt.sign({ id: trainee.id }, process.env.JWT_SECRET || 'secret');

        // Return the token
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid data" });
    }
});

// Trainee login route
traineeRouter.post('/login', async (req, res) => {
    try {
        // Validate login input
        const { email, password } = loginSchema.parse(req.body);

        // Find the trainee by email
        const trainee = await prisma.trainee.findUnique({
            where: {
                email
            }
        });

        if (!trainee) {
            res.sendStatus(400).json({ error: "Invalid email or password" });
            return;
        }

        // Compare the password with the hashed password
        const isValid = await bcrypt.compare(password, trainee.password);
        if (!isValid) {
            res.sendStatus(400).json({ error: "Invalid email or password" });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: trainee.id }, process.env.JWT_SECRET || 'secret');

        // Return the token
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid data" });
    }
});
traineeRouter.post('/createSession', async (req, res) => {
    try {
        const { success, error } = sessionSchema.safeParse(req.body);
        if (!success) {
            console.error('Validation errors:', error.errors); // Log the validation errors
            res.status(400).json({ error: "Invalid data" });
            return;
        }

        // Parse dates after validation
        const startTime = new Date(req.body.startTime);
        const endTime = new Date(req.body.endTime);
        const { trainerId, topic } = req.body;

        console.log('Parsed Values:', { startTime, endTime, trainerId, topic }); // Log parsed values

        const auth = req.headers['auth-token'];
        if (!auth || typeof auth !== 'string') {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const decodedToken = jwt.verify(auth, process.env.JWT_SECRET || "secret");
        const trainee = (decodedToken as jwt.JwtPayload).id as string;

        const trainer = await prisma.trainer.findUnique({ where: { id: trainerId } });
        if (!trainer) {
            res.status(404).json({ error: "Trainer not found" });
            return;
        }

        const session = await prisma.session.create({
            data: {
                startTime,
                endTime,
                topic,
                status: 'Pending',
                trainee: { connect: { id: trainee } },
                trainer: { connect: { id: trainerId } }
            }
        });

        res.json(session);
    } catch (error) {
        console.error('Error:', error); // Log error details
        res.status(400).json({ error: "Invalid data" });
    }
});

traineeRouter.post('/rateSession', async (req, res) => {
    const token = req.headers['auth-token'];

    // Check for token
    if (!token || typeof token !== 'string') {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        // Verify token and extract trainee ID
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const traineeId = (decodedToken as jwt.JwtPayload).id;

        // Check if traineeId is valid
        if (!traineeId || typeof traineeId !== 'string') {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Extract sessionId, comment, and rating from request body
        const { sessionId, comment} = req.body;
        const rating =parseFloat(req.body.rating);
        // Validate rating
        

        // Fetch the session to ensure it exists and belongs to the trainee
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { trainee: true, trainer: true }, // Include related trainee and trainer for validation
        });

        // Check if session exists
        if (!session) {
            res.status(404).json({ error: "Session not found" });
            return;
        }

        // Check if the session belongs to the trainee
        if (session.traineeId !== traineeId) {
            res.status(403).json({ error: "Forbidden. You cannot rate this session." });
            return;
        }
        if(session.trainerId===null){
            res.status(403).json({ error: "Forbidden. Trainer has not been assigned to this session." });
            return;
        }
        // Update the session's ratings and status
        await prisma.session.update({
            where: { id: sessionId },
            data: {
                ratings: {
                    create: {
                        rating,
                        comment,
                        trainee: { connect: { id: traineeId } },
                        trainer: { connect: { id: session.trainerId } }, // Ensure trainerId exists in the session
                    }
                },
                status: 'Rated', // Update status to 'Rated'
            },
        });

        // Create a new rating record
        await prisma.ratings.create({
            data: {
                session: { connect: { id: sessionId } },
                trainee: { connect: { id: traineeId } },
                trainer: { connect: { id: session.trainerId } }, // Ensure trainerId exists in the session
                rating,
                comment,
            },
        });

        // Respond with success message
        res.json({ message: "Session rated successfully" });
        return;
    } catch (error) {
        console.error("Error in rateSession:", error);
         res.status(500).json({ error: "An error occurred while rating the session" });
        return;
    }
});

traineeRouter.get('/getMySessions', async (req, res) => {

    const auth = req.headers['auth-token'];

    // Check if auth is present and is a string
    if (!auth || typeof auth !== 'string') {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const decodedToken = jwt.verify(auth, process.env.JWT_SECRET || 'secret');
        const traineeId = (decodedToken as jwt.JwtPayload).id as string;

        // Check if traineeId is a valid string
        if (!traineeId || typeof traineeId !== 'string') {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const sessions = await prisma.session.findMany({
            where: {
                traineeId: traineeId
            },
            include:{
                trainer: {
                    select:{
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        res.json(sessions);
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
});
traineeRouter.get('/getIdealTrainers', async (req, res) => {
    const auth = req.headers['auth-token'];
    if (!auth || typeof auth !== 'string') {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    try {
        const decodedToken = jwt.verify(auth, process.env.JWT_SECRET || 'secret');
        const traineeId = (decodedToken as jwt.JwtPayload).id as string;
        if (!traineeId || typeof traineeId !== 'string') {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const trainee = await prisma.trainee.findUnique({
            where: {
                id: traineeId
            }
        });
        if (!trainee) {
            res.status(404).json({ error: "Trainee not found" });
            return;
        }
        const trainers = await prisma.trainer.findMany({
            where: {
                subjects: {
                    hasSome: trainee.subjects
                }
            }
        });
        res.json(trainers);
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
});
export default traineeRouter;
