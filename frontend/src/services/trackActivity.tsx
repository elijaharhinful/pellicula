import type { Activity } from "../types";

/**
 * Tracks user activity (favourite additions/removals) and stores in localStorage
 * @param userId - The user's unique identifier
 * @param type - Type of activity: 'favourite_added' or 'favourite_removed'
 * @param movieTitle - Title of the movie being favorited/unfavorited
 */
export const trackActivity = (userId: string, type: 'favourite_added' | 'favourite_removed', movieTitle: string) => {
  // Create new activity object
  const activity: Activity = {
    id: Date.now().toString(),
    type,
    movieTitle,
    timestamp: new Date()
  };

  // Get existing activities from localStorage
  const existingActivities = getStoredActivities(userId);
  
  // Add new activity to the beginning of the array
  const updatedActivities = [activity, ...existingActivities];
  
  // Keep only the last 50 activities to prevent localStorage from getting too large
  const limitedActivities = updatedActivities.slice(0, 50);
  
  // Store updated activities back to localStorage
  localStorage.setItem(`activities_${userId}`, JSON.stringify(limitedActivities));
};

/**
 * Retrieves stored activities for a user from localStorage
 * @param userId - The user's unique identifier
 * @returns Array of Activity objects, or empty array if none found or error occurs
 */
export const getStoredActivities = (userId: string): Activity[] => {
  try {
    // Retrieve activities from localStorage
    const stored = localStorage.getItem(`activities_${userId}`);
    if (stored) {
      // Parse JSON and convert timestamp strings back to Date objects
      return JSON.parse(stored).map((activity: any) => ({
        ...activity,
        timestamp: new Date(activity.timestamp)
      }));
    }
    return [];
  } catch (error) {
    // Handle JSON parsing errors or localStorage access issues
    console.error('Error reading activities from localStorage:', error);
    return [];
  }
};