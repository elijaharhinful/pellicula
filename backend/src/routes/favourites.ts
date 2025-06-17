import express from 'express';
import { addToFavourites, removeFromFavourites, getFavourites } from '../controllers/favouriteController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All favourite routes require authentication
router.use(authenticateToken);

router.get('/', getFavourites);
router.post('/', addToFavourites);
router.delete('/:movieId', removeFromFavourites);

export default router;