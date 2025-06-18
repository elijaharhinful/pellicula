import api from './api';
import type { Movie, MovieDetails, Genre } from '../types';

const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

export const getImageUrl = (path: string | null): string => {
  if (!path) return '/placeholder-movie.jpg';
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

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

export const getMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  const response = await api.get(`/movies/${movieId}`);
  return response.data;
};

export const getPopularMovies = async (page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  const response = await api.get('/movies/popular', {
    params: { page }
  });
  return response.data;
};

export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  const response = await api.get(`/movies/genre/${genreId}`, {
    params: { page }
  });
  return response.data;
};

export const getGenres = async (): Promise<Genre[]> => {
  const response = await api.get('/movies/genres');
  return response.data;
};

// Favourites API
export const getFavourites = async (): Promise<MovieDetails[]> => {
  const response = await api.get('/favourites');
  return response.data;
};

export const addToFavourites = async (movieId: string): Promise<void> => {
  await api.post('/favourites', { movieId });
};

export const removeFromFavourites = async (movieId: string): Promise<void> => {
  await api.delete(`/favourites/${movieId}`);
};