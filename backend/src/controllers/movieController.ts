import { Request, Response } from 'express';
import { 
  searchMovies, 
  getMovieDetails, 
  getPopularMovies, 
  getMoviesByGenre, 
  getGenres,
  getUpcomingMovies, 
  searchMoviesWithYear,
  getAvailableYears,
  getMoviesByGenreAndYear,
  getMoviesByYear,
} from '../utils/tmdbApi';

/**
 * Smart search controller that handles both basic and year-filtered searches
 * URL: GET /api/v1/movies/search?query=avengers&year=2019&page=1
 * @param req - Express request with query parameters (query, year?, page?)
 * @param res - Express response object
 */
export const search = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, year, page = 1 } = req.query;

    // Validate required search query parameter
    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const pageNum = parseInt(page as string) || 1;
    
    // If year is provided, use year-filtered search
    if (year) {
      const yearNum = parseInt(year as string);
      
      // Validate year range (1900 to current year)
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
        res.status(400).json({ message: 'Invalid year provided' });
        return;
      }
      
      const result = await searchMoviesWithYear(query, yearNum, pageNum);
      res.json(result);
    } else {
      // Use the original search without year filter
      const result = await searchMovies(query, pageNum);
      res.json(result);
    }
  } catch (error) {
    console.error('Movie search error:', error);
    res.status(500).json({ message: 'Failed to search movies' });
  }
};

/**
 * Get detailed information for a specific movie
 * URL: GET /api/v1/movies/:id
 * @param req - Express request with movie ID in params
 * @param res - Express response object
 */
export const getDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate movie ID parameter
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

/**
 * Get popular/trending movies
 * URL: GET /api/v1/movies/popular?page=1
 * @param req - Express request with optional page parameter
 * @param res - Express response object
 */
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

/**
 * Get movies filtered by specific genre
 * URL: GET /api/v1/movies/genre/:genreId?page=1
 * @param req - Express request with genreId in params and optional page query
 * @param res - Express response object
 */
export const getByGenre = async (req: Request, res: Response): Promise<void> => {
  try {
    const { genreId } = req.params;
    const { page = 1 } = req.query;

    // Validate required genre ID parameter
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

/**
 * Get all available movie genres from TMDB
 * URL: GET /api/v1/movies/genres
 * Used for populating genre filter dropdowns in UI
 * @param req - Express request object
 * @param res - Express response object
 */
export const getAllGenres = async (req: Request, res: Response): Promise<void> => {
  try {
    const genres = await getGenres();
    res.json(genres);
  } catch (error) {
    console.error('Genres fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch genres' });
  }
};

/**
 * Get upcoming movies (to be released soon)
 * URL: GET /api/v1/movies/upcoming?page=1
 * @param req - Express request with optional page parameter
 * @param res - Express response object
 */
export const getUpcoming = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1 } = req.query;
    const pageNum = parseInt(page as string) || 1;
    
    const result = await getUpcomingMovies(pageNum);
    res.json(result);
  } catch (error) {
    console.error('Upcoming movies error:', error);
    res.status(500).json({ message: 'Failed to fetch upcoming movies' });
  }
};

/**
 * Get movies filtered by release year
 * URL: GET /api/v1/movies/year?year=2023&page=1
 * @param req - Express request with year and optional page query parameters
 * @param res - Express response object
 */
export const getByYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { year, page = 1 } = req.query;

    // Validate required year parameter
    if (!year) {
      res.status(400).json({ message: 'Year is required' });
      return;
    }

    const pageNum = parseInt(page as string) || 1;
    const yearNum = parseInt(year as string);

    // Validate year range (1900 to current year)
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
      res.status(400).json({ message: 'Invalid year provided' });
      return;
    }

    const result = await getMoviesByYear(yearNum, pageNum);
    res.json(result);
  } catch (error) {
    console.error('Movies by year error:', error);
    res.status(500).json({ message: 'Failed to fetch movies by year' });
  }
};

/**
 * Get movies filtered by both genre and release year (combined filter)
 * URL: GET /api/v1/movies/filter?genre=28&year=2023&page=1
 * Useful for advanced filtering in UI
 * @param req - Express request with genre, year, and optional page query parameters
 * @param res - Express response object
 */
export const getByGenreAndYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { genre, year, page = 1 } = req.query;

    // Validate both required parameters
    if (!genre || !year) {
      res.status(400).json({ message: 'Both genre and year are required' });
      return;
    }

    const pageNum = parseInt(page as string) || 1;
    const genreNum = parseInt(genre as string);
    const yearNum = parseInt(year as string);

    // Validate numeric conversion
    if (isNaN(genreNum) || isNaN(yearNum)) {
      res.status(400).json({ message: 'Invalid genre or year provided' });
      return;
    }

    // Validate year range
    if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
      res.status(400).json({ message: 'Invalid year provided' });
      return;
    }

    const result = await getMoviesByGenreAndYear(genreNum, yearNum, pageNum);
    res.json(result);
  } catch (error) {
    console.error('Movies by genre and year error:', error);
    res.status(500).json({ message: 'Failed to fetch movies by genre and year' });
  }
};

/**
 * Enhanced search controller with explicit year support
 * URL: GET /api/v1/movies/searchWithYear?query=batman&year=2008&page=1
 * Alternative to the main search endpoint for clearer API semantics
 * @param req - Express request with query, optional year, and optional page parameters
 * @param res - Express response object
 */
export const searchWithYear = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query, year, page = 1 } = req.query;

    // Validate required search query
    if (!query || typeof query !== 'string') {
      res.status(400).json({ message: 'Search query is required' });
      return;
    }

    const pageNum = parseInt(page as string) || 1;
    let yearNum: number | undefined;

    // Validate year if provided (optional parameter)
    if (year) {
      yearNum = parseInt(year as string);
      if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear()) {
        res.status(400).json({ message: 'Invalid year provided' });
        return;
      }
    }

    const result = await searchMoviesWithYear(query, yearNum, pageNum);
    res.json(result);
  } catch (error) {
    console.error('Movie search with year error:', error);
    res.status(500).json({ message: 'Failed to search movies with year filter' });
  }
};

/**
 * Get all available years for filtering (1900 to current year)
 * URL: GET /api/v1/movies/years
 * Used for populating year filter dropdowns in UI
 * @param req - Express request object
 * @param res - Express response object
 */
export const getYears = async (req: Request, res: Response): Promise<void> => {
  try {
    const years = getAvailableYears();
    res.json(years);
  } catch (error) {
    console.error('Years fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch available years' });
  }
};