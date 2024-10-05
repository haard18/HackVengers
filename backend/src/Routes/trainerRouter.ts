import express, { Router } from 'express';
import { configDotenv } from 'dotenv';
const PhysicsURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLxn-W1Py3Td00ZeiM759oV60BlTmmm4rUZCY4_YElxXA6agfUnjVj-tPOsHFelsYjjGg&usqp=CAU";
const MathsURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCnAVRcmamSxvXodC8jxVYaclFCBci7EVyqA&sJ"
const BiologyURL = "https://static.vecteezy.com/system/resources/previews/026/325/679/original/biology-icon-symbol-design-illustration-vector.jpg"
const ChemistryURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwicJ2vRsRIAAp8eY1XLztqqEO6L7kcyVGKA&s";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

configDotenv()  
import prisma from '../dbconfig';
import { z } from 'zod';
const trainerRouter: Router = Router();
const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string(),
    qualification: z.string(),
    city: z.string(),
    subjects: z.array(z.string())
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});
const sendMail = async (email: string, subject: string, text: string) => {


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'haardsolanki.itm@gmail.com',
            pass: 'oupl qleh qnee pucl'
        },
    });


    const mailOptions = {
        from: `EduHacks`,
        to: email,
        subject: subject,
        html: `
<div style="
    background-color: #f4f4f9;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
">
    <div style="
        max-width: 600px;
        margin: 0 auto;
        background-color: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        text-align: center;
    ">
        <h1 style="
            color: #4CAF50;
            font-size: 26px;
            margin-bottom: 20px;
            font-weight: bold;
        ">
            You are Invited for the Session
        </h1>
        <h2 style="
            color: #333;
            font-size: 24px;
            margin-bottom: 20px;
        ">
            ${subject}
        </h2>
        <p style="
            color: #555;
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
        ">
            ${text}
        </p>
        <a href="/https://vh-24-hack-vengers-git-main-haard18s-projects.vercel.app/sessions" style="
            background-color: #4CAF50;
            color: white;
            padding: 12px 25px;
            border-radius: 5px;
            text-decoration: none;
            font-size: 18px;
            transition: background-color 0.3s;
        ">
            Join Now
        </a>
    </div>
    <footer style="
        margin-top: 30px;
        color: #999;
        font-size: 12px;
        text-align: center;
    ">
        &copy; 2024 EduHacks. All rights reserved.
    </footer>
</div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent");
    } catch (error) {
        console.log("Error in sending email", error);
    }
}
trainerRouter.post('/sendMail', async (req, res) => {
    const { email, subject, text } = req.body;

    sendMail(email, subject, text);
    res.json({ message: "Mail sent" });

})
trainerRouter.post('/signUp', async (req, res) => {
    try {
        const { name, email, password, phone, qualification, city, subjects } = signUpSchema.parse(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine the image URL based on the subjects array
        let imageUrl = '';

        if (subjects.length === 1) {
            // If there's only one subject, use the corresponding image URL
            const subject = subjects[0].toLowerCase(); // Convert to lowercase for consistency
            if (subject === 'physics') {
                imageUrl = PhysicsURL;
            } else if (subject === 'math'||subject === 'maths') {
                imageUrl = MathsURL;
            } else if (subject === 'biology') {
                imageUrl = BiologyURL;
            } else if (subject === 'chemistry') {
                imageUrl = ChemistryURL;
            }
        } else if (subjects.length > 1) {
            // If there are multiple subjects, use the image URL of the first subject
            const firstSubject = subjects[0].toLowerCase();
            if (firstSubject === 'physics') {
                imageUrl = PhysicsURL;
            } else if (firstSubject === 'math'||firstSubject === 'maths') {
                imageUrl = MathsURL;
            } else if (firstSubject === 'biology') {
                imageUrl = BiologyURL;
            } else if (firstSubject === 'chemistry') {
                imageUrl = ChemistryURL;
            }
        }
        console.log(imageUrl);
        const trainer = await prisma.trainer.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                qualification,
                city,
                subjects: subjects,
                iconurl: imageUrl // Add imageUrl to the trainer data
            }
        });

        const token = jwt.sign({ id: trainer.id }, process.env.JWT_SECRET || 'secret');
        res.json({ token });
    } catch (error) {
        // Log the error to understand what went wrong
        console.error("Error in signUp:", error);
        res.status(400).json({ error: "Invalid data" });
    }
});

trainerRouter.post('/login', async (req, res) => {
    try {
        const { success } = loginSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ error: "Invalid data" });
            return;
        }
        const { email, password } = req.body;
        console.log(email, password);
        const trainer = await prisma.trainer.findUnique({
            where: {
                email
            }
        });
        console.log(trainer);
        if (!trainer) {
            res.send(400).json({ error: "Invalid email or password" });
            return;
        }
        const isValid = await bcrypt.compare(password, trainer.password);
        if (!isValid) {
            res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: trainer.id }, process.env.JWT_SECRET || '');
        res.json({ token });
    } catch (error) {

    }
})
trainerRouter.get('/getMySessions', async (req, res) => {
    const auth = req.headers['auth-token'];

    // Check if auth is present and is a string
    if (!auth || typeof auth !== 'string') {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    try {
        const decodedToken = jwt.verify(auth, process.env.JWT_SECRET || 'secret');
        const trainerId = (decodedToken as jwt.JwtPayload).id as string;

        // Check if trainerId is a valid string
        if (!trainerId || typeof trainerId !== 'string') {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const sessions = await prisma.session.findMany({
            where: {
                trainerId: trainerId
            },
            include: {
                trainee: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        res.json(sessions);
    } catch (error) {
        // Handle any error that occurs during token verification or database query
        res.status(500).json({ error: "Internal Server Error" });
    }
});
trainerRouter.post('/acceptSession/:sessionId', async (req, res) => {
    const auth = req.headers['auth-token'];

    if (!auth || typeof auth !== 'string') {
        res.status(401).json({ error: "Unauthorized" });
        return
    }

    try {
        // Verify the trainer's token to get their ID
        const decodedToken = jwt.verify(auth, process.env.JWT_SECRET || 'secret');
        const trainerId = (decodedToken as jwt.JwtPayload).id as string;

        const sessionId = req.params.sessionId;

        // Check if the session exists and is pending
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { trainee: true, trainer: true } // Optional: include trainee info if needed
        });

        if (!session) {
            res.status(404).json({ error: "Session not found" });
            return;
        }

        if (session.status !== 'Pending') {
            res.status(400).json({ error: "Session cannot be accepted" });
            return;
        }

        // Update the session status to 'Accepted'
        const updatedSession = await prisma.session.update({
            where: { id: sessionId },
            data: { status: 'Accepted' }
        });

        // Optionally: Notify the trainee or log the acceptance
        res.json(updatedSession);
    } catch (error) {
        res.status(400).json({ error: "Invalid data" });
    }
});
trainerRouter.get('/getAllTrainers', async (req, res) => {
    try {
        // Fetch all trainers along with their average rating
        const trainers = await prisma.trainer.findMany({
            include: {
                ratings: {
                    select: {
                        rating: true,
                    },
                },
            },
        });

        // Map trainers to include average rating
        const trainersWithAvgRating = trainers.map(trainer => {
            const ratings = trainer.ratings.map(r => r.rating); // Extract ratings
            const avgRating = ratings.length > 0
                ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length // Calculate average
                : 0; // Default to 0 if no ratings

            return {
                ...trainer,
                avgRating, // Add average rating to trainer object
            };
        });

        res.json(trainersWithAvgRating);
    } catch (error) {
        console.error("Error fetching trainers:", error);
        res.status(500).json({ error: "An error occurred while fetching trainers" });
    }
});

export default trainerRouter