import Link from 'next/link';
import { getNowPlayingMovies, getPopularMovies, getPopularTVShows } from '@/services/tmdb';
import HeroSection from '@/components/HeroSection/HeroSection';
import MovieGrid from '@/components/MovieGrid/MovieGrid';
import styles from './page.module.css';

export const revalidate = 3600;

export default async function HomePage() {
  const [nowPlaying, popularMovies, popularSeries] = await Promise.all([
    getNowPlayingMovies(1),
    getPopularMovies(1),
    getPopularTVShows(1),
  ]);

  return (
    <>
      <HeroSection movies={nowPlaying.results} />

      <div className="container">
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Filmes Populares</h2>
              <p className={styles.sectionSubtitle}>Os mais assistidos do momento</p>
            </div>
            <Link href="/filmes" className={styles.seeAll}>
              Ver todos
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </Link>
          </div>
          <MovieGrid items={popularMovies.results.slice(0, 14)} mediaType="movie" />
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Séries Populares</h2>
              <p className={styles.sectionSubtitle}>As séries mais em alta agora</p>
            </div>
            <Link href="/series" className={styles.seeAll}>
              Ver todas
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </Link>
          </div>
          <MovieGrid items={popularSeries.results.slice(0, 14)} mediaType="tv" />
        </section>
      </div>
    </>
  );
}
