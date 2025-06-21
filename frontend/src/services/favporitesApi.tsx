import api from './api';
import type { MovieDetails } from '../types';
import { trackActivity } from './trackActivity';

/**
 * Fetches all favourite movies for the authenticated user
 * @returns Promise with array of favourite movie details
 */
export const getFavourites = async (): Promise<MovieDetails[]> => {
  const response = await api.get('/favourites');
  return response.data;
};

/**
 * Adds a movie to user's favourites and tracks the activity
 * @param movieId - TMDB movie ID to add to favourites
 * @param movieTitle - Movie title for activity tracking
 * @param userId - User ID for activity tracking
 * @returns Promise that resolves when movie is added to favourites
 */
export const addToFavourites = async (movieId: string, movieTitle: string, userId: string): Promise<void> => {
  // Add movie to favourites via API
  await api.post('/favourites', { movieId });
  // Track the activity in localStorage
  trackActivity(userId, 'favourite_added', movieTitle);
};

/**
 * Removes a movie from user's favourites and tracks the activity
 * @param movieId - TMDB movie ID to remove from favourites
 * @param movieTitle - Movie title for activity tracking
 * @param userId - User ID for activity tracking
 * @returns Promise that resolves when movie is removed from favourites
 */
export const removeFromFavourites = async (movieId: string, movieTitle: string, userId: string): Promise<void> => {
  // Remove movie from favourites via API
  await api.delete(`/favourites/${movieId}`);
  // Track the activity in localStorage
  trackActivity(userId, 'favourite_removed', movieTitle);
};