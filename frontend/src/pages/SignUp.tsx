import React, { useState } from 'react';
import { FilmIcon, Mail, Lock, UserIcon, Loader2Icon, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * SignUp component - Handles user registration with form validation and success states
 * @returns JSX.Element - The complete signup form and success screen
 */
export const SignUp = () => {
  // Auth context and navigation hooks
  const { register } = useAuth();
  const navigate = useNavigate();
  
  // Component state management
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /**
   * Handles form submission with validation and registration
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Client-side validation for password matching
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Client-side validation for password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Attempt user registration
      await register(username, email, password);
      setSuccess(true);
      
      // Show success message briefly, then redirect to login with success message
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please sign in to continue.',
            type: 'success' 
          }
        });
      }, 2000);
      
    } catch (error: any) {
      // Handle registration errors
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success screen - shown after successful registration
  if (success) {
    return (
      <div className="min-h-[calc(100vh-136px)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="w-full max-w-md space-y-8 bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800 text-center">
          {/* Success icon */}
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Account Created!</h2>
          <p className="text-gray-400">
            Your account has been created successfully. Redirecting to login...
          </p>
          {/* Loading spinner during redirect */}
          <div className="flex justify-center">
            <Loader2Icon className="animate-spin h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    );
  }

  // Main signup form
  return (
    <div className="min-h-[calc(100vh-136px)] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-black to-gray-900">
      <div className="w-full max-w-md space-y-8 bg-black/50 backdrop-blur-sm p-8 rounded-lg border border-gray-800">
        {/* Header section with logo and title */}
        <div className="text-center">
          <div className="flex justify-center">
            <FilmIcon className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-gray-400">Join Pellicula today</p>
        </div>

        {/* Registration form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error message display */}
          {error && (
            <div className="bg-red-600/20 border border-red-600/50 text-red-400 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Form input fields */}
          <div className="space-y-4">
            {/* Username input with icon */}
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                required 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full bg-black/30 text-white pl-10 pr-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:border-red-600" 
                placeholder="Username" 
                disabled={isLoading}
                minLength={3}
              />
            </div>
            
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
                placeholder="Password (min. 6 characters)" 
                disabled={isLoading}
                minLength={6}
              />
            </div>
            
            {/* Confirm password input with icon */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                className="w-full bg-black/30 text-white pl-10 pr-4 py-3 border border-gray-700 rounded-md focus:outline-none focus:border-red-600" 
                placeholder="Confirm password" 
                disabled={isLoading}
                minLength={6}
              />
            </div>
          </div>

          {/* Submit button with loading state */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full flex justify-center items-center bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2Icon className="animate-spin h-5 w-5" /> : 'Create account'}
          </button>

          {/* Link to login page */}
          <div className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-red-600 hover:text-red-500">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};