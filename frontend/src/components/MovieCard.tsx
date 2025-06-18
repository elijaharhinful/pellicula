import React, { useState } from 'react';
import { Heart, Star, Calendar, Info } from 'lucide-react';
import type { Movie, MovieDetails } from '../types';
import { getImageUrl } from '../services/movieApi';
import { useAuth } from '../contexts/AuthContext';

interface MovieCardProps {
  movie: Movie | MovieDetails;
  isFavourite?: boolean;
  onToggleFavourite?: (movieId: string, isFavourite: boolean) => void;
  onViewDetails?: (movie: Movie | MovieDetails) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  isFavourite = false, 
  onToggleFavourite,
  onViewDetails 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isTogglingFavourite, setIsTogglingFavourite] = useState(false);
  const { user } = useAuth();

  const handleToggleFavourite = async (): Promise<void> => {
    if (!onToggleFavourite || isTogglingFavourite) return;
    
    setIsTogglingFavourite(true);
    try {
      await onToggleFavourite(movie.id.toString(), isFavourite);
    } finally {
      setIsTogglingFavourite(false);
    }
  };

  const getReleaseYear = (): string => {
    return movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A';
  };

  const getRating = (): string => {
    return movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={imageError ? '/placeholder-movie.jpg' : getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-64 object-cover"
          onError={() => setImageError(true)}
        />
        
        {user && onToggleFavourite && (
          <button
            onClick={handleToggleFavourite}
            disabled={isTogglingFavourite}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isFavourite 
                ? 'bg-red-500 text-white' 
                : 'bg-white text-gray-600 hover:text-red-500'
            } shadow-md transition-colors duration-200 disabled:opacity-50`}
          >
            <Heart 
              className={`h-5 w-5 ${isFavourite ? 'fill-current' : ''}`} 
            />
          </button>
        )}

        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
          <Star className="h-4 w-4 mr-1 fill-current text-yellow-400" />
          {getRating()}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{movie.title}</h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Calendar className="h-4 w-4 mr-1" />
          {getReleaseYear()}
        </div>

        <p className="text-gray-700 text-sm mb-3 line-clamp-3">
          {movie.overview || 'No description available.'}
        </p>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(movie)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          >
            <Info className="h-4 w-4 mr-2" />
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default MovieCard;