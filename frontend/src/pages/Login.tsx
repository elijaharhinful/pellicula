import React, { useState, useEffect } from 'react';
import { FilmIcon, Mail, Lock, Loader2Icon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Login component - Handles user authentication with success message display
 * @returns JSX.Element - The complete login form
 */
export const Login = () => {
  // Auth context and navigation hooks
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Component state management
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Check for success message from signup redirect
   * Displays success message and auto-clears after 5 seconds
   */
  useEffect(() => {
    if (location.state?.message && location.state?.type === 'success') {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  /**
   * Handles form submission and user authentication
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Attempt user login
      await login(email, password);
      // Redirect to homepage on successful login
      navigate('/');
    } catch (error: any) {
      // Handle login errors
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-136px)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="w-full max-w-md space-y-8 bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800">
        {/* Header section with logo and title */}
        <div className="text-center">
          <div className="flex justify-center">
            <FilmIcon className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        {/* Login form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Success message display (from signup redirect) */}
          {successMessage && (
            <div className="bg-green-600/20 border border-green-600/50 text-green-400 px-4 py-3 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          
          {/* Error message display */}
          {error && (
            <div className="bg-red-600/20 border border-red-600/50 text-red-400 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Form input fields */}
          <div className="space-y-4">
            {/* Email input with icon */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full bg-black/30 text-white pl-10 pr-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:border-red-600" 
                placeholder="Email address" 
                disabled={isLoading}
              />
            </div>
            
            {/* Password input with icon */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full bg-black/30 text-white pl-10 pr-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:border-red-600" 
                placeholder="Password" 
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit button with loading state */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full flex justify-center items-center bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2Icon className="animate-spin h-5 w-5" /> : 'Sign in'}
          </button>

          {/* Link to signup page */}
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-red-600 hover:text-red-500">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};