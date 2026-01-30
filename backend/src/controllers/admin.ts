import { Request, Response } from 'express';
import { db } from '../db';
import { users, scans, products, diseaseSolutions } from '../db/schema';
import { eq, desc, count, and, gte, lte } from 'drizzle-orm';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const allUsers = await db.select({
            id: users.id,
            email: users.email,
            fullName: users.fullName,
            preferredLanguage: users.preferredLanguage,
            createdAt: users.createdAt
        })
        .from(users)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(users.createdAt));

        const totalCount = await db.select({ count: count() }).from(users);
        
        res.json({
            users: allUsers,
            pagination: {
                page,
                limit,
                total: totalCount[0].count,
                pages: Math.ceil(totalCount[0].count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const getScans = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const allScans = await db.select({
            id: scans.id,
            userId: scans.userId,
            imageUrl: scans.imageUrl,
            prediction: scans.prediction,
            confidence: scans.confidence,
            notes: scans.notes,
            isLowConf: scans.isLowConf,
            createdAt: scans.createdAt
        })
        .from(scans)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(scans.createdAt));

        const totalCount = await db.select({ count: count() }).from(scans);
        
        res.json({
            scans: allScans,
            pagination: {
                page,
                limit,
                total: totalCount[0].count,
                pages: Math.ceil(totalCount[0].count / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scans' });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
        res.json({ products: allProducts });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

export const getDiseases = async (req: Request, res: Response) => {
    try {
        const allDiseases = await db.select().from(diseaseSolutions).orderBy(desc(diseaseSolutions.createdAt));
        res.json({ diseases: allDiseases });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch diseases' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fullName, preferredLanguage, email } = req.body;

        const [updatedUser] = await db.update(users)
            .set({ fullName, preferredLanguage, email })
            .where(eq(users.id, parseInt(id)))
            .returning();

        res.json({ user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};

export const deleteScan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        await db.delete(scans).where(eq(scans.id, parseInt(id)));
        
        res.json({ message: 'Scan deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete scan' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productData = req.body;

        const [updatedProduct] = await db.update(products)
            .set(productData)
            .where(eq(products.id, parseInt(id)))
            .returning();

        res.json({ product: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};

export const updateDisease = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const diseaseData = req.body;

        const [updatedDisease] = await db.update(diseaseSolutions)
            .set(diseaseData)
            .where(eq(diseaseSolutions.id, parseInt(id)))
            .returning();

        res.json({ disease: updatedDisease });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update disease' });
    }
};

export const getSystemStats = async (req: Request, res: Response) => {
    try {
        const userCount = await db.select({ count: count() }).from(users);
        const scanCount = await db.select({ count: count() }).from(scans);
        const productCount = await db.select({ count: count() }).from(products);
        const diseaseCount = await db.select({ count: count() }).from(diseaseSolutions);

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentScans = await db.select({ count: count() })
            .from(scans)
            .where(gte(scans.createdAt, sevenDaysAgo));

        const recentUsers = await db.select({ count: count() })
            .from(users)
            .where(gte(users.createdAt, sevenDaysAgo));

        res.json({
            stats: {
                totalUsers: userCount[0].count,
                totalScans: scanCount[0].count,
                totalProducts: productCount[0].count,
                totalDiseases: diseaseCount[0].count,
                recentScans: recentScans[0].count,
                recentUsers: recentUsers[0].count
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch system stats' });
    }
};
