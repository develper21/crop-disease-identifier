import { Request, Response } from 'express';
import { db } from '../db';
import { products } from '../db/schema';
import { eq, ilike, or, desc, asc, and, sql } from 'drizzle-orm';

export const listProducts = async (req: Request, res: Response) => {
    try {
        const { 
            category, 
            query, 
            disease, 
            page = '1', 
            limit = '10',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const offset = (pageNum - 1) * limitNum;

        let dbQuery = db.select().from(products);

        // Apply filters
        const conditions = [];
        
        if (category) {
            conditions.push(eq(products.category, category as string));
        }

        if (query) {
            conditions.push(or(
                ilike(products.name, `%${query}%`),
                ilike(products.description, `%${query}%`)
            ));
        }

        if (disease) {
            conditions.push(ilike(products.targetDiseases, `%${disease}%`));
        }

        if (conditions.length > 0) {
            // @ts-ignore
            dbQuery = dbQuery.where(and(...conditions));
        }

        // Apply sorting
        const orderBy = sortOrder === 'asc' ? asc : desc;
        // @ts-ignore
        dbQuery = dbQuery.orderBy(orderBy(products[sortBy as keyof typeof products] || products.createdAt));

        // Get total count
        const countQuery = db.select({ count: sql`count(*)` }).from(products);
        if (conditions.length > 0) {
            // @ts-ignore
            countQuery.where(and(...conditions));
        }
        const [{ count }] = await countQuery;

        // Apply pagination
        // @ts-ignore
        const results = await dbQuery.limit(limitNum).offset(offset);

        const totalPages = Math.ceil(parseInt(count as string) / limitNum);

        res.json({
            products: results,
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
        console.error('Error listing products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [product] = await db.select().from(products).where(eq(products.id, parseInt(id)));
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, category, description, price, imageUrl, targetDiseases } = req.body;

        if (!name || !category) {
            return res.status(400).json({ error: 'Name and category are required' });
        }

        const [newProduct] = await db.insert(products).values({
            name,
            category,
            description,
            price: price ? parseInt(price) : null,
            imageUrl,
            targetDiseases: targetDiseases || null,
        }).returning();

        res.status(201).json(newProduct);
    } catch (error: any) {
        console.error('Error creating product:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Product with this name already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, category, description, price, imageUrl, targetDiseases } = req.body;

        const [existingProduct] = await db.select().from(products).where(eq(products.id, parseInt(id)));
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const [updatedProduct] = await db.update(products)
            .set({
                name: name || existingProduct.name,
                category: category || existingProduct.category,
                description: description !== undefined ? description : existingProduct.description,
                price: price !== undefined ? (price ? parseInt(price) : null) : existingProduct.price,
                imageUrl: imageUrl !== undefined ? imageUrl : existingProduct.imageUrl,
                targetDiseases: targetDiseases !== undefined ? targetDiseases : existingProduct.targetDiseases,
            })
            .where(eq(products.id, parseInt(id)))
            .returning();

        res.json(updatedProduct);
    } catch (error: any) {
        console.error('Error updating product:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Product with this name already exists' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [existingProduct] = await db.select().from(products).where(eq(products.id, parseInt(id)));
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await db.delete(products).where(eq(products.id, parseInt(id)));

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const searchProducts = async (req: Request, res: Response) => {
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
            .from(products)
            .where(or(
                ilike(products.name, searchQuery),
                ilike(products.description, searchQuery),
                ilike(products.category, searchQuery),
                ilike(products.targetDiseases, searchQuery)
            ))
            .limit(limitNum)
            .offset(offset);

        const [{ count }] = await db.select({ count: sql`count(*)` })
            .from(products)
            .where(or(
                ilike(products.name, searchQuery),
                ilike(products.description, searchQuery),
                ilike(products.category, searchQuery),
                ilike(products.targetDiseases, searchQuery)
            ));

        const totalPages = Math.ceil(parseInt(count as string) / limitNum);

        res.json({
            products: results,
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
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
