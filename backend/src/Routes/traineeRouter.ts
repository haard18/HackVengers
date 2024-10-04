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
const sessionSchema = z.object({
    startTime: z.string().transform((val) => new Date(val)), // Accepts string and converts to Date
    endTime: z.string().transform((val) => new Date(val)),   // Accepts string and converts to Date
    trainerId: z.string(),
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
        const { success } = sessionSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ error: "Invalid data" });
            return;
        }
        const { startTime, endTime, trainerId, topic } = req.body
        console.log(startTime, endTime, trainerId)
        const auth = req.headers['auth-token']

        if (!auth || typeof auth !== 'string') {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        // Verify the token to get the trainee's ID
        const decodedToken = jwt.verify(auth, process.env.JWT_SECRET || "secret");
        const trainee = (decodedToken as jwt.JwtPayload).id as string; // Assuming the token contains an 'id' field
        const trainer = await prisma.trainer.findUnique({ where: { id: trainerId } });
        if (!trainer) {
            res.status(404).json({ error: "Trainer not found" });
            return;
        }

        // Create session
        const session = await prisma.session.create({
            data: {
                startTime,
                endTime,
                topic,
                status: 'Pending', // Initial status
                trainee: { connect: { id: trainee } }, // Assuming user ID is available
                trainer: { connect: { id: trainerId } }
            }
        });

        res.json(session);
    } catch (error) {
        res.status(400).json({ error: "Invalid data" });
    }
});
traineeRouter.post('/rateSession', async (req, res) => {
    
});
traineeRouter.post('/getSessions', async (req, res) => {

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
            }
        });

        res.json(sessions);
    } catch (error) {
        res.status(401).json({ error: "Unauthorized" });
    }
});

export default traineeRouter;
