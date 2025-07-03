import { useState, useEffect } from 'react';
import { FilmIcon, Menu, X, LogOut, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = () => {
  // Get auth state and functions from context
  const { user, logout, loading } = useAuth();
  
  // Mobile menu toggle state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get current location for active nav highlighting
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  /**
   * Handle user logout and close mobile menu
   */
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  /**
   * Toggle mobile menu open/closed state
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Show loading skeleton while auth is being determined
  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <FilmIcon className="text-red-600" />
            <span className="font-bold text-white">PELLICULA</span>
          </div>
          {/* Loading placeholder */}
          <div className="animate-pulse">
            <div className="h-4 w-20 bg-gray-600 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center py-4">
          {/* Logo - Links to home page */}
          <Link to="/" className="flex items-center gap-2">
            <FilmIcon className="text-red-600 h-6 w-6" />
            <span className="font-bold text-white text-lg">PELLICULA</span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            {/* Navigation Links */}
            <div className="flex gap-6 text-gray-300">
              <Link 
                to="/" 
                className={`hover:text-white transition-colors ${
                  location.pathname === '/' ? 'text-white' : ''
                }`}
              >
                Home
              </Link>
              
              {/* Show favorites link only when user is logged in */}
              {user && (
                <Link 
                  to="/favorites" 
                  className={`hover:text-white transition-colors ${
                    location.pathname === '/favorites' ? 'text-white' : ''
                  }`}
                >
                  My Favorites
                </Link>
              )}
              
              {/* Show dashboard link only when user is logged in */}
              {user && (
                <Link 
                  to="/dashboard" 
                  className={`hover:text-white transition-colors ${
                    location.pathname === '/dashboard' ? 'text-white' : ''
                  }`}
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* Desktop Auth Section */}
            <div className="flex items-center gap-4">
              {user ? (
                // Authenticated user section
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm">
                    Welcome, <span className="text-white font-medium">{user.username}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 text-gray-300 hover:text-white hover:bg-red-600/20 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                // Guest user section
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button - Only visible on mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Only shown when mobile menu is open */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <div className="space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors ${
                    location.pathname === '/' ? 'text-white bg-white/10' : ''
                  }`}
                >
                  Home
                </Link>
                
                {/* Show authenticated user links only when logged in */}
                {user && (
                  <>
                    <Link
                      to="/favorites"
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors ${
                        location.pathname === '/favorites' ? 'text-white bg-white/10' : ''
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                      My Favorites
                    </Link>
                    
                    <Link
                      to="/dashboard"
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors ${
                        location.pathname === '/dashboard' ? 'text-white bg-white/10' : ''
                      }`}
                    >
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </>
                )}
              </div>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-white/10">
                {user ? (
                  // Authenticated user mobile section
                  <div className="space-y-3">
                    <p className="px-3 text-sm text-gray-400">
                      Welcome, <span className="text-white font-medium">{user.username}</span>
                    </p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded-md w-full text-left transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  // Guest user mobile section
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-center transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};