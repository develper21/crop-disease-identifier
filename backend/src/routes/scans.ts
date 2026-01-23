import { Router } from 'express';
import { 
    createScan, 
    getMyScans, 
    getScanById, 
    updateScan, 
    deleteScan, 
    getScanStats,
    uploadImage 
} from '../controllers/scans';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Upload endpoint (doesn't require auth for the actual upload, but we'll add it)
router.post('/upload', authenticateToken, uploadImage);

// All other scan endpoints require authentication
router.use(authenticateToken);

router.post('/', createScan);
router.get('/', getMyScans);
router.get('/stats', getScanStats);
router.get('/:id', getScanById);
router.put('/:id', updateScan);
router.delete('/:id', deleteScan);

export default router;
