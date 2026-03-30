import styles from './StarRating.module.css';

interface StarRatingProps {
  rating:    number;           // escala 0–10 (TMDB)
  maxStars?: number;           // padrão: 5
  size?:     'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

export default function StarRating({
  rating,
  maxStars  = 5,
  size      = 'sm',
  showValue = false,
}: StarRatingProps) {
  const normalized = Math.max(0, Math.min((rating / 10) * maxStars, maxStars));
  const full       = Math.floor(normalized);
  const partial    = parseFloat((normalized - full).toFixed(2));
  const empty      = maxStars - full - (partial > 0 ? 1 : 0);

  return (
    <div
      className={`${styles.wrapper} ${styles[size]}`}
      role="img"
      aria-label={`Avaliação: ${rating.toFixed(1)} de 10`}
    >
      <div className={styles.stars} aria-hidden="true">
        {Array.from({ length: full }).map((_, i) => (
          <StarSVG key={`f${i}`} fill="full" index={i} />
        ))}
        {partial > 0 && (
          <StarSVG fill="partial" partial={partial} index={full} />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <StarSVG key={`e${i}`} fill="empty" index={full + (partial > 0 ? 1 : 0) + i} />
        ))}
      </div>

      {showValue && (
        <span className={styles.value}>{rating.toFixed(1)}</span>
      )}
    </div>
  );
}


interface StarSVGProps {
  fill:     'full' | 'partial' | 'empty';
  index:    number;
  partial?: number; 
}

function StarSVG({ fill, index, partial = 0 }: StarSVGProps) {
  if (fill === 'full') {
    return (
      <svg className={`${styles.star} ${styles.starFull}`} viewBox="0 0 24 24">
        <path d={STAR_PATH} />
      </svg>
    );
  }

  if (fill === 'empty') {
    return (
      <svg className={`${styles.star} ${styles.starEmpty}`} viewBox="0 0 24 24">
        <path d={STAR_PATH} />
      </svg>
    );
  }


  const gradId = `sp-${index}-${Math.round(partial * 100)}`;

  return (
    <svg className={styles.star} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${partial * 100}%`} stopColor="var(--color-gold)" />
          <stop offset={`${partial * 100}%`} stopColor="var(--color-gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={STAR_PATH} className={styles.starEmptyLayer} />
      <path d={STAR_PATH} fill={`url(#${gradId})`} />
    </svg>
  );
}
