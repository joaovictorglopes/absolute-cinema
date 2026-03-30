import styles from './Loading.module.css';

interface LoadingSpinnerProps {
  size?:  'sm' | 'md' | 'lg';
  label?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({
  size = 'md',
  label = 'Carregando...',
  fullPage = false,
}: LoadingSpinnerProps) {
  return (
    <div
      className={`${styles.wrapper} ${fullPage ? styles.fullPage : ''}`}
      role="status"
      aria-label={label}
    >
      <div className={`${styles.spinner} ${styles[size]}`} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}
