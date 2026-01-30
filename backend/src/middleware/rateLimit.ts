import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// General API rate limiting
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many requests from this IP, please try again later.',
            retryAfter: '15 minutes'
        });
    }
});

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 auth requests per windowMs
    message: {
        error: 'Too many authentication attempts, please try again later.',
        retryAfter: '15 minutes'
    },
    skipSuccessfulRequests: true,
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many authentication attempts, please try again later.',
            retryAfter: '15 minutes'
        });
    }
});

// Rate limiting for file uploads
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 uploads per hour
    message: {
        error: 'Too many upload requests, please try again later.',
        retryAfter: '1 hour'
    },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many upload requests, please try again later.',
            retryAfter: '1 hour'
        });
    }
});

// Rate limiting for ML predictions
export const predictionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // Limit each IP to 50 predictions per hour
    message: {
        error: 'Too many prediction requests, please try again later.',
        retryAfter: '1 hour'
    },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many prediction requests, please try again later.',
            retryAfter: '1 hour'
        });
    }
});

// Rate limiting for admin endpoints
export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Higher limit for admin operations
    message: {
        error: 'Too many admin requests, please try again later.',
        retryAfter: '15 minutes'
    },
    handler: (req: Request, res: Response) => {
        res.status(429).json({
            error: 'Too many admin requests, please try again later.',
            retryAfter: '15 minutes'
        });
    }
});

// Custom rate limiter for user-specific operations
const userRequestCounts = new Map<string, { count: number; resetTime: number }>();

export const userSpecificLimiter = (maxRequests: number, windowMs: number) => {
    return (req: any, res: Response, next: Function) => {
        const userId = req.user?.userId || req.ip;
        const now = Date.now();
        const userRequests = userRequestCounts.get(userId);

        if (!userRequests || now > userRequests.resetTime) {
            userRequestCounts.set(userId, {
                count: 1,
                resetTime: now + windowMs
            });
            return next();
        }

        if (userRequests.count >= maxRequests) {
            return res.status(429).json({
                error: 'Too many requests, please try again later.',
                retryAfter: Math.ceil((userRequests.resetTime - now) / 1000) + ' seconds'
            });
        }

        userRequests.count++;
        next();
    };
};

// Cleanup function to remove old entries
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of userRequestCounts.entries()) {
        if (now > value.resetTime) {
            userRequestCounts.delete(key);
        }
    }
}, 5 * 60 * 1000); // Cleanup every 5 minutes
