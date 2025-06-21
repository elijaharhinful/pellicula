import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { User, Heart, Film, Calendar, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getFavourites } from '../services/favporitesApi';
import type { MovieDetails } from '../types';

// Activity interface for user actions tracking
interface Activity {
  id: string;
  type: 'favourite_added' | 'favourite_removed';
  movieTitle: string;
  timestamp: Date;
}

export const DashboardPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  
  // State for dashboard data
  const [favouriteMovies, setFavouriteMovies] = useState<MovieDetails[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data when component mounts
  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, []);

  // Fetch all dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Refresh user data to get latest favourites count
      await refreshUser();
      
      // Load favourite movies from API
      const favourites = await getFavourites();
      setFavouriteMovies(favourites);
      
      // Load recent activities from localStorage
      const storedActivities = localStorage.getItem(`activities_${user?.id}`);
      if (storedActivities) {
        const activities = JSON.parse(storedActivities).map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp)
        }));
        
        // Sort by timestamp (most recent first) and take only last 5
        const sortedActivities = activities
          .sort((a: Activity, b: Activity) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, 5);
        
        setRecentActivities(sortedActivities);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date to show only year
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.getFullYear().toString();
  };

  // Get relative time string for activities
  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - timestamp.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  // Redirect to home if user not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, <span className="text-red-600">{user.username}</span>
          </h1>
          <p className="text-gray-400">Your personal movie dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Favourite movies count card */}
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Favourite Movies</p>
                <p className="text-3xl font-bold text-white">{favouriteMovies.length}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Member since card */}
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Member Since</p>
                <p className="text-xl font-bold text-white">
                  {user.createdAt ? formatDate(user.createdAt) : '2024'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Information Card */}
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-white">Profile Information</h2>
            </div>
            
            {/* Profile details list */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-800">
                <span className="text-gray-400">Username</span>
                <span className="text-white font-medium">{user.username}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-800">
                <span className="text-gray-400">Email</span>
                <span className="text-white font-medium">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Favourite Movies</span>
                <span className="text-red-400 font-medium">{favouriteMovies.length}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-6 w-6 text-red-600" />
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            </div>
            
            {/* Action buttons */}
            <div className="space-y-4">
              {/* Browse movies action */}
              <Link 
                to="/" 
                className="flex items-center gap-3 p-4 bg-red-600/20 hover:bg-red-600/30 border border-red-600/50 rounded-lg transition-colors group"
              >
                <Film className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                <div>
                  <p className="text-white font-medium">Browse Movies</p>
                  <p className="text-gray-400 text-sm">Discover new films to watch</p>
                </div>
              </Link>

              {/* View favourites action */}
              <Link 
                to="/favorites" 
                className="flex items-center gap-3 p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/50 rounded-lg transition-colors group"
              >
                <Heart className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
                <div>
                  <p className="text-white font-medium">My Favourites</p>
                  <p className="text-gray-400 text-sm">View your saved movies</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-black/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          
          {recentActivities.length > 0 ? (
            // Activity list
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  {/* Activity icon */}
                  <div className="w-12 h-12 bg-red-600/20 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-red-400" />
                  </div>
                  {/* Activity details */}
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {activity.type === 'favourite_added' ? 'Added' : 'Removed'} "{activity.movieTitle}" 
                      {activity.type === 'favourite_added' ? ' to' : ' from'} favourites
                    </p>
                    <p className="text-gray-400 text-sm">{getRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty state for activities
            <div className="text-center py-8">
              <p className="text-gray-400">No recent activity to display</p>
              <p className="text-gray-500 text-sm mt-2">Start adding movies to your favourites to see activity here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};