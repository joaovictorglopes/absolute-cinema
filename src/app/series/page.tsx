
import { Suspense } from 'react';
import { Metadata } from 'next';
import Link          from 'next/link';
import {
  getPopularTVShows,
  getTopRatedTVShows,
  getOnAirTVShows,
  getTVShowsByGenre,
  getTVGenres,
} from '@/services/tmdb';
import MovieGrid      from '@/components/MovieGrid/MovieGrid';
import Pagination     from '@/components/Pagination/Pagination';
import GenreFilter    from '@/components/GenreFilter/GenreFilter';
import LoadingSpinner from '@/components/Loading/Loading';
import styles         from './page.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title:       'Séries',
  description: 'Explore as melhores séries com dados atualizados da TMDB.',
};


const CATEGORIAS = [
  { key: 'popular',   label: 'Populares'         },
  { key: 'on_air',    label: 'No Ar'             },
  { key: 'top_rated', label: 'Mais Bem Avaliadas' },
] as const;

type CategoriaKey = typeof CATEGORIAS[number]['key'];

function isValidCategoria(v: unknown): v is CategoriaKey {
  return CATEGORIAS.some((c) => c.key === v);
}

async function fetchSeries(cat: CategoriaKey, genreId: number | null, page: number) {
  if (genreId !== null) return getTVShowsByGenre(genreId, page);
  switch (cat) {
    case 'on_air':    return getOnAirTVShows(page);
    case 'top_rated': return getTopRatedTVShows(page);
    default:          return getPopularTVShows(page);
  }
}

interface PageProps {
  searchParams: Promise<{ page?: string; categoria?: string; genero?: string }>;
}

export default async function SeriesPage({ searchParams }: PageProps) {
  const { page: p, categoria: cat, genero } = await searchParams;
  const page      = Math.max(1, Number(p) || 1);
  const categoria = isValidCategoria(cat) ? cat : 'popular';
  const genreId   = genero ? Number(genero) : null;

  const [series, genres] = await Promise.all([
    fetchSeries(categoria, genreId, page),
    getTVGenres(),
  ]);

  return (
    <div className="container">

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Séries</h1>
          <p className={styles.subtitle}>
            {series.total_results.toLocaleString('pt-BR')} séries encontradas
          </p>
        </div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Categorias de séries">
        {CATEGORIAS.map((cat) => (
          <Link
            key={cat.key}
            href={`/series?categoria=${cat.key}&page=1`}
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
          <GenreFilter genres={genres.genres} basePath="/series" />
        </Suspense>
      </div>

      <MovieGrid
        items={series.results}
        mediaType="tv"
        emptyMessage="Nenhuma série encontrada para este filtro."
      />

      <Suspense fallback={<LoadingSpinner size="sm" label="" />}>
        <Pagination
          currentPage={page}
          totalPages={series.total_pages}
          basePath="/series"
        />
      </Suspense>

    </div>
  );
}
