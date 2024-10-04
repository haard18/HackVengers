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
            return ;
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

export default traineeRouter;
