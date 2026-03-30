'use client';

import { useState, useEffect, useRef } from 'react';
import Link            from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles          from './Header.module.css';

const NAV_LINKS = [
  { href: '/',       label: 'Início'  },
  { href: '/filmes', label: 'Filmes'  },
  { href: '/series', label: 'Séries'  },
];

export default function Header() {
  const pathname = usePathname();
  const router   = useRouter();

  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [query,       setQuery]       = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/busca?q=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setQuery('');
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>
            Absolute<strong>Cinema</strong>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Navegação principal">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${isActive(href) ? styles.navLinkActive : ''}`}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>

          <div className={`${styles.searchBox} ${searchOpen ? styles.searchBoxOpen : ''}`}>
            {searchOpen && (
              <form onSubmit={handleSearch} className={styles.searchForm} role="search">
                <input
                  ref={inputRef}
                  type="search"
                  placeholder="Buscar filmes e séries..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className={styles.searchInput}
                  aria-label="Buscar"
                />
              </form>
            )}
            <button
              className={styles.iconBtn}
              onClick={() => { setSearchOpen((v) => !v); setQuery(''); }}
              aria-label={searchOpen ? 'Fechar busca' : 'Abrir busca'}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <IconX /> : <IconSearch />}
            </button>
          </div>
          <button
            className={`${styles.iconBtn} ${styles.menuToggle}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className={styles.mobileNav} aria-label="Menu mobile">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.mobileNavLink} ${isActive(href) ? styles.mobileNavLinkActive : ''}`}
              aria-current={isActive(href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}


function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}
