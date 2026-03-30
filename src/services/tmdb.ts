import type {
  Movie,
  TVShow,
  MovieDetails,
  TVShowDetails,
  Genre,
  PaginatedResponse,
} from '@/types/tmdb';

const API_KEY  = process.env.NEXT_PUBLIC_TMDB_API_KEY;
console.log('TMDB API Key:', API_KEY ? '[REDACTED]' : 'Não configurada');
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const POSTER_SIZES = {
  small: 'w185',
  medium: 'w342',
  large: 'w500',
  original: 'original',
} as const;

export const BACKDROP_SIZES = {
  small: 'w300',
  medium: 'w780',
  large:  'w1280',
  original: 'original',
} as const;


async function fetchFromTMDB<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  console.log(API_KEY);
  if (!API_KEY) {
    throw new Error(
      'TMDB_API_KEY não configurada. Adicione sua chave.',
    );
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'pt-BR');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB API erro ${res.status}: ${res.statusText} — ${endpoint}`);
  }

  return res.json() as Promise<T>;
}


export function getPopularMovies(page = 1) {
  return fetchFromTMDB<PaginatedResponse<Movie>>('/movie/popular', { page: String(page) });
}

export function getNowPlayingMovies(page = 1) {
  return fetchFromTMDB<PaginatedResponse<Movie>>('/movie/now_playing', { page: String(page) });
}

export function getTopRatedMovies(page = 1) {
  return fetchFromTMDB<PaginatedResponse<Movie>>('/movie/top_rated', { page: String(page) });
}

export function getUpcomingMovies(page = 1) {
  return fetchFromTMDB<PaginatedResponse<Movie>>('/movie/upcoming', { page: String(page) });
}

export function getMovieDetails(id: number) {
  return fetchFromTMDB<MovieDetails>(`/movie/${id}`);
}

export function getMoviesByGenre(genreId: number, page = 1) {
  return fetchFromTMDB<PaginatedResponse<Movie>>('/discover/movie', {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    page: String(page),
  });
}

export function getMovieGenres() {
  return fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list');
}


export function getPopularTVShows(page = 1) {
  return fetchFromTMDB<PaginatedResponse<TVShow>>('/tv/popular', { page: String(page) });
}

export function getTopRatedTVShows(page = 1) {
  return fetchFromTMDB<PaginatedResponse<TVShow>>('/tv/top_rated', { page: String(page) });
}

export function getOnAirTVShows(page = 1) {
  return fetchFromTMDB<PaginatedResponse<TVShow>>('/tv/on_the_air', { page: String(page) });
}

export function getTVShowDetails(id: number) {
  return fetchFromTMDB<TVShowDetails>(`/tv/${id}`);
}

export function getTVShowsByGenre(genreId: number, page = 1) {
  return fetchFromTMDB<PaginatedResponse<TVShow>>('/discover/tv', {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    page: String(page),
  });
}

export function getTVGenres() {
  return fetchFromTMDB<{ genres: Genre[] }>('/genre/tv/list');
}


export function searchMovies(query: string, page = 1) {
  return fetchFromTMDB<PaginatedResponse<Movie>>('/search/movie', {
    query,
    page: String(page),
  });
}

export function searchTVShows(query: string, page = 1) {
  return fetchFromTMDB<PaginatedResponse<TVShow>>('/search/tv', {
    query,
    page: String(page),
  });
}

export function getPosterUrl(
  path: string | null,
  size: keyof typeof POSTER_SIZES = 'medium',
): string {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${POSTER_SIZES[size]}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: keyof typeof BACKDROP_SIZES = 'large',
): string {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${BACKDROP_SIZES[size]}${path}`;
}


export function extractYear(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const year = parseInt(dateStr.slice(0, 4), 10);
  return isNaN(year) ? null : year;
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Data desconhecida';
  const date = new Date(`${dateStr}T12:00:00`);
  if (isNaN(date.getTime())) return 'Data inválida';
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}


export function formatRuntime(minutes: number | null): string {
  if (!minutes || minutes <= 0) return 'Duração desconhecida';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
