import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Import page components
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { HomePage } from './pages/Homepage';
import { FavouritesPage } from './pages/Favourites';
import { DashboardPage } from './pages/Dashboard';

/**
 * Main App component that handles routing and layout structure
 * Sets up the overall application layout with navbar, main content area, and footer
 * @returns JSX.Element - The main application component
 */
export function App() {
  return (
    <div className="min-h-screen bg-black">
      {/* Fixed navigation bar at the top of the page */}
      <Navbar />
      
      {/* Main content area with routing */}
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        <Routes>
          {/* Home page route - default landing page */}
          <Route path="/" element={<HomePage />} />
          
          {/* Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* User-specific pages */}
          <Route path="/favorites" element={<FavouritesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          
          {/* Catch-all route - redirects any unmatched paths to home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Footer component at the bottom of the page */}
      <Footer />
    </div>
  );
}