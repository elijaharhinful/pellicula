// ===== AUTHENTICATION ROUTES =====
import express from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public authentication endpoints (no authentication required)
router.post('/register', register); // POST /api/v1/auth/register - Create new user account
router.post('/login', login); // POST /api/v1/auth/login - User login (returns JWT token)

// Protected endpoint (requires authentication)
router.get('/profile', authenticateToken, getProfile); // GET /api/v1/auth/profile - Get current user info

export default router;