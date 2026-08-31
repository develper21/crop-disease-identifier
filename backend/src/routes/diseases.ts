import { Router } from 'express';
import { 
    getAllDiseases, 
    searchDiseases, 
    getDiseaseById, 
    createDisease, 
    updateDisease, 
    deleteDisease,
    getDiseasesByCommonName 
} from '../controllers/diseases';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllDiseases);
router.get('/search', searchDiseases);
router.get('/common/:commonName', getDiseasesByCommonName);
router.get('/:id', getDiseaseById);

// Protected routes (require authentication)
router.post('/', authenticateToken, createDisease);
router.put('/:id', authenticateToken, updateDisease);
router.delete('/:id', authenticateToken, deleteDisease);

export default router;
