'use client';

import React from 'react';
import styles from './SideNavigation.module.css';

interface SideNavProps {
  activeSection: string;
}

const navItems = [
  { id: 'home', label: 'Главная' },
  { id: 'about', label: 'О себе' },
  { id: 'skills', label: 'Стек' },
  { id: 'works', label: 'Проекты' },
  { id: 'contact', label: 'Контакты' },
];

export default function SideNavigation({ activeSection }: SideNavProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className={styles.sideNav} aria-label="Side navigation dots">
      {navItems.map(({ id, label }) => {
        const isActive = activeSection === id;
        return (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => handleClick(e, id)}
            className={`${styles.dotWrap} ${isActive ? styles.activeDot : ''}`}
            aria-label={`Прокрутить к секции ${label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className={styles.tooltip}>{label}</span>
            <span className={styles.dot} />
          </a>
        );
      })}
    </nav>
  );
}
