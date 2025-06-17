import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Movie, Genre } from '../types';
import { searchMovies, getPopularMovies, getGenres, getMoviesByGenre } from '../services/movieApi';
import MovieCard from './MovieCard';
import { useAuth } from '../contexts/AuthContext';
import { addToFavourites, removeFromFavourites } from '../services/movieApi';

interface MovieSearchProps {
  onMovieSelect?: (movie: Movie) => void;
}

const MovieSearch: React.FC<MovieSearchProps> = ({ onMovieSelect }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [favouriteIds, setFavouriteIds] = useState<Set<string>>(new Set());
  
  const { user } = useAuth();

  // Load genres on component mount
  useEffect(() => {
    loadGenres();
    loadPopularMovies();
  }, []);

  // Load user favourites when user changes
  useEffect(() => {
    if (user) {
      setFavouriteIds(new Set(user.favourites));
    } else {
      setFavouriteIds(new Set());
    }
  }, [user]);

  const loadGenres = async (): Promise<void> => {
    try {
      const genreData = await getGenres();
      setGenres(genreData);
    } catch (err) {
      console.error('Failed to load genres:', err);
    }
  };

  const loadPopularMovies = async (): Promise<void> => {
    setLoading(true);
    setError('');
    try {
      const data = await getPopularMovies(1);
      setMovies(data.movies);
      setTotalPages(data.totalPages);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to load popular movies');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (searchQuery: string, page: number = 1): Promise<void> => {
    if (!searchQuery.trim()) {
      loadPopularMovies();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await searchMovies(searchQuery.trim(), page);
      setMovies(data.movies);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to search movies');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGenreFilter = async (genreId: number | null): Promise<void> => {
    setSelectedGenre(genreId);
    setQuery(''); // Clear search query when filtering by genre
    
    if (!genreId) {
      loadPopularMovies();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getMoviesByGenre(genreId, 1);
      setMovies(data.movies);
      setTotalPages(data.totalPages);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to load movies by genre');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavourite = async (movieId: string, isFavourite: boolean): Promise<void> => {
    if (!user) return;

    try {
      if (isFavourite) {
        await removeFromFavourites(movieId);
        setFavouriteIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(movieId);
          return newSet;
        });
      } else {
        await addToFavourites(movieId);
        setFavouriteIds(prev => new Set(prev).add(movieId));
      }
    } catch (err) {
      console.error('Failed to toggle favourite:', err);
    }
  };

  const handlePageChange = (newPage: number): void => {
    if (query.trim()) {
      handleSearch(query, newPage);
    } else if (selectedGenre) {
      handleGenreFilter(selectedGenre);
    } else {
      loadPopularMovies();
    }
  };

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [query, handleSearch]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedGenre || ''}
              onChange={(e) => handleGenreFilter(e.target.value ? parseInt(e.target.value) : null)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(query || selectedGenre) && (
          <div className="flex flex-wrap gap-2">
            {query && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                Search: "{query}"
                <button
                  onClick={() => setQuery('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
            {selectedGenre && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                Genre: {genres.find(g => g.id === selectedGenre)?.name}
                <button
                  onClick={() => handleGenreFilter(null)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && movies.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavourite={favouriteIds.has(movie.id.toString())}
                onToggleFavourite={user ? handleToggleFavourite : undefined}
                onViewDetails={onMovieSelect}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <span className="px-4 py-2 text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* No Results */}
      {!loading && movies.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {query ? `No movies found for "${query}"` : 'No movies to display'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;