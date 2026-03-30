'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Genre } from '@/types/tmdb';
import styles from './GenreFilter.module.css';

interface GenreFilterProps {
  genres:   Genre[];
  basePath: string;
}

export default function GenreFilter({ genres, basePath }: GenreFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeId = searchParams.get('genero') ? Number(searchParams.get('genero')) : null;

  function navigate(genreId: number | null) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (genreId === null) {
      params.delete('genero');
    } else {
      params.set('genero', String(genreId));
    }

    router.push(`${basePath}?${params.toString()}`);
  }

  return (
    <div className={styles.wrapper} role="group" aria-label="Filtrar por gênero">
      <button
        className={`${styles.chip} ${activeId === null ? styles.active : ''}`}
        onClick={() => navigate(null)}
        aria-pressed={activeId === null}
      >
        Todos
      </button>

      {genres.map((genre) => (
        <button
          key={genre.id}
          className={`${styles.chip} ${activeId === genre.id ? styles.active : ''}`}
          onClick={() => navigate(genre.id)}
          aria-pressed={activeId === genre.id}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
