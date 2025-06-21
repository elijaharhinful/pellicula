import React, { useState } from 'react';
import { StarIcon } from 'lucide-react';
import type { Movie, MovieDetails } from '../types';

// Props interface for the HeroMovieCard component
interface HeroMovieCardProps {
  movie: Movie | MovieDetails;
  onViewDetails?: (movie: Movie | MovieDetails) => void;
}

// Hero movie card component for displaying movie information in a card format
export const HeroMovieCard: React.FC<HeroMovieCardProps> = ({
  movie,
  onViewDetails
}) => {
  // State to track if the movie poster image failed to load
  const [imageError, setImageError] = useState(false);

  // Handle click event on the card to trigger view details callback
  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(movie);
    }
  };

  // Get the appropriate image URL, falling back to placeholder if error or no poster
  const getImageUrl = (): string => {
    if (imageError || !movie.poster_path) {
      return '/placeholder-movie.jpg';
    }
    return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  };

  // Extract and return the release year from the release date
  const getReleaseYear = (): number => {
    return movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
  };

  // Get the movie rating, defaulting to 0 if not available
  const getRating = (): number => {
    return movie.vote_average || 0;
  };

  return (
    <div 
      className="group relative bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Movie Poster Container */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {/* Movie poster image */}
        <img
          src={getImageUrl()}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Hover overlay gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Movie rating badge with star icon */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-yellow-400">
          <StarIcon className="h-4 w-4 fill-yellow-400" />
          <span className="text-sm font-medium">{getRating().toFixed(1)}</span>
        </div>
      </div>

      {/* Movie information section */}
      <div className="p-4 space-y-2">
        {/* Movie title */}
        <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2">
          {movie.title}
        </h3>
        
        {/* Release year */}
        <p className="text-gray-400 text-sm">
          {getReleaseYear() || 'N/A'}
        </p>
      </div>
    </div>
  );
};