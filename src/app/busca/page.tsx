import { Suspense } from 'react';
import { Metadata } from 'next';
import Link          from 'next/link';
import { searchMovies, searchTVShows } from '@/services/tmdb';
import MovieGrid      from '@/components/MovieGrid/MovieGrid';
import Pagination     from '@/components/Pagination/Pagination';
import LoadingSpinner from '@/components/Loading/Loading';
import styles         from './page.module.css';

interface PageProps {
  searchParams: Promise<{ q?: string; tipo?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q: rawQ } = await searchParams;
  const q = rawQ?.trim();
  return {
    title:       q ? `"${q}" — Busca` : 'Busca',
    description: q ? `Resultados para "${q}"` : 'Busque filmes e séries no AbsoluteCinema.',
  };
}

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q, tipo: t, page: p } = await searchParams;
  const query = q?.trim() ?? '';
  const tipo  = t === 'tv' ? 'tv' : 'movie';
  const page  = Math.max(1, Number(p) || 1);
  let data = null;
  let fetchError = false;

  if (query) {
    try {
      data = tipo === 'tv'
        ? await searchTVShows(query, page)
        : await searchMovies(query, page);
    } catch {
      fetchError = true;
    }
  }

  const baseHref = (t: string) =>
    `/busca?q=${encodeURIComponent(query)}&tipo=${t}&page=1`;

  return (
    <div className="container">

      <div className={styles.header}>
        <h1 className={styles.title}>
          {query ? `Resultados para "${query}"` : 'Buscar'}
        </h1>
        {data && (
          <p className={styles.subtitle}>
            {data.total_results.toLocaleString('pt-BR')} resultado{data.total_results !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {query && (
        <div className={styles.toggle} role="group" aria-label="Tipo de resultado">
          <Link
            href={baseHref('movie')}
            className={`${styles.toggleBtn} ${tipo === 'movie' ? styles.toggleBtnActive : ''}`}
            aria-pressed={tipo === 'movie'}
          >
            Filmes
          </Link>
          <Link
            href={baseHref('tv')}
            className={`${styles.toggleBtn} ${tipo === 'tv' ? styles.toggleBtnActive : ''}`}
            aria-pressed={tipo === 'tv'}
          >
            Séries
          </Link>
        </div>
      )}

      {!query && (
        <div className={styles.empty}>
          <p>Use a barra de busca no topo para encontrar filmes e séries.</p>
        </div>
      )}

      {fetchError && (
        <div className={styles.error} role="alert">
          Não foi possível buscar resultados. Verifique sua conexão e tente novamente.
        </div>
      )}

      {data && (
        <>
          <MovieGrid
            items={data.results}
            mediaType={tipo}
            emptyMessage={`Nenhum resultado encontrado para "${query}".`}
          />
          <Suspense fallback={<LoadingSpinner size="sm" label="" />}>
            <Pagination
              currentPage={page}
              totalPages={data.total_pages}
              basePath="/busca"
            />
          </Suspense>
        </>
      )}

    </div>
  );
}
