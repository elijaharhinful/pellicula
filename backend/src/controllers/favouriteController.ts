import { Response } from 'express';
import User from '../models/user';
import { AuthRequest } from '../types';
import { getMovieDetails } from '../utils/tmdbApi';

/**
 * Add a movie to user's favourites list
 * URL: POST /api/v1/favourites
 * Body: { movieId: string }
 * Requires: JWT authentication
 * @param req - Authenticated request containing user info and movie ID in body
 * @param res - Express response object
 */
export const addToFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { movieId } = req.body;
    const userId = req.user?.userId; // Extract user ID from JWT token

    // Validate required movie ID
    if (!movieId) {
      res.status(400).json({ message: 'Movie ID is required' });
      return;
    }

    // Verify movie exists in TMDB before adding to favourites
    // This prevents adding non-existent movies to user's list
    try {
      await getMovieDetails(movieId);
    } catch (error) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }

    // Find the authenticated user in database
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if movie is already in user's favourites to prevent duplicates
    if (user.favourites.includes(movieId)) {
      res.status(400).json({ message: 'Movie already in favourites' });
      return;
    }

    // Add movie to favourites array and save to database
    user.favourites.push(movieId);
    await user.save();

    // Return success response with updated favourites list
    res.json({ 
      message: 'Movie added to favourites',
      favourites: user.favourites
    });
  } catch (error) {
    console.error('Add to favourites error:', error);
    res.status(500).json({ message: 'Failed to add movie to favourites' });
  }
};

/**
 * Remove a movie from user's favourites list
 * URL: DELETE /api/v1/favourites/:movieId
 * Requires: JWT authentication
 * @param req - Authenticated request with movie ID in URL params
 * @param res - Express response object
 */
export const removeFromFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { movieId } = req.params; // Extract movie ID from URL parameter
    const userId = req.user?.userId; // Extract user ID from JWT token

    // Find the authenticated user in database
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Remove movie from favourites array using filter
    // This operation is safe even if movieId doesn't exist in the array
    user.favourites = user.favourites.filter(id => id !== movieId);
    await user.save();

    // Return success response with updated favourites list
    res.json({ 
      message: 'Movie removed from favourites',
      favourites: user.favourites
    });
  } catch (error) {
    console.error('Remove from favourites error:', error);
    res.status(500).json({ message: 'Failed to remove movie from favourites' });
  }
};

/**
 * Get user's complete favourites list with full movie details
 * URL: GET /api/v1/favourites
 * Requires: JWT authentication
 * Returns: Array of complete movie objects (not just IDs)
 * @param req - Authenticated request containing user info
 * @param res - Express response object
 */
export const getFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId; // Extract user ID from JWT token

    // Find the authenticated user in database
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Fetch complete movie details for each favourite movie ID
    // Using Promise.all for concurrent API calls to improve performance
    const favouriteMovies = await Promise.all(
      user.favourites.map(async (movieId) => {
        try {
          return await getMovieDetails(movieId);
        } catch (error) {
          // Log error but don't fail entire request for one movie
          console.error(`Failed to fetch details for movie ${movieId}:`, error);
          return null; // Return null for failed fetches
        }
      })
    );

    // Filter out any null results from failed API calls
    // This ensures we only return valid movie objects
    const validFavourites = favouriteMovies.filter(movie => movie !== null);

    // Return array of complete movie objects
    res.json(validFavourites);
  } catch (error) {
    console.error('Get favourites error:', error);
    res.status(500).json({ message: 'Failed to fetch favourites' });
  }
};