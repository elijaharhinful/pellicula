// ===== FAVOURITE ROUTES =====
import express from 'express';
import { addToFavourites, removeFromFavourites, getFavourites } from '../controllers/favouriteController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all favourite routes
// All endpoints require valid JWT token in Authorization header
router.use(authenticateToken);

// Favourite management endpoints (all protected)
router.get('/', getFavourites); // GET /api/v1/favourites - Get user's favourite movies
router.post('/', addToFavourites); // POST /api/v1/favourites - Add movie to favourites
router.delete('/:movieId', removeFromFavourites); // DELETE /api/v1/favourites/12345 - Remove from favourites

export default router;