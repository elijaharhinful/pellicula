import React, { useState } from 'react';
import { StarIcon, HeartIcon } from 'lucide-react';
import type { Movie, MovieDetails } from '../types';
import { useAuth } from '../contexts/AuthContext';

// Props interface for the MovieCard component
interface MovieCardProps {
  movie: Movie | MovieDetails;
  isFavourite?: boolean;
  onToggleFavourite?: (movieId: string, isFavourite: boolean) => void;
  onViewDetails?: (movie: Movie | MovieDetails) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavourite = false,
  onToggleFavourite,
  onViewDetails
}) => {
  // State for handling image loading errors and favourite toggle loading
  const [imageError, setImageError] = useState(false);
  const [isTogglingFavourite, setIsTogglingFavourite] = useState(false);
  const { user } = useAuth();

  // Handle favourite toggle with loading state management
  const handleToggleFavourite = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation(); // Prevent card click event
    if (!onToggleFavourite || isTogglingFavourite || !user) return;
    
    setIsTogglingFavourite(true);
    try {
      await onToggleFavourite(movie.id.toString(), isFavourite);
    } finally {
      setIsTogglingFavourite(false);
    }
  };

  // Handle clicking on the card to view details
  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(movie);
    }
  };

  // Get movie poster image URL with fallback
  const getImageUrl = (): string => {
    if (imageError || !movie.poster_path) {
      return '/placeholder-movie.jpg';
    }
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  };

  // Extract release year from date
  const getReleaseYear = (): number => {
    return movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
  };

  // Get movie rating with fallback
  const getRating = (): number => {
    return movie.vote_average || 0;
  };

  // Get truncated overview for card display
  const getOverview = (): string => {
    const overview = movie.overview || 'No description available.';
    return overview.length > 120 ? `${overview.substring(0, 120)}...` : overview;
  };

  return (
    <div 
      className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Movie Poster Container */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {/* Movie Poster Image */}
        <img
          src={getImageUrl()}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Hover Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite Toggle Button - Only show if user is logged in */}
        {user && onToggleFavourite && (
          <button
            onClick={handleToggleFavourite}
            disabled={isTogglingFavourite}
            className="absolute top-4 right-4 p-2 hover:bg-black/80 bg-black/60 backdrop-blur-sm rounded transition-colors disabled:opacity-50"
          >
            <HeartIcon 
              className={`h-5 w-5 transition-colors ${
                isFavourite 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-white hover:text-red-400'
              }`}
            />
          </button>
        )}

        {/* Rating Badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-yellow-400">
          <StarIcon className="h-4 w-4 fill-yellow-400" />
          <span className="text-sm font-medium">{getRating().toFixed(1)}</span>
        </div>

        {/* Note: Removed the View Details Button - the entire card is now clickable */}
      </div>

      {/* Movie Information Section */}
      <div className="p-4 space-y-2">
        {/* Movie Title */}
        <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
          {movie.title}
        </h3>
        
        {/* Release Year */}
        <p className="text-gray-400 text-sm">
          {getReleaseYear() || 'N/A'}
        </p>
        
        {/* Movie Overview/Description */}
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {getOverview()}
        </p>
      </div>
    </div>
  );
};