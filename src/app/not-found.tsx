// src/app/not-found.tsx

import Link   from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <span className={styles.code} aria-hidden="true">404</span>
      <h1 className={styles.title}>Página não encontrada</h1>
      <p className={styles.desc}>
        O conteúdo que você procura não existe ou foi removido.
      </p>
      <div className={styles.actions}>
        <Link href="/"       className={styles.btnPrimary}>Ir para o início</Link>
        <Link href="/filmes" className={styles.btnSecondary}>Ver filmes</Link>
      </div>
    </div>
  );
}
