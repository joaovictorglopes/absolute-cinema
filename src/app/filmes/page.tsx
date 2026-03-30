import { Suspense }   from 'react';
import { Metadata }   from 'next';
import Link           from 'next/link';
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getMoviesByGenre,
  getMovieGenres,
} from '@/services/tmdb';
import MovieGrid      from '@/components/MovieGrid/MovieGrid';
import Pagination     from '@/components/Pagination/Pagination';
import GenreFilter    from '@/components/GenreFilter/GenreFilter';
import LoadingSpinner from '@/components/Loading/Loading';
import styles         from './page.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title:       'Filmes',
  description: 'Explore os melhores filmes com dados atualizados da TMDB.',
};


const CATEGORIAS = [
  { key: 'popular',     label: 'Populares'            },
  { key: 'now_playing', label: 'Em Cartaz'             },
  { key: 'top_rated',   label: 'Mais Bem Avaliados'    },
  { key: 'upcoming',    label: 'Em Breve'              },
] as const;

type CategoriaKey = typeof CATEGORIAS[number]['key'];

function isValidCategoria(v: unknown): v is CategoriaKey {
  return CATEGORIAS.some((c) => c.key === v);
}

async function fetchMovies(cat: CategoriaKey, genreId: number | null, page: number) {
  if (genreId !== null) return getMoviesByGenre(genreId, page);
  switch (cat) {
    case 'now_playing': return getNowPlayingMovies(page);
    case 'top_rated':   return getTopRatedMovies(page);
    case 'upcoming':    return getUpcomingMovies(page);
    default:            return getPopularMovies(page);
  }
}

interface PageProps {
  searchParams: Promise<{ page?: string; categoria?: string; genero?: string }>;
}

export default async function FilmesPage({ searchParams }: PageProps) {
  const { page: p, categoria: cat, genero } = await searchParams;
  const page      = Math.max(1, Number(p) || 1);
  const categoria = isValidCategoria(cat) ? cat : 'popular';
  const genreId   = genero ? Number(genero) : null;

  const [movies, genres] = await Promise.all([
    fetchMovies(categoria, genreId, page),
    getMovieGenres(),
  ]);

  return (
    <div className="container">

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Filmes</h1>
          <p className={styles.subtitle}>
            {movies.total_results.toLocaleString('pt-BR')} filmes encontrados
          </p>
        </div>
      </div>
      <div className={styles.tabs} role="tablist" aria-label="Categorias de filmes">
        {CATEGORIAS.map((cat) => (
          <Link
            key={cat.key}
            href={`/filmes?categoria=${cat.key}&page=1`}
            role="tab"
            aria-selected={!genreId && categoria === cat.key}
            className={`${styles.tab} ${!genreId && categoria === cat.key ? styles.tabActive : ''}`}
          >
            {cat.label}
          </Link>
        ))}
      </div>
      <div className={styles.filters}>
        <Suspense fallback={<div className={styles.filterSkeleton} />}>
          <GenreFilter genres={genres.genres} basePath="/filmes" />
        </Suspense>
      </div>

      <MovieGrid
        items={movies.results}
        mediaType="movie"
        emptyMessage="Nenhum filme encontrado para este filtro."
      />

      <Suspense fallback={<LoadingSpinner size="sm" label="" />}>
        <Pagination
          currentPage={page}
          totalPages={movies.total_pages}
          basePath="/filmes"
        />
      </Suspense>

    </div>
  );
}
