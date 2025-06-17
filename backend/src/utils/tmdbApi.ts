import axios from 'axios';
import { Movie, MovieDetails, Genre } from '../types';

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY
  }
});

export const searchMovies = async (query: string, page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
  totalResults: number;
}> => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false
      }
    });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('TMDB search error:', error);
    throw new Error('Failed to search movies');
  }
};

export const getMovieDetails = async (movieId: string): Promise<MovieDetails> => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('TMDB movie details error:', error);
    throw new Error('Failed to fetch movie details');
  }
};

export const getPopularMovies = async (page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page }
    });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('TMDB popular movies error:', error);
    throw new Error('Failed to fetch popular movies');
  }
};

export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<{
  movies: Movie[];
  totalPages: number;
}> => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        page,
        sort_by: 'popularity.desc'
      }
    });

    return {
      movies: response.data.results,
      totalPages: response.data.total_pages
    };
  } catch (error) {
    console.error('TMDB genre movies error:', error);
    throw new Error('Failed to fetch movies by genre');
  }
};

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('TMDB genres error:', error);
    throw new Error('Failed to fetch genres');
  }
};
