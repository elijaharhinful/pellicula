import { Response } from 'express';
import User from '../models/user';
import { AuthRequest } from '../types';
import { getMovieDetails } from '../utils/tmdbApi';

export const addToFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { movieId } = req.body;
    const userId = req.user?.userId;

    if (!movieId) {
      res.status(400).json({ message: 'Movie ID is required' });
      return;
    }

    // Verify movie exists in TMDB
    try {
      await getMovieDetails(movieId);
    } catch (error) {
      res.status(404).json({ message: 'Movie not found' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if already in favourites
    if (user.favourites.includes(movieId)) {
      res.status(400).json({ message: 'Movie already in favourites' });
      return;
    }

    user.favourites.push(movieId);
    await user.save();

    res.json({ 
      message: 'Movie added to favourites',
      favourites: user.favourites
    });
  } catch (error) {
    console.error('Add to favourites error:', error);
    res.status(500).json({ message: 'Failed to add movie to favourites' });
  }
};

export const removeFromFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { movieId } = req.params;
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.favourites = user.favourites.filter(id => id !== movieId);
    await user.save();

    res.json({ 
      message: 'Movie removed from favourites',
      favourites: user.favourites
    });
  } catch (error) {
    console.error('Remove from favourites error:', error);
    res.status(500).json({ message: 'Failed to remove movie from favourites' });
  }
};

export const getFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Fetch movie details for each favourite
    const favouriteMovies = await Promise.all(
      user.favourites.map(async (movieId) => {
        try {
          return await getMovieDetails(movieId);
        } catch (error) {
          console.error(`Failed to fetch details for movie ${movieId}:`, error);
          return null;
        }
      })
    );

    // Filter out any null results
    const validFavourites = favouriteMovies.filter(movie => movie !== null);

    res.json(validFavourites);
  } catch (error) {
    console.error('Get favourites error:', error);
    res.status(500).json({ message: 'Failed to fetch favourites' });
  }
};
