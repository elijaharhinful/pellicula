import { useState, useEffect } from 'react';
import { MovieCard } from './MovieCard';
import { MovieModal } from './MovieModal';
import { getPopularMovies } from '../services/temp';
import { addToFavourites, getFavourites, removeFromFavourites } from '../services/favoritesApi';
import { useAuth } from '../contexts/AuthContext';
import type { Movie, MovieDetails } from '../types';

export const MovieGrid = () => {
  // State for managing movies and pagination
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // State for modal management
  const [selectedMovie, setSelectedMovie] = useState<Movie | MovieDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { user } = useAuth();

  // Load movies and user favourites on component mount and page changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load popular movies from API
        const moviesData = await getPopularMovies(currentPage);
        setMovies(moviesData.movies);
        setTotalPages(moviesData.totalPages);

        // Load user favourites if logged in
        if (user) {
          try {
            const favouritesData = await getFavourites();
            const favouriteIds = favouritesData.map(movie => movie.id.toString());
            setFavourites(favouriteIds);
          } catch (favError) {
            console.error('Error loading favourites:', favError);
            // Don't show error for favourites, just continue
          }
        }
      } catch (err) {
        console.error('Error loading movies:', err);
        setError('Failed to load movies');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentPage, user]);

  // Handle adding/removing movies from favourites
  const handleToggleFavourite = async (movieId: string, isFavourite: boolean) => {
    if (!user) return;

    try {
      // Find the movie to get its title for the API call
      const movie = movies.find(m => m.id.toString() === movieId) || 
        (selectedMovie && selectedMovie.id.toString() === movieId ? selectedMovie : null);
      
      const movieTitle = movie?.title || 'Unknown Movie';
      
      if (isFavourite) {
        // Remove from favourites
        await removeFromFavourites(movieId, movieTitle, user.id);
        setFavourites(prev => prev.filter(id => id !== movieId));
      } else {
        // Add to favourites
        await addToFavourites(movieId, movieTitle, user.id);
        setFavourites(prev => [...prev, movieId]);
      }
    } catch (error) {
      console.error('Error toggling favourite:', error);
      // TODO: show a toast notification here
    }
  };

  // Handle opening movie details modal
  const handleViewDetails = (movie: Movie | MovieDetails) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  // Handle closing movie details modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of movie grid for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading state with skeleton loaders
  if (loading) {
    return (
      <div className="bg-black py-12">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-white mb-8">Popular Movies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Generate 8 skeleton loading cards */}
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-800 aspect-[2/3] rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-800 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="bg-black py-12">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-white mb-8">Popular Movies</h2>
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-black py-12">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl font-bold text-white mb-8">Popular Movies</h2>
          
          {/* Movie Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavourite={favourites.includes(movie.id.toString())}
                onToggleFavourite={user ? handleToggleFavourite : undefined}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center gap-4">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-4 py-2 text-gray-400 border border-gray-700 rounded disabled:opacity-50 hover:bg-gray-800 hover:text-white transition-colors disabled:hover:bg-transparent disabled:hover:text-gray-400"
            >
              Previous
            </button>
            
            {/* Current Page Indicator */}
            <span className="text-white">
              Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
            </span>
            
            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 text-white border border-gray-700 rounded hover:bg-red-600 hover:border-red-600 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Movie Details Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavourite={selectedMovie ? favourites.includes(selectedMovie.id.toString()) : false}
        onToggleFavourite={user ? handleToggleFavourite : undefined}
      />
    </>
  );
};