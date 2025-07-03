import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, ChevronDownIcon } from 'lucide-react';
import type { Movie, Genre, MovieDetails } from '../types';
import { 
  searchMovies, 
  searchMoviesWithYear,
  getGenres, 
  getYears,
  getMoviesByGenre, 
  getMoviesByYear,
  getMoviesByGenreAndYear
} from '../services/movieApi';
import { addToFavourites, removeFromFavourites } from '../services/favoritesApi';
import { MovieCard } from './MovieCard';
import { useAuth } from '../contexts/AuthContext';
import { MovieModal } from './MovieModal';

interface SearchSectionProps {
  onMovieSelect?: (movie: Movie) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = () => {
  // Search and filtering state
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [yearOpen, setYearOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // Track if user has performed any search
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  // Favourites state
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  const [favourites, setFavourites] = useState<string[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | MovieDetails | null>(null);
  
  // Refs for dropdown click detection
  const yearRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);
  
  // Get current user from auth context
  const { user } = useAuth();

  // Load initial data (genres and years) on component mount
  useEffect(() => {
    loadGenres();
    loadYears();
  }, []);

  // Update favourite IDs when user changes (login/logout)
  useEffect(() => {
    if (user) {
      setFavouriteIds(new Set(user.favourites));
    } else {
      setFavouriteIds(new Set());
    }
  }, [user]);

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setYearOpen(false);
      }
      if (genreRef.current && !genreRef.current.contains(event.target as Node)) {
        setGenreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Load available genres from the API
   */
  const loadGenres = async (): Promise<void> => {
    try {
      const genreData = await getGenres();
      setGenres(genreData);
    } catch (err) {
      console.error('Failed to load genres:', err);
    }
  };

  /**
   * Load available years from the API
   * Falls back to static years (2025-2000) if API fails
   */
  const loadYears = async (): Promise<void> => {
    try {
      const yearData = await getYears();
      setYears(yearData);
    } catch (err) {
      console.error('Failed to load years:', err);
      // Fallback to static years if API fails
      setYears(Array.from({ length: 26 }, (_, i) => 2025 - i));
    }
  };

  /**
   * Perform search based on current filters and query
   * Determines which API endpoint to call based on active filters
   */
  const performSearch = async (page: number = 1): Promise<void> => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    
    try {
      let data;
      
      // Determine which API call to make based on active filters
      if (query.trim()) {
        // Text search (with optional year filter)
        if (selectedYear) {
          data = await searchMoviesWithYear(query.trim(), selectedYear, page);
        } else {
          data = await searchMovies(query.trim(), page);
        }
      } else if (selectedGenre && selectedYear) {
        // Both genre and year filter
        data = await getMoviesByGenreAndYear(selectedGenre, selectedYear, page);
      } else if (selectedGenre) {
        // Genre filter only
        data = await getMoviesByGenre(selectedGenre, page);
      } else if (selectedYear) {
        // Year filter only
        data = await getMoviesByYear(selectedYear, page);
      } else {
        // No filters - clear results
        setMovies([]);
        setTotalPages(0);
        setHasSearched(false);
        return;
      }
      
      // Update state with search results
      setMovies(data.movies);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Failed to search movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle genre filter selection
   * Triggers new search if other filters are active
   */
  const handleGenreFilter = async (genreId: number | null): Promise<void> => {
    setSelectedGenre(genreId);
    setGenreOpen(false);
    
    // If no filters are selected, clear results
    if (!genreId && !selectedYear && !query.trim()) {
      setMovies([]);
      setHasSearched(false);
      return;
    }
    
    await performSearch(1);
  };

  /**
   * Handle year filter selection
   * Triggers new search if other filters are active
   */
  const handleYearFilter = async (year: number | null): Promise<void> => {
    setSelectedYear(year);
    setYearOpen(false);
    
    // If no filters are selected, clear results
    if (!year && !selectedGenre && !query.trim()) {
      setMovies([]);
      setHasSearched(false);
      return;
    }
    
    await performSearch(1);
  };

  /**
   * Clear all search filters and results
   */
  const clearAllFilters = (): void => {
    setQuery('');
    setSelectedGenre(null);
    setSelectedYear(null);
    setMovies([]);
    setHasSearched(false);
    setError('');
  };

  /**
   * Toggle favourite status for a movie
   * Adds or removes movie from user's favourites list
   */
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

  /**
   * Open movie details modal
   */
  const handleViewDetails = (movie: Movie | MovieDetails) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };
  
  /**
   * Close movie details modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  /**
   * Handle pagination - navigate to different page
   */
  const handlePageChange = (newPage: number): void => {
    performSearch(newPage);
  };

  // Debounced search effect - triggers search 500ms after user stops typing
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        performSearch(1);
      } else if (!selectedGenre && !selectedYear) {
        // Clear results if no query and no filters
        setMovies([]);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  /**
   * Get display name for selected genre
   */
  const getSelectedGenreName = () => {
    if (!selectedGenre) return 'All Genres';
    return genres.find(g => g.id === selectedGenre)?.name || 'All Genres';
  };

  /**
   * Generate search results title based on active filters
   */
  const getSearchTitle = (): string => {
    const parts = [];
    if (query.trim()) parts.push(`"${query}"`);
    if (selectedGenre) {
      const genreName = genres.find(g => g.id === selectedGenre)?.name;
      parts.push(genreName);
    }
    if (selectedYear) parts.push(`${selectedYear}`);
    
    if (parts.length === 0) return 'Search Results';
    return `Search Results: ${parts.join(' • ')}`;
  };

  return (
    <div className="bg-black py-12">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Search Header - Contains filters and search input */}
        <div className="flex flex-col md:flex-row md-items-center md:justify-between lg:flex-row lg:items-center lg:justify-between gap-4 py-4 border-b border-white/10 mb-8">
          <div className="flex items-center gap-6">
            {/* Year Filter Dropdown */}
            <div className="relative" ref={yearRef}>
              <button 
                className="flex items-center gap-1 text-white hover:text-red-500 whitespace-nowrap" 
                onClick={() => {
                  setYearOpen(!yearOpen);
                  setGenreOpen(false);
                }}
              >
                {selectedYear ? `Year: ${selectedYear}` : 'By Year'}
                <ChevronDownIcon size={16} />
              </button>
              {yearOpen && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-[#111] border border-white/10 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                  <button 
                    className="w-full text-left px-4 py-2 text-white hover:bg-red-500/10 hover:text-red-500  whitespace-nowrap"
                    onClick={() => handleYearFilter(null)}
                  >
                    All Years
                  </button>
                  {years.map(year => (
                    <button 
                      key={year} 
                      className="w-full text-left px-4 py-2 text-white hover:bg-red-500/10 hover:text-red-500  whitespace-nowrap"
                      onClick={() => handleYearFilter(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Genre Filter Dropdown */}
            <div className="relative" ref={genreRef}>
              <button 
                className="flex items-center gap-1 text-white hover:text-red-500  whitespace-nowrap" 
                onClick={() => {
                  setGenreOpen(!genreOpen);
                  setYearOpen(false);
                }}
              >
                {getSelectedGenreName()}
                <ChevronDownIcon size={16} />
              </button>
              {genreOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#111] border border-white/10 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                  <button 
                    className="w-full text-left px-4 py-2 text-white hover:bg-red-500/10 hover:text-red-500  whitespace-nowrap"
                    onClick={() => handleGenreFilter(null)}
                  >
                    All Genres
                  </button>
                  {genres.map(genre => (
                    <button 
                      key={genre.id} 
                      className="w-full text-left px-4 py-2 text-white hover:bg-red-500/10 hover:text-red-500  whitespace-nowrap"
                      onClick={() => handleGenreFilter(genre.id)}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filters Button - Only show when filters are active */}
            {(query || selectedGenre || selectedYear) && (
              <button 
                onClick={clearAllFilters}
                className="text-red-500 hover:text-red-400 text-sm whitespace-nowrap"
              >
                Clear All
              </button>
            )}
          </div>
          
          {/* Search Input */}
          <div className="relative w-full lg:w-auto">
            <input 
              type="text" 
              placeholder="Search movies" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent text-white pl-4 pr-10 py-1 border-b border-white/20 focus:outline-none focus:border-red-500 w-full lg:w-[340px]" 
            />
            <SearchIcon size={18} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60" />
          </div>
        </div>

        {/* Search Results Section - Only show if user has performed a search */}
        {hasSearched && (
          <>
            {/* Search Results Title */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">{getSearchTitle()}</h2>
              {movies.length > 0 && (
                <p className="text-gray-400 mt-1">{movies.length} results found</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded">
                {error}
              </div>
            )}

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            )}

            {/* Movies Grid - 4 columns to match MovieGrid layout */}
            {!loading && movies.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      isFavourite={favouriteIds.has(movie.id.toString())}
                      onToggleFavourite={user ? handleToggleFavourite : undefined}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mb-12">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-gray-400 border border-gray-700 rounded disabled:opacity-50 hover:bg-gray-800 hover:text-white transition-colors disabled:hover:bg-transparent disabled:hover:text-gray-400"
                    >
                      Previous
                    </button>
                    
                    <span className="text-white">
                      Page {currentPage} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-white border border-gray-700 rounded hover:bg-red-600 hover:border-red-600 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-gray-700"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

            {/* No Results Message */}
            {!loading && movies.length === 0 && !error && (
              <div className="text-center py-12 mb-12">
                <p className="text-white/60 text-lg">
                  No movies found for your search criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Movie Details Modal */}
      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isFavourite={selectedMovie ? favourites.includes(selectedMovie.id.toString()) : false}
        onToggleFavourite={user ? handleToggleFavourite : undefined}
      />
    </div>
  );
};