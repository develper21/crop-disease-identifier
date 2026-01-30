import { Router } from 'express';
import { 
    getUsers, 
    getScans, 
    getProducts, 
    getDiseases,
    updateUser,
    deleteScan,
    updateProduct,
    updateDisease,
    getSystemStats
} from '../controllers/admin';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// User management
router.get('/users', getUsers);
router.put('/users/:id', updateUser);

// Content management
router.get('/scans', getScans);
router.delete('/scans/:id', deleteScan);
router.get('/products', getProducts);
router.put('/products/:id', updateProduct);
router.get('/diseases', getDiseases);
router.put('/diseases/:id', updateDisease);

// Analytics
router.get('/stats', getSystemStats);

export default router;
