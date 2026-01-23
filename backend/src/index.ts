import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import scanRoutes from './routes/scans';
import productRoutes from './routes/products';
import diseaseRoutes from './routes/diseases';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8081',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/products', productRoutes);
app.use('/api/diseases', diseaseRoutes);

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
            diseases: '/api/diseases'
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
        console.log(`🚀 Server running on port ${port}`);
        console.log(`📁 Uploads directory: ${path.join(__dirname, '../uploads')}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}

export default app;
