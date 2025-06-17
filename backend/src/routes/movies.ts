import express from 'express';
import { 
  search, 
  getDetails, 
  getPopular, 
  getByGenre, 
  getAllGenres 
} from '../controllers/movieController';

const router = express.Router();

router.get('/search', search);
router.get('/popular', getPopular);
router.get('/genres', getAllGenres);
router.get('/genre/:genreId', getByGenre);
router.get('/:id', getDetails);

export default router;