// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Import required dependencies
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import route modules
import authRoutes from './routes/auth';
import movieRoutes from './routes/movies';
import favouriteRoutes from './routes/favourites';

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000; // Use environment PORT or default to 5000

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing for all routes
app.use(express.json()); // Parse incoming JSON requests

// API route handlers - all routes are prefixed with /api/v1
app.use('/api/v1/auth', authRoutes); // Authentication routes (login, register, etc.)
app.use('/api/v1/movies', movieRoutes); // Movie-related operations (CRUD)
app.use('/api/v1/favourites', favouriteRoutes); // User favorites management

// Root endpoint - provides API status and guidance
app.get('/', (req, res) => {
  res.json({ message: 'Pellicula API is running! but use this as the correct endpoint /api/v1' });
});

// Main API endpoint - confirms service is operational
app.get('/api/v1', (req, res) => {
  res.json({ message: 'Pellicula API is running!' });
});

// Legacy API endpoint - redirects users to correct version
app.get('/api', (req, res) => {
  res.json({ message: 'Pellicula API is running! but use this as the correct endpoint /api/v1' });
});

// Database connection
// Connect to MongoDB using environment variable or fallback to local instance
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pelliculaDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// For Vercel deployment
export default app;

// Start the server
app.listen(PORT, () => {
  // Display different messages based on environment
  if (process.env.NODE_ENV == "development"){
    console.log(`Server running here: http://localhost:${PORT}`)
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});