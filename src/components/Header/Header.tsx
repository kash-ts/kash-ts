'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiGithub, FiMail } from 'react-icons/fi';
import { MdOutlineMonetizationOn } from 'react-icons/md';
import styles from './Header.module.css';

const navLinks = [
  { href: '#home', label: 'Главная' },
  { href: '#about', label: 'О себе' },
  { href: '#skills', label: 'Стек' },
  { href: '#works', label: 'Проекты' },
  { href: '#contact', label: 'Контакты' },
];

interface HeaderProps {
  activeSection?: string;
}

export default function Header({ activeSection: externalActiveSection }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [internalActiveSection, setInternalActiveSection] = useState('home');

  const activeSection = externalActiveSection ?? internalActiveSection;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to update active section on scroll if external activeSection is not provided
  useEffect(() => {
    if (externalActiveSection !== undefined) return;

    const sectionIds = ['home', 'about', 'skills', 'works', 'contact'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInternalActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [externalActiveSection]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const id = href.replace('#', '');
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

        {/* Desktop Nav */}
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

        {/* Social Icons */}
        <div className={styles.socials}>
          <a
            href="https://github.com/kash-ts"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="GitHub profile"
          >
            <FiGithub size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Services"
          >
            <MdOutlineMonetizationOn size={24} />
          </a>
          <a
            href="mailto:ipomainkra@gmail.com"
            className={styles.socialLink}
            aria-label="Send email"
          >
            <FiMail size={20} />
          </a>
        </div>

        {/* Mobile Burger */}
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

      {/* Mobile Menu */}
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
          <a href="https://github.com/kash-ts" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FiGithub size={22} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Services">
            <MdOutlineMonetizationOn size={26} />
          </a>
          <a href="mailto:ipomainkra@gmail.com" aria-label="Email">
            <FiMail size={22} />
          </a>
        </div>
      </div>
    </header>
  );
}
