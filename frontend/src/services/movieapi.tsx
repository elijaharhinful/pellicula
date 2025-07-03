import api from './api.js';
import type { Movie, MovieDetails, Genre } from '../types';

// TMDB image base URL from environment variables with fallback
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

/**
 * Constructs image URL for movie posters (standard quality)
 * @param path - Image path from TMDB API
 * @returns Full image URL or placeholder if path is null
 */
export const getImageUrl = (path: string | null): string => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

/**
 * Constructs high-quality backdrop image URL for hero sections
 * @param path - Backdrop image path from TMDB API
 * @returns Full original quality image URL or placeholder if path is null
 */
export const getBackdropUrl = (path: string | null): string => {
  if (!path) return '/placeholder-movie.jpg';
  return `https://image.tmdb.org/t/p/original${path}`;
};

/**
 * Searches movies by query string (basic search)
 * @param query - Search term
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with movies array and pagination info
 */
export const searchMovies = async (query: string, page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
  totalResults: number;
}> => {
  const response = await api.get('/movies/search', {
    params: { query, page }
  });
  return response.data;
};

/**
 * Enhanced search with optional year filter
 * @param query - Search term
 * @param year - Optional year filter
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with movies array and pagination info
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
  // Build params object conditionally
  const params: any = { query, page };
  if (year) {
    params.year = year;
  }
  
  const response = await api.get('/movies/search', { params });
  return response.data;
};

/**
 * Fetches popular movies from TMDB
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with popular movies array and pagination info
 */
export const getPopularMovies = async (page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  const response = await api.get('/movies/popular', {
    params: { page }
  });
  return response.data;
};

/**
 * Fetches upcoming movies from TMDB
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with upcoming movies array and pagination info
 */
export const getUpcomingMovies = async (page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  const response = await api.get('/movies/upcoming', {
    params: { page }
  });
  return response.data;
};

/**
 * Fetches detailed information for a specific movie
 * @param movieId - TMDB movie ID
 * @returns Promise with detailed movie information
 */
export const getMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  const response = await api.get(`/movies/${movieId}`);
  return response.data;
};

/**
 * Fetches movies filtered by genre
 * @param genreId - TMDB genre ID
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with movies array and pagination info
 */
export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  const response = await api.get(`/movies/genre/${genreId}`, {
    params: { page }
  });
  return response.data;
};

/**
 * Fetches movies filtered by release year
 * @param year - Release year
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with movies array and pagination info
 */
export const getMoviesByYear = async (year: number, page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  const response = await api.get('/movies/year', {
    params: { year, page }
  });
  return response.data;
};

/**
 * Fetches movies filtered by both genre and year (combined filtering)
 * @param genreId - TMDB genre ID
 * @param year - Release year
 * @param page - Page number for pagination (default: 1)
 * @returns Promise with movies array and pagination info
 */
export const getMoviesByGenreAndYear = async (
  genreId: number, 
  year: number, 
  page: number = 1
): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  const response = await api.get('/movies/filter', {
    params: { genre: genreId, year, page }
  });
  return response.data;
};

/**
 * Fetches all available movie genres
 * @returns Promise with array of available genres
 */
export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get('/movies/genres');
  return response.data;
};

/**
 * Fetches all available release years
 * @returns Promise with array of available years
 */
export const getYears = async (): Promise<number[]> => {
  const response = await api.get('/movies/years');
  return response.data;
};