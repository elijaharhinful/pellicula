import { Request, Response } from 'express';
import { 
  searchMovies, 
  getMovieDetails, 
  getPopularMovies, 
  getMoviesByGenre, 
  getGenres 
} from '../utils/tmdbApi';

export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, page = 1 } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const pageNum = parseInt(page as string) || 1;
    const result = await searchMovies(query, pageNum);

    res.json(result);
  } catch (error) {
    console.error('Movie search error:', error);
    res.status(500).json({ message: 'Failed to search movies' });
  }
};

export const getDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Movie ID is required' });
      return;
    }

    const movie = await getMovieDetails(id);
    res.json(movie);
  } catch (error) {
    console.error('Movie details error:', error);
    res.status(500).json({ message: 'Failed to fetch movie details' });
  }
};

export const getPopular = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1 } = req.query;
    const pageNum = parseInt(page as string) || 1;
    
    const result = await getPopularMovies(pageNum);
    res.json(result);
  } catch (error) {
    console.error('Popular movies error:', error);
    res.status(500).json({ message: 'Failed to fetch popular movies' });
  }
};

export const getByGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;

    if (!genreId) {
      res.status(400).json({ message: 'Genre ID is required' });
      return;
    }

    const pageNum = parseInt(page as string) || 1;
    const genreIdNum = parseInt(genreId);
    
    const result = await getMoviesByGenre(genreIdNum, pageNum);
    res.json(result);
  } catch (error) {
    console.error('Movies by genre error:', error);
    res.status(500).json({ message: 'Failed to fetch movies by genre' });
  }
};

export const getAllGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const genres = await getGenres();
    res.json(genres);
  } catch (error) {
    console.error('Genres fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
};