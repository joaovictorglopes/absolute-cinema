import MovieCard from '@/components/MovieCard/MovieCard';
import styles from './MovieGrid.module.css';

interface GridItem {
  id:             number;
  title?:         string;  
  name?:          string;   
  poster_path:    string | null;
  vote_average:   number;
  release_date?:  string;   
  first_air_date?: string;  
  overview?:      string;
}

interface MovieGridProps {
  items:        GridItem[];
  mediaType:    'movie' | 'tv';
  emptyMessage?: string;
}

export default function MovieGrid({
  items,
  mediaType,
  emptyMessage = 'Nenhum resultado encontrado.',
}: MovieGridProps) {
  if (items.length === 0) {
    return (
      <div className={styles.empty} role="status">
        <span className={styles.emptyIcon} aria-hidden="true">🎬</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {items.map((item, index) => (
        <MovieCard
          key={item.id}
          id={item.id}
          title={item.title ?? item.name ?? 'Sem título'}
          posterPath={item.poster_path}
          rating={item.vote_average}
          releaseDate={item.release_date ?? item.first_air_date}
          mediaType={mediaType}
          overview={item.overview}
          priority={index < 6}   
        />
      ))}
    </div>
  );
}
