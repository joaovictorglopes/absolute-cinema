'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link  from 'next/link';
import type { Movie } from '@/types/tmdb';
import { getBackdropUrl, extractYear } from '@/services/tmdb';
import StarRating from '@/components/StarRating/StarRating';
import styles from './HeroSection.module.css';

interface HeroSectionProps {
  movies: Movie[];
}

const INTERVAL_MS = 6000;

export default function HeroSection({ movies }: HeroSectionProps) {
  const featured  = movies.slice(0, 5);
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (featured.length <= 1 || paused) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % featured.length);
    }, INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [featured.length, paused]);

  const movie = featured[current];
  if (!movie) return null;

  const year = extractYear(movie.release_date);
  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'large');

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Filmes em destaque"
    >
      <div className={styles.bg} aria-hidden="true">
        {featured.map((m, i) => {
          const url = getBackdropUrl(m.backdrop_path, 'large');
          return url ? (
            <div
              key={m.id}
              className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}
            >
              <Image
                src={url}
                alt=""
                fill
                priority={i === 0}
                className={styles.slideImg}
                sizes="100vw"
              />
            </div>
          ) : null;
        })}
        <div className={styles.bgOverlay} />
      </div>
      <div className={`${styles.content} container`}>
        <div className={styles.metaRow}>
          {year && <span className={styles.year}>{year}</span>}
          <span className={styles.badge}>Em destaque</span>
        </div>

        <h1 className={styles.title}>{movie.title}</h1>

        <div className={styles.rating}>
          <StarRating rating={movie.vote_average} size="md" showValue />
          <span className={styles.votes}>
            ({movie.vote_count.toLocaleString('pt-BR')} votos)
          </span>
        </div>

        {movie.overview && (
          <p className={styles.overview}>{movie.overview}</p>
        )}

        <div className={styles.actions}>
          <Link href={`/filmes/${movie.id}`} className={styles.btnPrimary}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            Ver detalhes
          </Link>
          <Link href="/filmes" className={styles.btnSecondary}>
            Explorar filmes
          </Link>
        </div>
      </div>

      {featured.length > 1 && (
        <div className={styles.dots} aria-label="Slides de destaque">
          {featured.map((m, i) => (
            <button
              key={m.id}
              className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}: ${m.title}`}
              aria-pressed={i === current}
            />
          ))}
        </div>
      )}
    </section>
  );
}
