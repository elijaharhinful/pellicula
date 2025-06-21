import { Request } from "express";


export interface User {
    _id?: string;
    username: string;
    email: string;
    password: string;
    favourites: string[];
    createdAt?: Date;
  }
  
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
  
  export interface AuthRequest extends Request {
    user?: {
      userId: string;
      username: string;
      email: string;
    };
  }