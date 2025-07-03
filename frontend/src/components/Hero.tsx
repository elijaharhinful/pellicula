import { useState, useEffect } from 'react';
import { PlayCircle, StarIcon } from 'lucide-react';
import { getUpcomingMovies, getBackdropUrl } from '../services/movieApi';
import { HeroMovieCard } from './HeroMovieCard';
import type { Movie } from '../types';

// Hero component that displays a featured movie with backdrop and details
export const Hero = () => {
  // State for the currently featured movie
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  // Loading state for API calls
  const [loading, setLoading] = useState(true);
  // Error state for failed API calls
  const [error, setError] = useState<string | null>(null);
  // Flag to track if the featured movie is from upcoming movies
  const [isUpcomingMovie, setIsUpcomingMovie] = useState(false);

  // Effect to fetch and set a random upcoming movie on component mount
  useEffect(() => {
    const fetchRandomUpcomingMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to get upcoming movies first - fetch multiple pages for variety
        let upcomingMovies: Movie[] = [];
        const maxPages = 3; // Get first 3 pages to have more variety
        
        // Loop through multiple pages to get more movies
        for (let page = 1; page <= maxPages; page++) {
          try {
            const data = await getUpcomingMovies(page);
            
            // Combine movies from all pages
            if (data.movies && Array.isArray(data.movies) && data.movies.length > 0) {
              upcomingMovies = [...upcomingMovies, ...data.movies];
            }
          } catch (pageError) {
            console.warn(`Failed to fetch upcoming movies page ${page}:`, pageError);
            // Continue with other pages even if one fails
          }
        }
        
        // If we have upcoming movies, process and select one
        if (upcomingMovies.length > 0) {
          // Filter out movies without backdrop images for better hero display
          const moviesWithBackdrops = upcomingMovies.filter(movie => 
            movie.backdrop_path && movie.backdrop_path.trim() !== ''
          );
          
          // Use movies with backdrops if available, otherwise use all upcoming movies
          const moviesToChooseFrom = moviesWithBackdrops.length > 0 ? moviesWithBackdrops : upcomingMovies;
          
          // Select a random movie from the available options
          const randomIndex = Math.floor(Math.random() * moviesToChooseFrom.length);
          const randomMovie = moviesToChooseFrom[randomIndex];
          
          setFeaturedMovie(randomMovie);
          setIsUpcomingMovie(true);
          
        } else {
          // Fallback: try to get popular movies if no upcoming movies found
          try {
            const { getPopularMovies } = await import('../services/movieApi');
            const popularData = await getPopularMovies(1);
            
            if (popularData.movies && Array.isArray(popularData.movies) && popularData.movies.length > 0) {
              // Filter popular movies with backdrops
              const moviesWithBackdrops = popularData.movies.filter(movie => 
                movie.backdrop_path && movie.backdrop_path.trim() !== ''
              );
              
              const moviesToChooseFrom = moviesWithBackdrops.length > 0 ? moviesWithBackdrops : popularData.movies;
              const randomIndex = Math.floor(Math.random() * moviesToChooseFrom.length);
              const randomMovie = moviesToChooseFrom[randomIndex];
              
              setFeaturedMovie(randomMovie);
              setIsUpcomingMovie(false);
            } else {
              setError('No movies found');
            }
          } catch (err) {
            console.error('Error fetching popular movies:', err);
            setError('Failed to load movies');
          }
        }
      } catch (err) {
        console.error('Error in fetchRandomUpcomingMovie:', err);
        setError('Failed to load featured movie');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomUpcomingMovie();
  }, []);

  // Force reload function for retry button - resets state and refetches data
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setFeaturedMovie(null);
    setIsUpcomingMovie(false);
    
    // Re-trigger the same fetching logic as in useEffect
    const fetchRandomUpcomingMovie = async () => {
      try {
        let upcomingMovies: Movie[] = [];
        const maxPages = 3;
        
        // Fetch multiple pages of upcoming movies
        for (let page = 1; page <= maxPages; page++) {
          try {
            const data = await getUpcomingMovies(page);
            
            if (data.movies && Array.isArray(data.movies) && data.movies.length > 0) {
              upcomingMovies = [...upcomingMovies, ...data.movies];
            }
          } catch (pageError) {
            console.warn(`Retry - Failed to fetch page ${page}:`, pageError);
          }
        }
        
        // Process upcoming movies if available
        if (upcomingMovies.length > 0) {
          const moviesWithBackdrops = upcomingMovies.filter(movie => 
            movie.backdrop_path && movie.backdrop_path.trim() !== ''
          );
          const moviesToChooseFrom = moviesWithBackdrops.length > 0 ? moviesWithBackdrops : upcomingMovies;
          const randomIndex = Math.floor(Math.random() * moviesToChooseFrom.length);
          const randomMovie = moviesToChooseFrom[randomIndex];
          
          setFeaturedMovie(randomMovie);
          setIsUpcomingMovie(true);
        } else {
          // Fallback to popular movies
          const { getPopularMovies } = await import('../services/movieApi');
          const popularData = await getPopularMovies(1);
          
          if (popularData.movies && Array.isArray(popularData.movies) && popularData.movies.length > 0) {
            const moviesWithBackdrops = popularData.movies.filter(movie => 
              movie.backdrop_path && movie.backdrop_path.trim() !== ''
            );
            const moviesToChooseFrom = moviesWithBackdrops.length > 0 ? moviesWithBackdrops : popularData.movies;
            const randomIndex = Math.floor(Math.random() * moviesToChooseFrom.length);
            const randomMovie = moviesToChooseFrom[randomIndex];
            
            setFeaturedMovie(randomMovie);
            setIsUpcomingMovie(false);
          } else {
            setError('No movies found');
          }
        }
      } catch (err) {
        console.error('Retry error:', err);
        setError('Failed to load featured movie');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomUpcomingMovie();
  };

  // Loading state - show skeleton placeholders while fetching data
  if (loading) {
    return (
      <div className="relative h-screen w-full pt-16">
        {/* Loading background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
        <div className="max-w-[1200px] h-full mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between h-full gap-8">
            {/* Left side - Movie details loading skeleton */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="animate-pulse">
                {/* Movie info placeholders */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-4 w-12 bg-gray-600 rounded"></div>
                  <div className="h-4 w-16 bg-gray-600 rounded"></div>
                </div>
                {/* Title placeholder */}
                <div className="h-12 w-3/4 bg-gray-600 rounded mb-4"></div>
                {/* Overview placeholders */}
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-gray-600 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-600 rounded"></div>
                  <div className="h-4 w-4/6 bg-gray-600 rounded"></div>
                </div>
                {/* Button placeholder */}
                <div className="h-10 w-40 bg-gray-600 rounded"></div>
              </div>
            </div>
            
            {/* Right side - Movie card loading skeleton */}
            <div className="hidden xl:flex w-80 justify-center lg:justify-end">
              <div className="w-64 animate-pulse">
                {/* Movie poster placeholder */}
                <div className="aspect-[2/3] bg-gray-600 rounded-lg mb-4"></div>
                {/* Movie info placeholders */}
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-gray-600 rounded"></div>
                  <div className="h-3 w-1/2 bg-gray-600 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - show error message with retry option
  if (error || !featuredMovie) {
    return (
      <div className="relative h-screen w-full pt-16">
        {/* Error background */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800" />
        <div className="max-w-[1200px] h-full mx-auto px-6 sm:px-8 lg:px-12">
          <div className="relative z-10 flex flex-col justify-center h-full">
            {/* App title */}
            <h1 className="text-4xl font-bold mb-4 text-white">
              Welcome to PELLICULA
            </h1>
            {/* Error message */}
            <p className="max-w-xl text-gray-300 mb-6">
              Discover and explore your favorite movies. 
              {error && ` (${error})`}
            </p>
            {/* Action buttons */}
            <div className="flex gap-4">
              {/* Retry button */}
              <button 
                onClick={handleRetry}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-md w-fit hover:bg-red-700 transition-colors"
              >
                <PlayCircle size={20} />
                Retry
              </button>
              {/* Watch trailer button (placeholder) */}
              <button 
                className="flex items-center gap-2 bg-gray-600 text-white px-6 py-2 rounded-md w-fit hover:bg-gray-700 transition-colors"
              >
                <PlayCircle size={20} />
                Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Format release year from date string
  const releaseYear = featuredMovie.release_date 
    ? new Date(featuredMovie.release_date).getFullYear() 
    : 'TBA';

  // Format rating to one decimal place
  const rating = featuredMovie.vote_average 
    ? featuredMovie.vote_average.toFixed(1) 
    : 'N/A';

  // Main hero section with featured movie
  return (
    <div className="relative h-screen w-full lg:pt-16 sm:pt-0">
      {/* Background Image - movie backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000" 
        style={{
          backgroundImage: `url(${getBackdropUrl(featuredMovie.backdrop_path)})`
        }} 
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black z-10" style={{ opacity: 0.70 }} />

      {/* Main content container */}
      <div className="max-w-[1200px] h-full mx-auto px-6 sm:px-8 lg:px-12">
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between h-full gap-8">
          
          {/* Left side - Movie Details */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Movie metadata (year, rating, type) */}
            <div className="flex items-center gap-4 mb-2">
              {/* Release year */}
              <p className="text-gray-300">{releaseYear}</p>
              {/* Rating with star icon */}
              <div className="flex items-center gap-1">
                <StarIcon size={16} className="text-yellow-400" fill="currentColor" />
                <span className="text-white">{rating}</span>
              </div>
              {/* Movie type badge (upcoming/popular) */}
              <span className={`px-2 py-1 text-white text-xs rounded uppercase font-semibold ${
                isUpcomingMovie ? 'bg-red-600' : 'bg-blue-600'
              }`}>
                {isUpcomingMovie ? 'Upcoming' : 'Popular'}
              </span>
            </div>
            
            {/* Movie title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white max-w-4xl leading-tight">
              {featuredMovie.title}
            </h1>
            
            {/* Movie overview/description */}
            <p className="max-w-xl text-gray-300 mb-6 text-lg leading-relaxed">
              {featuredMovie.overview || 'An exciting movie you won\'t want to miss.'}
            </p>
            
            {/* Call-to-action buttons */}
            <div className="flex gap-4">
              {/* Watch trailer button */}
              <button className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-md w-fit hover:bg-red-700 transition-colors duration-200 font-semibold">
                <PlayCircle size={20} />
                Watch Trailer
              </button>
              {/* Get new movie button */}
              <button 
                onClick={handleRetry}
                className="flex items-center gap-2 bg-gray-700 text-white px-6 py-3 rounded-md w-fit hover:bg-gray-600 transition-colors duration-200 font-semibold"
              >
                Get New Movie
              </button>
            </div>
          </div>

          {/* Right side - Movie Card (hidden on smaller screens) */}
          <div className="justify-center lg:justify-end hidden xl:flex w-80">
            <div className="w-64">
              {/* Hero movie card component */}
              <HeroMovieCard 
                movie={featuredMovie}
                onViewDetails={() => {
                  // Handle view details if needed
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};