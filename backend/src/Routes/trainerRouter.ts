import express, { Router } from 'express';
import { configDotenv } from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';
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
trainerRouter.post('/signUp', async (req, res) => {
    try {
        const { name, email, password, phone, qualification, city, subjects } = signUpSchema.parse(req.body);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const trainer = await prisma.trainer.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                qualification,
                city,
                subjects: subjects
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
trainerRouter.get('/getSessions', async (req, res) => {
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
    const trainers = await prisma.trainer.findMany();
    res.json(trainers);
});

export default trainerRouter