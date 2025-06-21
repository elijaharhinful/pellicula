import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import api from '../services/api';

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Props interface for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Authentication state
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app startup
  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  // Register a new user
  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      await api.post('/auth/register', { username, email, password });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Login user with email and password
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      // Store token and set user data
      localStorage.setItem('token', token);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Fetch user profile data from server
  const fetchUserProfile = async (): Promise<void> => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Remove invalid token
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data from server
  const refreshUser = async (): Promise<void> => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If token is invalid, clear it
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // Logout user and clear authentication data
  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Context value object
  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    refreshUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};