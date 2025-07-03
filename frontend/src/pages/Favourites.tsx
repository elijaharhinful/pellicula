import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Heart, Film, Star, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getFavourites, removeFromFavourites } from '../services/favoritesApi';
import { FavouriteMovieCard } from '../components/FavouriteMovieCard';
import { MovieModal } from '../components/MovieModal';
import type { MovieDetails } from '../types';
import { getMovieDetails } from '../services/movieApi';

export const FavouritesPage: React.FC = () => {
  const { user } = useAuth();
  
  // State for favourites list and UI management
  const [favourites, setFavourites] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state for movie details
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load favourites when user is available
  useEffect(() => {
    if (user) {
      loadFavourites();
    }
  }, [user]);

  // Fetch user's favourite movies from API
  const loadFavourites = async (): Promise<void> => {
    try {
      const favouriteMovies = await getFavourites();
      setFavourites(favouriteMovies);
    } catch (err) {
      console.log(err);
      setError('Failed to load favourites');
    } finally {
      setLoading(false);
    }
  };

  // Remove a movie from favourites
  const handleRemoveFavourite = async (movieId: string): Promise<void> => {
    if (!user) return;
    
    try {
      // Get movie details to get the title
      const movie = await getMovieDetails(movieId);
      const movieTitle = movie?.title || 'Unknown Movie';

      // Remove from API and update local state
      await removeFromFavourites(movieId, movieTitle, user.id);
      setFavourites(prev => prev.filter(movie => movie.id.toString() !== movieId));
    } catch (err) {
      console.error('Failed to remove favourite:', err);
    }
  };

  // Open movie details modal
  const handleViewDetails = (movie: MovieDetails) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  // Close movie details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  // Handle favourite toggle from modal
  const handleToggleFavourite = async (movieId: string, isFavourite: boolean) => {
    if (!user) return;

    try {
      if (isFavourite) {
        // Get movie details and remove from favourites
        const movie = await getMovieDetails(movieId);
        const movieTitle = movie?.title || 'Unknown Movie';

        await removeFromFavourites(movieId, movieTitle, user.id);
        setFavourites(prev => prev.filter(movie => movie.id.toString() !== movieId));
        
        // Close modal if current movie was removed
        if (selectedMovie && selectedMovie.id.toString() === movieId) {
          handleCloseModal();
        }
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
    }
  };

  // Redirect to home if user not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your favourites...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            {/* Back to dashboard link */}
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            
            {/* Page title */}
            <div className="flex items-center gap-3 mb-2">
              <Heart className="h-8 w-8 text-red-600" />
              <h1 className="text-4xl font-bold text-white">My Favourites</h1>
            </div>
            <p className="text-gray-400">Your personal collection of favourite movies</p>
          </div>

          {/* Stats Bar */}
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {/* Movie count */}
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5 text-red-600" />
                  <span className="text-white font-medium">{favourites.length} Movies</span>
                </div>
                {/* Average rating */}
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-gray-400">
                    Avg Rating: {favourites.length > 0 
                      ? (favourites.reduce((sum, movie) => sum + movie.vote_average, 0) / favourites.length).toFixed(1)
                      : '0.0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4 mb-8">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Main Content */}
          {favourites.length === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-12 max-w-md mx-auto">
                <Heart className="h-16 w-16 text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">No Favourites Yet</h3>
                <p className="text-gray-400 mb-6">
                  Start adding movies to your favourites collection!
                </p>
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Film className="h-4 w-4" />
                  Browse Movies
                </Link>
              </div>
            </div>
          ) : (
            // Favourites grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favourites.map((movie) => (
                <FavouriteMovieCard
                  key={movie.id}
                  movie={movie}
                  onRemoveFavourite={handleRemoveFavourite}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Footer Actions */}
          {favourites.length > 0 && (
            <div className="mt-12 text-center">
              <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Manage Your Collection</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {/* Add more movies button */}
                  <Link 
                    to="/"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Film className="h-4 w-4" />
                    Add More Movies
                  </Link>
                  {/* Rate all movies button */}
                  <button className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-lg transition-colors">
                    <Star className="h-4 w-4" />
                    Rate All Movies
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Movie Details Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavourite={selectedMovie ? favourites.some(fav => fav.id.toString() === selectedMovie.id.toString()) : false}
        onToggleFavourite={handleToggleFavourite}
      />
    </>
  );
};