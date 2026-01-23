import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUser] = await db.insert(users).values({
            email,
            password: hashedPassword,
            fullName,
        }).returning();

        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET);

        res.status(201).json({ user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName }, token });
    } catch (error: any) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET);

        res.json({ user: { id: user.id, email: user.email, fullName: user.fullName }, token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.id, req.user.userId));
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ user: { id: user.id, email: user.email, fullName: user.fullName } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
