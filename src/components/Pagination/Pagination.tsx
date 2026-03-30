'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages:  number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const maxPage = Math.min(totalPages, 500);

  if (maxPage <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`${basePath}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildPages(): (number | '…')[] {
    const delta = 2;
    const pages: (number | '…')[] = [];

    const start = Math.max(2, currentPage - delta);
    const end   = Math.min(maxPage - 1, currentPage + delta);

    pages.push(1);
    if (start > 2) pages.push('…');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < maxPage - 1) pages.push('…');
    if (maxPage > 1) pages.push(maxPage);

    return pages;
  }

  const pages = buildPages();

  return (
    <nav className={styles.nav} aria-label="Paginação">
      <button
        className={`${styles.btn} ${styles.arrow}`}
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>
      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className={styles.ellipsis} aria-hidden="true">…</span>
        ) : (
          <button
            key={p}
            className={`${styles.btn} ${currentPage === p ? styles.active : ''}`}
            onClick={() => goTo(p as number)}
            aria-label={`Página ${p}`}
            aria-current={currentPage === p ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        className={`${styles.btn} ${styles.arrow}`}
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= maxPage}
        aria-label="Próxima página"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9,18 15,12 9,6" />
        </svg>
      </button>
    </nav>
  );
}
