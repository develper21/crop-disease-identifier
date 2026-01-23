import { Router } from 'express';
import { 
    listProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    searchProducts 
} from '../controllers/products';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', listProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
