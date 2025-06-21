export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    vote_count:number;
    genre_ids: number[];
    adult: boolean;
  }
  
  export interface MovieDetails extends Movie {
    genres: Genre[];
    runtime: number;
    production_companies: ProductionCompany[];
  }
  
  export interface Genre {
    id: number;
    name: string;
  }
  
  export interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string;
  }
  
  export interface User {
    id: string;
    username: string;
    email: string;
    favourites: string[];
    createdAt?: Date | string;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    loading: boolean;
  }

  export interface Activity {
  id: string;
  type: 'favourite_added' | 'favourite_removed';
  movieTitle: string;
  timestamp: Date;
}