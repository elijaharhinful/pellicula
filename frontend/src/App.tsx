import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Film, Heart, Search, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import type { Movie, MovieDetails } from './types';
import { getMovieDetails } from './services/movieApi';

// Components
import MovieSearch from './components/MovieSearch';
import AuthModal from './components/AuthModal';
import MovieCard from './components/MovieCard';

// Pages
const HomePage: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [movieDetailsLoading, setMovieDetailsLoading] = useState(false);

  const handleMovieSelect = async (movie: Movie | MovieDetails): Promise<void> => {
    setMovieDetailsLoading(true);
    try {
      const details = await getMovieDetails(movie.id.toString());
      setSelectedMovie(details);
    } catch (error) {
      console.error('Failed to load movie details:', error);
    } finally {
      setMovieDetailsLoading(false);
    }
  };

  const closeMovieDetails = (): void => {
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MovieSearch onMovieSelect={handleMovieSelect} />
      
      {/* Movie Details Modal */}
      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedMovie.title}</h2>
                <button
                  onClick={closeMovieDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedMovie.poster_path 
                      ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` 
                      : '/placeholder-movie.jpg'
                    }
                    alt={selectedMovie.title}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Overview</h3>
                    <p className="text-gray-700">{selectedMovie.overview}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Release Date:</span> {selectedMovie.release_date}</p>
                      <p><span className="font-medium">Rating:</span> {selectedMovie.vote_average?.toFixed(1)}/10</p>
                      {selectedMovie.runtime && (
                        <p><span className="font-medium">Runtime:</span> {selectedMovie.runtime} minutes</p>
                      )}
                      {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                        <p><span className="font-medium">Genres:</span> {selectedMovie.genres.map(g => g.name).join(', ')}</p>
                      )}
                    </div>
                  </div>
                  
                  {selectedMovie.production_companies && selectedMovie.production_companies.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Production Companies</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.production_companies.map((company) => (
                          <span key={company.id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                            {company.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {movieDetailsLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

const FavouritesPage: React.FC = () => {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<MovieDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadFavourites();
    }
  }, [user]);

  const loadFavourites = async (): Promise<void> => {
    try {
      const { getFavourites } = await import('./services/movieApi');
      const favouriteMovies = await getFavourites();
      setFavourites(favouriteMovies);
    } catch (err) {
      console.log(err);
      setError('Failed to load favourites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavourite = async (movieId: string): Promise<void> => {
    try {
      const { removeFromFavourites } = await import('./services/movieApi');
      await removeFromFavourites(movieId);
      setFavourites(prev => prev.filter(movie => movie.id.toString() !== movieId));
    } catch (err) {
      console.error('Failed to remove favourite:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Login Required</h2>
          <p className="text-gray-600">Please login to view your favourite movies.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favourites</h1>
          <p className="text-gray-600">Your personal collection of favourite movies</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {favourites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No favourites yet</h2>
            <p className="text-gray-600 mb-4">Start adding movies to your favourites collection!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favourites.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavourite={true}
                onToggleFavourite={(movieId) => handleRemoveFavourite(movieId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Profile Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Username:</span> {user.username}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
                <p><span className="font-medium">Favourites:</span> {user.favourites?.length || 0} movies</p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="block w-full text-left text-sm text-green-700 hover:text-green-900 font-medium">
                  Browse Movies
                </button>
                <button className="block w-full text-left text-sm text-green-700 hover:text-green-900 font-medium">
                  View Favourites
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleAuthModalOpen = (mode: 'login' | 'register'): void => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthModalClose = (): void => {
    setAuthModalOpen(false);
  };

  const handleLogout = (): void => {
    logout();
    setMobileMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Film className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Pellicula</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Search className="h-4 w-4 mr-2" />
                Discover
              </a>
              
              {user && (
                <>
                  <a
                    href="/favourites"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/favourites' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Favourites
                  </a>
                  
                  <a
                    href="/dashboard"
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/dashboard' 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </a>
                </>
              )}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.username}!</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAuthModalOpen('login')}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => handleAuthModalOpen('register')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 p-2"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                <a
                  href="/"
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/' 
                      ? 'text-blue-600 bg-blue-50' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Discover
                </a>
                
                {user && (
                  <>
                    <a
                      href="/favourites"
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/favourites' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Favourites
                    </a>
                    
                    <a
                      href="/dashboard"
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === '/dashboard' 
                          ? 'text-blue-600 bg-blue-50' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </a>
                  </>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-2">
                    <p className="px-3 text-sm text-gray-600">Welcome, {user.username}!</p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md w-full text-left"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAuthModalOpen('login')}
                      className="block w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleAuthModalOpen('register')}
                      className="block w-full text-left px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/favourites" element={<FavouritesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleAuthModalClose}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default App;