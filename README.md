# Pellicula

A web application that enables movie enthusiasts to search for movies, view detailed information, and manage personal favorite collections with secure user authentication.

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

#### MongoDB Setup Options

**Option 1: Local MongoDB**
1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```
3. Use connection string: `mongodb://localhost:27017/pellicula`
4. For more information on local setup of mongodb visit here: (https://www.mongodb.com/docs/manual/administration/install-community/)

**Option 2: MongoDB Atlas (Cloud)**
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create new cluster and database
3. Get connection string from Atlas dashboard
4. Replace `MONGODB_URI` in .env with your Atlas connection string

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pellicula.git
   cd pellicula
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory or rename .env.example to .env:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pellicula
   NODE_ENV=development
   JWT_SECRET=your-jwt-secret-key-here
   TMDB_API_KEY=some-api-key-from-tmdb
   TMDB_API_ACCESS_TOKEN=some-access-token-from-tmdb
   TMDB_BASE_URL=https://api.themoviedb.org/3
   PORT=5000
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
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
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 🧪 Test Cases

### **User Registration**
- **Username**: Must be at least 3 characters long, alphanumeric characters allowed
- **Email**: Must be a valid email format
- **Password**: Must be at least 6 characters long

```
Example test data:
Username: testuser123
Email: testuser@gmail.com
Password: password123
```

### **User Login**
- **Email**: Must match registered email
- **Password**: Must match registered password

```
Example test data:
Email: testuser@gmail.com
Password: password123
```

### **Movie Search**
- **Search Query**: Accepts any movie title (minimum 1 character)
- **Results**: Returns real-time results from TMDB API
- **Filters**: Optional genre and year filtering

```
Example test data:
Search: "Avengers"
Genre Filter: Action (optional)
Year Filter: 2019 (optional)
```

### **Favorites Management**
- **Add to Favorites**: Requires user authentication
- **Remove from Favorites**: Requires user authentication and movie must exist in user's favorites
- **View Favorites**: Displays all user's saved movies

```
Example test flow:
1. Login with valid credentials
2. Search for a movie
3. Click "Add to Favorites" button
4. Navigate to Favorites page to verify movie was added
5. Click "Remove" to test deletion functionality
```

### **Authentication Protected Routes**
- **Dashboard Access**: Requires valid JWT token
- **Favorites Operations**: Requires user authentication
- **Profile Management**: Requires valid session

```
Test scenarios:
- Access /dashboard without login (should redirect to login)
- Access /favorites without login (should redirect to login)
- Perform favorites operations without authentication (should return 401)
```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (protected)

### Movies
- `GET /movies/search?query=title` - Search movies by title
- `GET /movies/popular` - Get popular movies
- `GET /movies/upcoming` - Get upcoming movies
- `GET /movies/genres` - Get all available movie genres
- `GET /movies/genre/:genreId` - Get movies by specific genre
- `GET /movies/year?year=2023&page=1` - Get movies by release year
- `GET /movies/years` - Get all available years
- `GET /movies/filter?genre=28&year=2023&page=1` - Filter movies by genre and year
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

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the movie API
- React and Node.js communities for excellent documentation and resources