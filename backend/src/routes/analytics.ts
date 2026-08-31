import { Router } from 'express';
import { 
    getDashboardStats,
    getScanAnalytics,
    getUserAnalytics,
    getDiseaseAnalytics,
    getProductAnalytics,
    getTimeSeriesData,
    getGeographicData
} from '../controllers/analytics';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All analytics routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard overview
router.get('/dashboard', getDashboardStats);

// Detailed analytics
router.get('/scans', getScanAnalytics);
router.get('/users', getUserAnalytics);
router.get('/diseases', getDiseaseAnalytics);
router.get('/products', getProductAnalytics);

// Time series data
router.get('/timeseries', getTimeSeriesData);

// Geographic data
router.get('/geographic', getGeographicData);

export default router;
