import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header/Header';

export const metadata: Metadata = {
  title: {
    default: 'Filmes & Séries',
    template: '%s | Teste TMDB',
  },
  description: 'Explore filmes e séries com dados da TMDB. Descubra lançamentos, avaliações e muito mais.',
  keywords: ['filmes', 'séries', 'cinema', 'TMDB', 'streaming'],
  authors: [{ name: 'Desafio Frontend' }],
  openGraph: {
    title: 'Filmes & Séries',
    description: 'Explore filmes e séries com dados da TMDB.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main style={{ paddingTop: 'var(--nav-height)', minHeight: '100vh' }}>
          {children}
        </main>
        <footer style={{
          borderTop: '1px solid var(--color-border)',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-body)',
        }}>
          <p>
            Dados fornecidos por{' '}
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-accent)', transition: 'color var(--transition-fast)' }}
            >
              The Movie Database (TMDB)
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
