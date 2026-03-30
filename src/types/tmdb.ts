
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;       
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;     
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  origin_country: string[];
}


export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number | null;    
  status: string;
  tagline: string;
  budget: number;             
  revenue: number;           
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
}

export interface TVShowDetails extends TVShow {
  genres: Genre[];
  number_of_episodes: number;
  number_of_seasons: number;
  status: string;
  tagline: string;
  seasons: Season[];
  networks: Network[];
}


export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Season {
  id: number;
  name: string;
  episode_count: number;
  season_number: number;
  poster_path: string | null;
  air_date: string | null; 
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export type MediaType = 'movie' | 'tv';
