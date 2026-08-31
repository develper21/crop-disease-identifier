import { Request, Response } from 'express';
import { db } from '../db';
import { users, scans, products, diseaseSolutions } from '../db/schema';
import { eq, and, gte, lte, count, avg, sql, desc } from 'drizzle-orm';
import { cacheService } from '../services/cacheService';

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const cacheKey = 'analytics:dashboard';
        const cached = await cacheService.get(cacheKey);
        
        if (cached) {
            return res.json(cached);
        }

        // Basic counts
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

        // Average confidence
        const avgConfidence = await db.select({ avg: avg(scans.confidence) })
            .from(scans);

        // Top diseases
        const topDiseases = await db
            .select({
                diseaseName: sql<string>`json_extract_path_text(${scans.prediction}, '0', 'name')`,
                count: count()
            })
            .from(scans)
            .groupBy(sql`json_extract_path_text(${scans.prediction}, '0', 'name')`)
            .orderBy(desc(count()))
            .limit(5);

        const stats = {
            overview: {
                totalUsers: userCount[0].count,
                totalScans: scanCount[0].count,
                totalProducts: productCount[0].count,
                totalDiseases: diseaseCount[0].count,
                recentScans: recentScans[0].count,
                recentUsers: recentUsers[0].count,
                avgConfidence: Math.round(Number(avgConfidence[0].avg) || 0)
            },
            topDiseases: topDiseases.map(d => ({
                name: d.diseaseName,
                count: d.count
            }))
        };

        await cacheService.set(cacheKey, stats, { ttl: 300 }); // 5 minutes cache
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
};

export const getScanAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '7d' } = req.query;
        
        let startDate = new Date();
        switch (period) {
            case '1d':
                startDate.setDate(startDate.getDate() - 1);
                break;
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
        }

        // Scans over time
        const scansOverTime = await db
            .select({
                date: sql<string>`DATE(${scans.createdAt})`,
                count: count()
            })
            .from(scans)
            .where(gte(scans.createdAt, startDate))
            .groupBy(sql`DATE(${scans.createdAt})`)
            .orderBy(sql`DATE(${scans.createdAt})`);

        // Confidence distribution
        const confidenceDist = await db
            .select({
                range: sql<string>`
                    CASE 
                        WHEN ${scans.confidence} >= 80 THEN 'High (80-100%)'
                        WHEN ${scans.confidence} >= 60 THEN 'Medium (60-79%)'
                        ELSE 'Low (0-59%)'
                    END
                `,
                count: count()
            })
            .from(scans)
            .groupBy(sql`
                CASE 
                    WHEN ${scans.confidence} >= 80 THEN 'High (80-100%)'
                    WHEN ${scans.confidence} >= 60 THEN 'Medium (60-79%)'
                    ELSE 'Low (0-59%)'
                END
            `);

        // Low confidence scans
        const lowConfidenceScans = await db
            .select({ count: count() })
            .from(scans)
            .where(and(gte(scans.createdAt, startDate), eq(scans.isLowConf, true)));

        res.json({
            scansOverTime,
            confidenceDistribution: confidenceDist,
            lowConfidenceCount: lowConfidenceScans[0].count
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch scan analytics' });
    }
};

