import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';


// Import routes
import authRoutes from './routes/auth';
import movieRoutes from './routes/movies';
import favouriteRoutes from './routes/favourites';



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/favourites', favouriteRoutes);

// Root api
app.get('/', (req, res) => {
  res.json({ message: 'Pellicula API is running! but use this as the correct endpoint /api/v1' });
});
app.get('/api/v1', (req, res) => {
  res.json({ message: 'Pellicula API is running!' });
});
app.get('/api', (req, res) => {
  res.json({ message: 'Pellicula API is running! but use this as the correct endpoint /api/v1' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pelliculaDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.listen(PORT, () => {
  if (process.env.NODE_ENV == "development"){
    console.log(`Server running here: http://localhost:${PORT}`)
  } else {
    console.log(`Server running on port ${PORT}`);
  }
  
});