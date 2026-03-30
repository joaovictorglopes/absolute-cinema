'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPosterUrl, extractYear } from '@/services/tmdb';
import StarRating from '@/components/StarRating/StarRating';
import styles from './MovieCard.module.css';

interface MovieCardProps {
  id:          number;
  title:       string;
  posterPath:  string | null;
  rating:      number;
  releaseDate?: string;
  mediaType:   'movie' | 'tv';
  overview?:   string;
  priority?:   boolean;   
}

export default function MovieCard({
  id,
  title,
  posterPath,
  rating,
  releaseDate,
  mediaType,
  overview,
  priority = false,
}: MovieCardProps) {
  const [imgError, setImgError] = useState(false);

  const href      = `/${mediaType === 'movie' ? 'filmes' : 'series'}/${id}`;
  const year      = extractYear(releaseDate);
  const posterUrl = getPosterUrl(posterPath, 'medium');
  const showImg   = !!posterUrl && !imgError;

  return (
    <Link href={href} className={styles.card} title={title}>
      <div className={styles.poster}>

        {showImg ? (
          <Image
            src={posterUrl}
            alt={`Poster de ${title}`}
            fill
            sizes="(max-width: 480px) 45vw, (max-width: 768px) 30vw, 180px"
            className={styles.posterImg}
            onError={() => setImgError(true)}
            priority={priority}
          />
        ) : (
          <div className={styles.posterFallback} aria-hidden="true">
            <span>🎬</span>
            <span className={styles.posterFallbackTitle}>{title}</span>
          </div>
        )}

        <div className={styles.overlay} aria-hidden="true">
          {overview && <p className={styles.overlayText}>{overview}</p>}
          <span className={styles.overlayBtn}>Ver detalhes</span>
        </div>

        <span className={styles.typeBadge}>
          {mediaType === 'tv' ? 'Série' : 'Filme'}
        </span>
        {rating > 0 && (
          <span className={styles.ratingBadge} aria-hidden="true">
            ★ {rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.meta}>
          <StarRating rating={rating} size="sm" />
          {year && <span className={styles.year}>{year}</span>}
        </div>
      </div>
    </Link>
  );
}