export const getUserAnalytics = async (req: Request, res: Response) => {
    try {
        const { period = '7d' } = req.query;
        
        let startDate = new Date();
        switch (period) {
            case '1d':
                startDate.setDate(startDate.getDate() - 1);
                break;
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
        }

        // User registration over time
        const userGrowth = await db
            .select({
                date: sql<string>`DATE(${users.createdAt})`,
                count: count()
            })
            .from(users)
            .where(gte(users.createdAt, startDate))
            .groupBy(sql`DATE(${users.createdAt})`)
            .orderBy(sql`DATE(${users.createdAt})`);

        // Language distribution
        const languageDist = await db
            .select({
                language: users.preferredLanguage,
                count: count()
            })
            .from(users)
            .groupBy(users.preferredLanguage);

        // Active users (users with scans in period)
        const activeUsers = await db
            .select({ distinctUsers: sql<string>`COUNT(DISTINCT ${scans.userId})` })
            .from(scans)
            .where(gte(scans.createdAt, startDate));

        // User activity levels
        const userActivity = await db
            .select({
                userId: scans.userId,
                scanCount: count()
            })
            .from(scans)
            .where(gte(scans.createdAt, startDate))
            .groupBy(scans.userId)
            .orderBy(desc(count()));

        res.json({
            userGrowth,
            languageDistribution: languageDist,
            activeUsers: parseInt(activeUsers[0].distinctUsers),
            userActivity: userActivity.slice(0, 10) // Top 10 most active
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user analytics' });
    }
};

export const getDiseaseAnalytics = async (req: Request, res: Response) => {
    try {
        // Most detected diseases
        const mostDetected = await db
            .select({
                diseaseName: sql<string>`json_extract_path_text(${scans.prediction}, '0', 'name')`,
                count: count(),
                avgConfidence: avg(scans.confidence)
            })
            .from(scans)
            .groupBy(sql`json_extract_path_text(${scans.prediction}, '0', 'name')`)
            .orderBy(desc(count()))
            .limit(10);

        // Disease trends over time
        const diseaseTrends = await db
            .select({
                date: sql<string>`DATE(${scans.createdAt})`,
                diseaseName: sql<string>`json_extract_path_text(${scans.prediction}, '0', 'name')`,
                count: count()
            })
            .from(scans)
            .where(gte(scans.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))) // Last 30 days
            .groupBy(sql`DATE(${scans.createdAt})`, sql`json_extract_path_text(${scans.prediction}, '0', 'name')`)
            .orderBy(sql`DATE(${scans.createdAt})`);

        // High confidence detections
        const highConfidenceDetections = await db
            .select({
                diseaseName: sql<string>`json_extract_path_text(${scans.prediction}, '0', 'name')`,
                count: count()
            })
            .from(scans)
            .where(and(gte(scans.confidence, 80), gte(scans.createdAt, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))))
            .groupBy(sql`json_extract_path_text(${scans.prediction}, '0', 'name')`)
            .orderBy(desc(count()));

        res.json({
            mostDetected,
            diseaseTrends,
            highConfidenceDetections
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch disease analytics' });
    }
};

export const getProductAnalytics = async (req: Request, res: Response) => {
    try {
        // Product views (this would require tracking views in a separate table)
        // For now, we'll return basic product stats
        const productStats = await db
            .select({
                category: products.category,
                count: count(),
                avgPrice: avg(products.price)
            })
            .from(products)
            .groupBy(products.category);

        // Most expensive/cheapest products
        const priceRanges = await db
            .select({
                range: sql<string>`
                    CASE 
                        WHEN ${products.price} >= 1000 THEN 'Premium (>=₹1000)'
                        WHEN ${products.price} >= 500 THEN 'Mid-range (₹500-999)'
                        WHEN ${products.price} > 0 THEN 'Budget (₹1-499)'
                        ELSE 'Free'
                    END
                `,
                count: count()
            })
            .from(products)
            .groupBy(sql`
                CASE 
                    WHEN ${products.price} >= 1000 THEN 'Premium (>=₹1000)'
                    WHEN ${products.price} >= 500 THEN 'Mid-range (₹500-999)'
                    WHEN ${products.price} > 0 THEN 'Budget (₹1-499)'
                    ELSE 'Free'
                END
            `);

        res.json({
            categoryStats: productStats,
            priceDistribution: priceRanges
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product analytics' });
    }
};

export const getTimeSeriesData = async (req: Request, res: Response) => {
    try {
        const { metric = 'scans', period = '30d' } = req.query;
        
        let startDate = new Date();
        switch (period) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
        }

        let data;
        switch (metric) {
            case 'scans':
                data = await db
                    .select({
                        date: sql<string>`DATE(${scans.createdAt})`,
                        value: count()
                    })
                    .from(scans)
                    .where(gte(scans.createdAt, startDate))
                    .groupBy(sql`DATE(${scans.createdAt})`)
                    .orderBy(sql`DATE(${scans.createdAt})`);
                break;
            case 'users':
                data = await db
                    .select({
                        date: sql<string>`DATE(${users.createdAt})`,
                        value: count()
                    })
                    .from(users)
                    .where(gte(users.createdAt, startDate))
                    .groupBy(sql`DATE(${users.createdAt})`)
                    .orderBy(sql`DATE(${users.createdAt})`);
                break;
            default:
                return res.status(400).json({ error: 'Invalid metric' });
        }

        res.json({ metric, period, data });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch time series data' });
    }
};

export const getGeographicData = async (req: Request, res: Response) => {
    try {
        // This would require location data from users
        // For now, return mock data structure
        res.json({
            message: 'Geographic data requires location tracking',
            mockData: [
                { region: 'North India', users: 150, scans: 450 },
                { region: 'South India', users: 120, scans: 380 },
                { region: 'East India', users: 80, scans: 220 },
                { region: 'West India', users: 100, scans: 310 },
                { region: 'Central India', users: 60, scans: 180 }
            ]
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch geographic data' });
    }
};
