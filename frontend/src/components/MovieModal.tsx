import React, { useEffect } from 'react';
import { X, StarIcon, CalendarIcon, ClockIcon, PlayCircle, HeartIcon } from 'lucide-react';
import type { Movie, MovieDetails } from '../types';
import { useAuth } from '../contexts/AuthContext';

// Props interface for the MovieModal component
interface MovieModalProps {
  movie: Movie | MovieDetails | null;
  isOpen: boolean;
  onClose: () => void;
  isFavourite?: boolean;
  onToggleFavourite?: (movieId: string, isFavourite: boolean) => void;
}

export const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  isOpen,
  onClose,
  isFavourite = false,
  onToggleFavourite
}) => {
  const { user } = useAuth();

  // Handle modal close on escape key and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if modal is closed or no movie data
  if (!isOpen || !movie) return null;

  // Handle clicking on backdrop to close modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle favourite toggle functionality
  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onToggleFavourite || !user) return;
    await onToggleFavourite(movie.id.toString(), isFavourite);
  };

  // Get TMDB image URL with fallback
  const getImageUrl = (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder-movie.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  // Extract release year from date
  const getReleaseYear = (): string => {
    return movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A';
  };

  // Format release date for display
  const getFormattedDate = (): string => {
    if (!movie.release_date) return 'N/A';
    return new Date(movie.release_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Convert runtime minutes to hours and minutes format
  const getRuntime = (): string => {
    // Check if this is MovieDetails with runtime property
    if ('runtime' in movie && movie.runtime) {
      const hours = Math.floor(movie.runtime / 60);
      const minutes = movie.runtime % 60;
      return `${hours}h ${minutes}m`;
    }
    return 'N/A';
  };

  // Get comma-separated list of genres
  const getGenres = (): string => {
    // Check if this is MovieDetails with genres property
    if ('genres' in movie && movie.genres && movie.genres.length > 0) {
      return movie.genres.map(genre => genre.name).join(', ');
    }
    return 'N/A';
  };

  // Format rating to one decimal place
  const getRating = (): string => {
    return movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  };

  // Format vote count with locale-specific number formatting
  const getVoteCount = (): string => {
    return movie.vote_count ? movie.vote_count.toLocaleString() : '0';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Backdrop Image */}
        <div className="relative h-64 md:h-80 overflow-hidden rounded-t-lg">
          <img
            src={getImageUrl(movie.backdrop_path, 'w1280')}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        {/* Main Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <img
                src={getImageUrl(movie.poster_path, 'w342')}
                alt={movie.title}
                className="w-48 rounded-lg shadow-lg mx-auto md:mx-0"
              />
            </div>

            {/* Movie Details */}
            <div className="flex-1 space-y-4">
              {/* Title and Release Year */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                <p className="text-gray-400 text-lg">{getReleaseYear()}</p>
              </div>

              {/* Rating and Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Rating Display */}
                <div className="flex items-center gap-1 text-yellow-400">
                  <StarIcon className="h-5 w-5 fill-yellow-400" />
                  <span className="font-semibold">{getRating()}</span>
                  <span className="text-gray-400 text-sm">({getVoteCount()} votes)</span>
                </div>

                {/* Favourite Toggle Button - Only show if user is logged in */}
                {user && onToggleFavourite && (
                  <button
                    onClick={handleToggleFavourite}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <HeartIcon 
                      className={`h-5 w-5 ${
                        isFavourite 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-white'
                      }`}
                    />
                    <span className="text-white">
                      {isFavourite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </span>
                  </button>
                )}

                {/* Watch Trailer Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors">
                  <PlayCircle size={20} />
                  <span className="text-white">Watch Trailer</span>
                </button>
              </div>

              {/* Movie Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {/* Release Date */}
                <div className="flex items-center gap-2 text-gray-300">
                  <CalendarIcon size={16} />
                  <span>Release Date: {getFormattedDate()}</span>
                </div>
                
                {/* Runtime - Only show if available */}
                {getRuntime() !== 'N/A' && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <ClockIcon size={16} />
                    <span>Runtime: {getRuntime()}</span>
                  </div>
                )}
              </div>

              {/* Genres - Only show if available */}
              {getGenres() !== 'N/A' && (
                <div className="text-gray-300">
                  <span className="font-semibold">Genres: </span>
                  <span>{getGenres()}</span>
                </div>
              )}

              {/* Movie Overview */}
              <div className="text-gray-300">
                <h3 className="font-semibold text-white mb-2">Overview</h3>
                <p className="leading-relaxed">
                  {movie.overview || 'No overview available for this movie.'}
                </p>
              </div>

              {/* Production Companies - Only show for MovieDetails type */}
              {'production_companies' in movie && movie.production_companies && movie.production_companies.length > 0 && (
                <div className="text-gray-300">
                  <h3 className="font-semibold text-white mb-2">Production Companies</h3>
                  <p>{movie.production_companies.map(company => company.name).join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};