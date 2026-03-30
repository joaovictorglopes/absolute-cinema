import { Metadata }  from 'next';
import Image         from 'next/image';
import Link          from 'next/link';
import { notFound }  from 'next/navigation';
import {
  getTVShowDetails,
  getBackdropUrl,
  getPosterUrl,
  formatDate,
  extractYear,
} from '@/services/tmdb';
import type { TVShowDetails } from '@/types/tmdb';
import StarRating             from '@/components/StarRating/StarRating';
import styles                 from './page.module.css';

export const revalidate = 3600;

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
      const { id } = await params;
      const show = await getTVShowDetails(Number(id));
    return {
      title:       show.name,
      description: show.overview?.slice(0, 160) ?? `Detalhes sobre ${show.name}`,
      openGraph: {
        title:       show.name,
        description: show.overview?.slice(0, 160),
        images:      show.backdrop_path
          ? [{ url: getBackdropUrl(show.backdrop_path, 'large') }]
          : [],
      },
    };
  } catch {
    return { title: 'Série não encontrada' };
  }
}


export default async function SerieDetailPage({ params }: Props) {
  let show: TVShowDetails;
  try {
    const { id } = await params;
    show = await getTVShowDetails(Number(id));
  } catch {
    notFound();
  }

  const year        = extractYear(show.first_air_date);
  const posterUrl   = getPosterUrl(show.poster_path, 'large');
  const backdropUrl = getBackdropUrl(show.backdrop_path, 'large');
  const seasons = show.seasons.filter((s) => s.season_number > 0);

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

        <Link href="/series" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Voltar para séries
        </Link>

        <div className={styles.main}>
          <div className={styles.posterWrap}>
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`Poster de ${show.name}`}
                fill
                priority
                className={styles.posterImg}
                sizes="(max-width: 768px) 55vw, 280px"
              />
            ) : (
              <div className={styles.posterFallback} aria-hidden="true">📺</div>
            )}
          </div>
          <div className={styles.info}>

            {show.genres.length > 0 && (
              <div className={styles.genres}>
                {show.genres.map((g) => (
                  <span key={g.id} className={styles.genre}>{g.name}</span>
                ))}
              </div>
            )}

            <h1 className={styles.showTitle}>{show.name}</h1>

            {show.tagline && (
              <p className={styles.tagline}>"{show.tagline}"</p>
            )}

            <div className={styles.metaRow}>
              {year && <span className={styles.metaItem}>{year}</span>}
              <span className={styles.metaItem}>
                 {show.number_of_seasons} temporada{show.number_of_seasons !== 1 ? 's' : ''}
              </span>
              <span className={styles.metaItem}>
                 {show.number_of_episodes} episódios
              </span>
              <span className={styles.metaItem}>
                 {show.original_language.toUpperCase()}
              </span>
            </div>

            <div className={styles.rating}>
              <StarRating rating={show.vote_average} size="lg" showValue />
              <span className={styles.votes}>
                {show.vote_count.toLocaleString('pt-BR')} avaliações
              </span>
            </div>

            {show.overview && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Sinopse</span>
                <p className={styles.overview}>{show.overview}</p>
              </div>
            )}

            <div className={styles.facts}>
              {show.first_air_date && (
                <div className={styles.fact}>
                  <span className={styles.factLabel}>Estreia</span>
                  <span className={styles.factValue}>{formatDate(show.first_air_date)}</span>
                </div>
              )}
              {show.status && (
                <div className={styles.fact}>
                  <span className={styles.factLabel}>Status</span>
                  <span className={styles.factValue}>{show.status}</span>
                </div>
              )}
              {show.networks.length > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factLabel}>Rede</span>
                  <span className={styles.factValue}>
                    {show.networks.map((n) => n.name).join(', ')}
                  </span>
                </div>
              )}
              {show.origin_country.length > 0 && (
                <div className={styles.fact}>
                  <span className={styles.factLabel}>País</span>
                  <span className={styles.factValue}>
                    {show.origin_country.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {seasons.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>
                  Temporadas ({seasons.length})
                </span>
                <div className={styles.seasons}>
                  {seasons.map((s) => (
                    <div key={s.id} className={styles.season}>
                      <span className={styles.seasonName}>{s.name}</span>
                      <span className={styles.seasonEps}>
                        {s.episode_count} ep.
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
