import React from 'react';
import styles from '../pages/styles/Header.module.scss';

export default function Header({ active }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className={styles.headerContainer}>
      {/* DESKTOP HEADER */}
      <nav className={styles.desktop}>
        <a href="#" className={active === 'home' ? styles.active : ''}>
          Filme principal
        </a>
        <a href="#" className={active === 'capitulos' ? styles.active : ''}>
          Capítulos
        </a>
        <a href="#" className={active === 'extras' ? styles.active : ''}>
          Extras
        </a>
      </nav>

      {/* MOBILE HAMBURGER */}
      <div className={styles.mobile}>
        <button
          className={styles.hamburger}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>

        {open && (
          <nav className={styles.mobileMenu}>
            <a href="#" onClick={() => setOpen(false)}>Filme principal</a>
            <a href="#" onClick={() => setOpen(false)}>Capítulos</a>
            <a href="#" onClick={() => setOpen(false)}>Extras</a>
          </nav>
        )}
      </div>
    </header>
  );
}
