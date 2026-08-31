import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import scanRoutes from './routes/scans';
import productRoutes from './routes/products';
import diseaseRoutes from './routes/diseases';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import i18nRoutes from './routes/i18n';
import { generalLimiter, authLimiter, uploadLimiter, adminLimiter } from './middleware/rateLimit';
import { extractLanguage } from './middleware/i18n';
import { coloredLogger } from './utils/coloredLogger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:8081',
    'http://localhost:8081',
    'http://10.200.184.78:8081',
    'http://localhost:3000',
    'http://10.200.184.78:3000'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply language extraction middleware
app.use(extractLanguage);

// Apply request logging middleware
app.use(coloredLogger.requestLogger());

// Apply general rate limiting to all API routes
app.use('/api', generalLimiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes with specific rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/scans', uploadLimiter, scanRoutes);
app.use('/api/products', productRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/admin', adminLimiter, adminRoutes);
app.use('/api/analytics', adminLimiter, analyticsRoutes);
app.use('/api/i18n', i18nRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API documentation endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Crop Disease API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            scans: '/api/scans',
            products: '/api/products',
            diseases: '/api/diseases',
            admin: '/api/admin',
            analytics: '/api/analytics',
            i18n: '/api/i18n'
        },
        documentation: 'https://your-docs-url.com'
    });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'File too large' });
    }
    
    if (err.code === '23505') {
        return res.status(409).json({ error: 'Resource already exists' });
    }
    
    res.status(err.status || 500).json({ 
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        coloredLogger.success('EXPRESS', 'SERVER_START', `Server running on port ${port}`, {
            port,
            environment: process.env.NODE_ENV || 'development',
            uploads: path.join(__dirname, '../uploads')
        });
    });
}

export default app;
