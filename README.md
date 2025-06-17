# Movie Discovery App

A full-stack web application that enables movie enthusiasts to search for movies, view detailed information, and manage personal favorite collections with secure user authentication.

## 🎬 Features

- **Movie Search**: Search movies by title with real-time results from TMDB API
- **Detailed Movie Information**: View comprehensive movie details including cast, plot, ratings, and more
- **User Authentication**: Secure registration and login system
- **Favorites Management**: Add, remove, and organize your favorite movies
- **Personal Dashboard**: Manage your profile and view your movie collections
- **Advanced Filtering**: Filter movies by genre and release year
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/movie-discovery-app.git
   cd movie-discovery-app
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/movie-discovery
   JWT_SECRET=your-secret-key-here
   TMDB_API_KEY=your-tmdb-api-key
   TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
   ```

### Running the Application

1. **Start the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`

2. **Start the Frontend**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Movies
- `GET /movies/search?query=title` - Search movies by title
- `GET /movies/:id` - Get detailed movie information

### Favorites
- `GET /favorites` - Get user's favorite movies (protected)
- `POST /favorites` - Add movie to favorites (protected)
- `DELETE /favorites/:movieId` - Remove movie from favorites (protected)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie API
- React and Node.js communities for excellent documentation and resources