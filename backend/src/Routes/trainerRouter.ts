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
        // res.json(trainer);
        const token = jwt.sign({ id: trainer.id }, process.env.JWT_SECRET || 'secret');
        res.json({ token });
    } catch (error) {
        res.status(400).json({ error: "Invalid data" });
    }
})
trainerRouter.post('/login', async (req, res) => {
    try {
        const { success } = loginSchema.safeParse(req.body);
        if (!success) {
            res.status(400).json({ error: "Invalid data" });
            return ;
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
            return ;
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
export default trainerRouter