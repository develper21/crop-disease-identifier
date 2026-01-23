import { Request, Response } from 'express';
import { db } from '../db';
import { scans } from '../db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import multer from 'multer';
import path from 'path';

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

export const uploadImage = async (req: Request, res: Response) => {
    try {
        const uploadMiddleware = upload.single('image');
        
        uploadMiddleware(req, res, (err: any) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const imageUrl = `/uploads/${req.file.filename}`;
            res.json({ imageUrl });
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createScan = async (req: any, res: Response) => {
    try {
        const { imageUrl, prediction, confidence, notes, isLowConf } = req.body;
        const userId = req.user.userId;

        if (!imageUrl || !prediction || confidence === undefined) {
            return res.status(400).json({ error: 'imageUrl, prediction, and confidence are required' });
        }

        const [newScan] = await db.insert(scans).values({
            userId,
            imageUrl,
            prediction,
            confidence: parseInt(confidence),
            notes,
            isLowConf: isLowConf || false,
        }).returning();

        res.status(201).json(newScan);
    } catch (error) {
        console.error('Error creating scan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMyScans = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;
        const { page = '1', limit = '10' } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        // Get total count
        const [{ count }] = await db.select({ count: sql`count(*)` })
            .from(scans)
            .where(eq(scans.userId, userId));

        // Get scans with pagination
        const userScans = await db.select()
            .from(scans)
            .where(eq(scans.userId, userId))
            .orderBy(desc(scans.createdAt))
            .limit(limitNum)
            .offset(offset);

        const totalPages = Math.ceil(parseInt(count as string) / limitNum);

        res.json({
            scans: userScans,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: count,
                totalPages,
                hasNext: pageNum < totalPages,
                hasPrev: pageNum > 1
            }
        });
    } catch (error) {
        console.error('Error getting scans:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getScanById = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const [scan] = await db.select().from(scans).where(eq(scans.id, parseInt(id)));

        if (!scan) return res.status(404).json({ error: 'Scan not found' });
        if (scan.userId !== req.user.userId) return res.status(403).json({ error: 'Unauthorized' });

        res.json(scan);
    } catch (error) {
        console.error('Error getting scan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateScan = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const { notes, isLowConf } = req.body;
        const userId = req.user.userId;

        const [existingScan] = await db.select().from(scans).where(eq(scans.id, parseInt(id)));
        
        if (!existingScan) {
            return res.status(404).json({ error: 'Scan not found' });
        }
        
        if (existingScan.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const [updatedScan] = await db.update(scans)
            .set({
                notes: notes !== undefined ? notes : existingScan.notes,
                isLowConf: isLowConf !== undefined ? isLowConf : existingScan.isLowConf,
            })
            .where(eq(scans.id, parseInt(id)))
            .returning();

        res.json(updatedScan);
    } catch (error) {
        console.error('Error updating scan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteScan = async (req: any, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const [existingScan] = await db.select().from(scans).where(eq(scans.id, parseInt(id)));
        
        if (!existingScan) {
            return res.status(404).json({ error: 'Scan not found' });
        }
        
        if (existingScan.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await db.delete(scans).where(eq(scans.id, parseInt(id)));

        res.json({ message: 'Scan deleted successfully' });
    } catch (error) {
        console.error('Error deleting scan:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getScanStats = async (req: any, res: Response) => {
    try {
        const userId = req.user.userId;

        const [totalScans] = await db.select({ count: sql`count(*)` })
            .from(scans)
            .where(eq(scans.userId, userId));

        const [lowConfScans] = await db.select({ count: sql`count(*)` })
            .from(scans)
            .where(and(eq(scans.userId, userId), eq(scans.isLowConf, true)));

        const [avgConf] = await db.select({ avg: sql`AVG(confidence)` })
            .from(scans)
            .where(eq(scans.userId, userId));

        res.json({
            totalScans: parseInt(totalScans.count as string),
            lowConfidenceScans: parseInt(lowConfScans.count as string),
            averageConfidence: Math.round(parseFloat(avgConf.avg as string) || 0),
        });
    } catch (error) {
        console.error('Error getting scan stats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
