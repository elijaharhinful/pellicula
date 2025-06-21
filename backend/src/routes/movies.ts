// ===== MOVIE ROUTES =====
import express from 'express';
import { 
  search, 
  getDetails, 
  getPopular, 
  getByGenre, 
  getAllGenres,
  getUpcoming,
  getByYear,
  getByGenreAndYear,
  getYears,
} from '../controllers/movieController';

const router = express.Router();

// Movie search endpoints
router.get('/search', search); // GET /api/v1/movies/search?query=avengers&page=1
router.get('/popular', getPopular); // GET /api/v1/movies/popular?page=1
router.get('/upcoming', getUpcoming); // GET /api/v1/movies/upcoming?page=1

// Genre-related endpoints
router.get('/genres', getAllGenres); // GET /api/v1/movies/genres - Get all available genres
router.get('/genre/:genreId', getByGenre); // GET /api/v1/movies/genre/28?page=1 - Movies by specific genre

// Year-based filtering endpoints
router.get('/year', getByYear); // GET /api/v1/movies/year?year=2023&page=1 - Movies by release year
router.get('/years', getYears); // GET /api/v1/movies/years - Get available years for filtering
router.get('/filter', getByGenreAndYear); // GET /api/v1/movies/filter?genre=28&year=2023&page=1 - Combined filter

// Movie details endpoint (must be last to avoid route conflicts)
router.get('/:id', getDetails); // GET /api/v1/movies/12345 - Get specific movie details

export default router;
