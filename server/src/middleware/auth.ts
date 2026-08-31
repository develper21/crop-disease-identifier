import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, async (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        
        // Attach user info to request
        const [userData] = await db.select({
            id: users.id,
            email: users.email,
            fullName: users.fullName
        }).from(users).where(eq(users.id, user.userId));
        
        req.user = { ...user, ...userData };
        next();
    });
};

export const requireAdmin = (req: any, res: Response, next: NextFunction) => {
    // For now, we'll consider user with ID 1 as admin
    // In production, you'd have a role field in users table
    if (req.user?.userId !== 1) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
