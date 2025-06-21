import axios from 'axios';
import { Movie, MovieDetails, Genre } from '../types';

// TMDB API configuration
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

// Create axios instance with default configuration for TMDB API
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY // Include API key in all requests
  }
});

/**
 * Search for movies by query string
 * @param query - Search term/title
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with movies array, total pages, and total results
 */
export const searchMovies = async (query: string, page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
  totalResults: number;
}> => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false // Exclude adult content from results
      }
    });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('TMDB search error:', error);
    throw new Error('Failed to search movies');
  }
};

/**
 * Get detailed information for a specific movie
 * @param movieId - TMDB movie ID
 * @returns Promise with detailed movie information
 */
export const getMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('TMDB movie details error:', error);
    throw new Error('Failed to fetch movie details');
  }
};

/**
 * Get all popular movies (trending/most popular)
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with popular movies array and total pages
 */
export const getPopularMovies = async (page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page }
    });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('TMDB popular movies error:', error);
    throw new Error('Failed to fetch popular movies');
  }
};

/**
 * Get all movies of a particular genre
 * @param genreId - TMDB genre ID
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with movies array and total pages, sorted by popularity
 */
export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc' // Sort by popularity descending
      }
    });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('TMDB genre movies error:', error);
    throw new Error('Failed to fetch movies by genre');
  }
};

/**
 * Get all available movie genres from TMDB
 * @returns Promise with array of genre objects (id, name)
 */
export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('TMDB genres error:', error);
    throw new Error('Failed to fetch genres');
  }
};

/**
 * Get upcoming movies (movies to be released soon)
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with upcoming movies array and total pages
 */
export const getUpcomingMovies = async (page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  try {
    const response = await tmdbApi.get('/movie/upcoming', {
      params: { page }
    });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('TMDB upcoming movies error:', error);
    throw new Error('Failed to fetch upcoming movies');
  }
};

/**
 * Get movies released in a specific year
 * @param year - Release year (e.g., 2023)
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with movies array and total pages, sorted by popularity
 */
export const getMoviesByYear = async (year: number, page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        primary_release_year: year,
        page,
        sort_by: 'popularity.desc' // Sort by popularity descending
      }
    });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('TMDB year movies error:', error);
    throw new Error('Failed to fetch movies by year');
  }
};

/**
 * Get movies filtered by both genre and release year
 * @param genreId - TMDB genre ID
 * @param year - Release year
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with filtered movies array and total pages
 */
export const getMoviesByGenreAndYear = async (
  genreId: number, 
  year: number, 
  page: number = 1
): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        primary_release_year: year,
        page,
        sort_by: 'popularity.desc' // Sort by popularity descending
      }
    });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('TMDB genre and year movies error:', error);
    throw new Error('Failed to fetch movies by genre and year');
  }
};

/**
 * Enhanced search with optional year filter
 * @param query - Search term/title
 * @param year - Optional release year filter
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with search results including movies, pagination info
 */
export const searchMoviesWithYear = async (
  query: string, 
  year?: number, 
  page: number = 1
): Promise<{
  movies: Movie[];
  totalPages: number;
  totalResults: number;
}> => {
  try {
    const params: any = {
      query,
      page,
      include_adult: false // Exclude adult content
    };

    // Add year filter if provided
    if (year) {
      params.year = year;
    }

    const response = await tmdbApi.get('/search/movie', { params });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('TMDB search with year error:', error);
    throw new Error('Failed to search movies with year filter');
  }
};

/**
 * Generate array of available years for filtering (1900 to current year)
 * Useful for year filter dropdowns in UI
 * @returns Array of years in descending order (newest first)
 */
export const getAvailableYears = (): number[] => {
  const currentYear = new Date().getFullYear();
  const startYear = 1900; // Starting from 1900 as earliest movie year
  const years: number[] = [];
  
  // Generate years from current year down to 1900
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  
  return years;
};