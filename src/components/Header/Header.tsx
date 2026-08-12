'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGithub, FiMail } from 'react-icons/fi';
import { MdOutlineMonetizationOn } from 'react-icons/md';
import { SOCIAL_LINKS } from '@/config/social';
import styles from './Header.module.css';

// Navigation link items
const navLinks = [
  { href: '#home', label: 'Главная' },
  { href: '#about', label: 'О себе' },
  { href: '#skills', label: 'Стек' },
  { href: '#works', label: 'Проекты' },
  { href: '#contact', label: 'Контакты' },
];

interface HeaderProps {
  activeSection: string;
}

export default function Header({ activeSection }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Track scroll position for header style updates
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll navigation handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);

    const id = href.replace('#', '');
    const container = document.getElementById('fullpage-container');

    if (container) {
      // Fullpage scroll mode: scroll container to section
      const sections = Array.from(container.children) as HTMLElement[];
      const sectionIndex = sections.findIndex((el) => el.querySelector(`#${id}`) !== null);

      if (sectionIndex !== -1) {
        container.scrollTo({
          top: sectionIndex * container.clientHeight,
          behavior: 'smooth',
        });
        return;
      }
    }

    // Fallback smooth scroll for mobile or standard mode
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="#home" className={styles.logo} aria-label="Portfolio home">
          <span className={styles.logoBracket}>&lt;/&gt;</span>
          <span className={styles.logoText}>Portfolio</span>
        </Link>

        {/* Desktop navigation */}
        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`${styles.navLink} ${activeSection === href.replace('#', '') ? styles.active : ''}`}
                  onClick={(e) => handleNavClick(e, href)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social links */}
        <div className={styles.socials}>
          <a
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="GitHub profile"
          >
            <FiGithub size={20} />
          </a>
          <a
            href={SOCIAL_LINKS.donations}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Поддержать (DonationAlerts)"
          >
            <MdOutlineMonetizationOn size={24} />
          </a>
          <a
            href={`mailto:${SOCIAL_LINKS.email}`}
            className={styles.socialLink}
            aria-label="Send email"
          >
            <FiMail size={20} />
          </a>
        </div>

        {/* Mobile menu toggle (burger) */}
        <button
          className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`} aria-hidden={!menuOpen}>
        <ul className={styles.mobileNavList}>
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={styles.mobileNavLink}
                onClick={(e) => handleNavClick(e, href)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.mobileSocials}>
          <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FiGithub size={22} />
          </a>
          <a href={SOCIAL_LINKS.donations} target="_blank" rel="noopener noreferrer" aria-label="Поддержать (DonationAlerts)">
            <MdOutlineMonetizationOn size={26} />
          </a>
          <a href={`mailto:${SOCIAL_LINKS.email}`} aria-label="Email">
            <FiMail size={22} />
          </a>
        </div>
      </div>
    </header>
  );
}
