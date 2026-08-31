import { Request, Response } from 'express';
import { db } from '../db';
import { diseaseSolutions } from '../db/schema';
import { ilike, or, eq, desc, asc, sql } from 'drizzle-orm';

export const getAllDiseases = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '10', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        let dbQuery = db.select().from(diseaseSolutions);

        // Apply sorting
        const orderBy = sortOrder === 'asc' ? asc : desc;
        // @ts-ignore
        dbQuery = dbQuery.orderBy(orderBy(diseaseSolutions[sortBy as keyof typeof diseaseSolutions] || diseaseSolutions.createdAt));

        // Get total count
        const [{ count }] = await db.select({ count: sql`count(*)` }).from(diseaseSolutions);

        // Apply pagination
        // @ts-ignore
        const results = await dbQuery.limit(limitNum).offset(offset);

        const totalPages = Math.ceil(parseInt(count as string) / limitNum);

        res.json({
            diseases: results,
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
        console.error('Error getting diseases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const searchDiseases = async (req: Request, res: Response) => {
    try {
        const { q, page = '1', limit = '10' } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        const searchQuery = `%${q}%`;
        
        const results = await db.select()
            .from(diseaseSolutions)
            .where(or(
                ilike(diseaseSolutions.name, searchQuery),
                ilike(diseaseSolutions.description, searchQuery),
                ilike(diseaseSolutions.commonNames, searchQuery)
            ))
            .limit(limitNum)
            .offset(offset);

        const [{ count }] = await db.select({ count: sql`count(*)` })
            .from(diseaseSolutions)
            .where(or(
                ilike(diseaseSolutions.name, searchQuery),
                ilike(diseaseSolutions.description, searchQuery),
                ilike(diseaseSolutions.commonNames, searchQuery)
            ));

        const totalPages = Math.ceil(parseInt(count as string) / limitNum);

        res.json({
            diseases: results,
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
        console.error('Error searching diseases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getDiseaseById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [disease] = await db.select().from(diseaseSolutions).where(eq(diseaseSolutions.id, parseInt(id)));
        if (!disease) return res.status(404).json({ error: 'Disease not found' });
        res.json(disease);
    } catch (error) {
        console.error('Error getting disease:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createDisease = async (req: Request, res: Response) => {
    try {
        const { name, description, commonNames, solutions } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const [newDisease] = await db.insert(diseaseSolutions).values({
            name,
            description,
            commonNames: commonNames || null,
            solutions: solutions || null,
        }).returning();

        res.status(201).json(newDisease);
    } catch (error: any) {
        console.error('Error creating disease:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Disease with this name already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateDisease = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, commonNames, solutions } = req.body;

        const [existingDisease] = await db.select().from(diseaseSolutions).where(eq(diseaseSolutions.id, parseInt(id)));
        if (!existingDisease) {
            return res.status(404).json({ error: 'Disease not found' });
        }

        const [updatedDisease] = await db.update(diseaseSolutions)
            .set({
                name: name || existingDisease.name,
                description: description !== undefined ? description : existingDisease.description,
                commonNames: commonNames !== undefined ? commonNames : existingDisease.commonNames,
                solutions: solutions !== undefined ? solutions : existingDisease.solutions,
            })
            .where(eq(diseaseSolutions.id, parseInt(id)))
            .returning();

        res.json(updatedDisease);
    } catch (error: any) {
        console.error('Error updating disease:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Disease with this name already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteDisease = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [existingDisease] = await db.select().from(diseaseSolutions).where(eq(diseaseSolutions.id, parseInt(id)));
        if (!existingDisease) {
            return res.status(404).json({ error: 'Disease not found' });
        }

        await db.delete(diseaseSolutions).where(eq(diseaseSolutions.id, parseInt(id)));

        res.json({ message: 'Disease deleted successfully' });
    } catch (error) {
        console.error('Error deleting disease:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getDiseasesByCommonName = async (req: Request, res: Response) => {
    try {
        const { commonName } = req.params;

        if (!commonName) {
            return res.status(400).json({ error: 'Common name is required' });
        }

        const diseases = await db.select()
            .from(diseaseSolutions)
            .where(ilike(diseaseSolutions.commonNames, `%${commonName}%`));

        res.json({ diseases });
    } catch (error) {
        console.error('Error getting diseases by common name:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
