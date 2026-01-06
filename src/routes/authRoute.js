import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        const newUser = await prisma.user.create({ 
            data: {
                email: email,
                password: hashedPassword
            }
        });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: "User already exists" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id }, 
            process.env.JWT_SECRET, // Make sure this matches your .env
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;