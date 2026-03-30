import { Metadata }     from 'next';
import Image            from 'next/image';
import Link             from 'next/link';
import { notFound }     from 'next/navigation';
import {
  getMovieDetails,
  getBackdropUrl,
  getPosterUrl,
  formatDate,
  formatRuntime,
  extractYear,
} from '@/services/tmdb';
import type { MovieDetails } from '@/types/tmdb';
import StarRating        from '@/components/StarRating/StarRating';
import styles            from './page.module.css';

export const revalidate = 3600;


interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
      const { id } = await params;
      const movie = await getMovieDetails(Number(id));
    return {
      title:       movie.title,
      description: movie.overview?.slice(0, 160) ?? `Detalhes sobre ${movie.title}`,
      openGraph: {
        title:       movie.title,
        description: movie.overview?.slice(0, 160),
        images:      movie.backdrop_path
          ? [{ url: getBackdropUrl(movie.backdrop_path, 'large') }]
          : [],
      },
    };
  } catch {
    return { title: 'Filme não encontrado' };
  }
}


export default async function FilmeDetailPage({ params }: Props) {
  let movie: MovieDetails;
  try {
    const { id } = await params;
    movie = await getMovieDetails(Number(id));
  } catch {
    notFound();
  }

  const year       = extractYear(movie.release_date);
  const posterUrl  = getPosterUrl(movie.poster_path, 'large');
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'large');

  return (
    <div className={styles.page}>

      {backdropUrl && (
        <div className={styles.backdropWrap} aria-hidden="true">
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            className={styles.backdropImg}
            sizes="100vw"
          />
          <div className={styles.backdropOverlay} />
        </div>
      )}

      <div className={`container ${styles.content}`}>

        <Link href="/filmes" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Voltar para filmes
        </Link>

        <div className={styles.main}>

          <div className={styles.posterWrap}>
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`Poster de ${movie.title}`}
                fill
                priority
                className={styles.posterImg}
                sizes="(max-width: 768px) 55vw, 280px"
              />
            ) : (
              <div className={styles.posterFallback} aria-hidden="true"></div>
            )}
          </div>
          <div className={styles.info}>
            {movie.genres.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map((g) => (
                  <span key={g.id} className={styles.genre}>{g.name}</span>
                ))}
              </div>
            )}

            <h1 className={styles.movieTitle}>{movie.title}</h1>

            {movie.tagline && (
              <p className={styles.tagline}>"{movie.tagline}"</p>
            )}
            <div className={styles.metaRow}>
              {year             && <span className={styles.metaItem}>{year}</span>}
              {movie.runtime    && <span className={styles.metaItem}>{formatRuntime(movie.runtime)}</span>}
              <span className={styles.metaItem}> {movie.original_language.toUpperCase()}</span>
            </div>
            <div className={styles.rating}>
              <StarRating rating={movie.vote_average} size="lg" showValue />
              <span className={styles.votes}>
                {movie.vote_count.toLocaleString('pt-BR')} avaliações
              </span>
            </div>
            {movie.overview && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Sinopse</span>
                <p className={styles.overview}>{movie.overview}</p>
              </div>
            )}
            <div className={styles.facts}>
              {movie.release_date && (
                <div className={styles.fact}>
                  <span className={styles.factLabel}>Lançamento</span>
                  <span className={styles.factValue}>{formatDate(movie.release_date)}</span>
                </div>
              )}
              {movie.status && (
                <div className={styles.fact}>
                  <span className={styles.factLabel}>Status</span>
                  <span className={styles.factValue}>{movie.status}</span>
                </div>
              )}
              {movie.budget > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factLabel}>Orçamento</span>
                  <span className={styles.factValue}>
                    {movie.budget.toLocaleString('en-US', {
                      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              )}
              {movie.revenue > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factLabel}>Receita</span>
                  <span className={styles.factValue}>
                    {movie.revenue.toLocaleString('en-US', {
                      style: 'currency', currency: 'USD', maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              )}
            </div>
            {movie.production_companies.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Produtoras</span>
                <p className={styles.companies}>
                  {movie.production_companies.map((c) => c.name).join(' · ')}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
