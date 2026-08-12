'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiExternalLink, FiGithub, FiFolder } from 'react-icons/fi';
import styles from './Projects.module.css';

// Project data interface
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  github?: string;
  link?: string;
}

// Portfolio projects list
const projectsData: Project[] = [
  {
    id: 1,
    title: 'DonationAlerts SDK',
    category: 'NPMJS',
    description: 'Библиотека для бесшовной интеграции с API DonationAlerts. Она предоставляет полный набор инструментов для авторизации, управления пользовательскими токенами, получения данных учетной записи и обработки различных других взаимодействий с API.',
    tags: ['TypeScript'],
    github: 'https://github.com/kash-ts/alerts-SDK',
  },
  {
    id: 2,
    title: 'АТБ - Отслеживание курса',
    category: 'Telegram',
    description: 'Telegram-бот для отслеживания курсов валют (USD, EUR, CNY) с сайта АТБ (Азиатско-Тихоокеанский банк). Бот сохраняет курсы в локальную базу данных (SQLite) и каждый час отправляет пользователю уведомления об их изменении.',
    tags: ['Python', 'SQLite'],
    github: 'https://github.com/kash-ts/atb-currency-bot',
  },
  {
    id: 3,
    title: 'Schedule in notifications',
    category: 'Kotlin & Android',
    description: 'Простое Android-приложение, написанное на Kotlin, для отображения пользовательского расписания занятий и задач в постоянных уведомлениях (Foreground Service Notification).',
    tags: ['Kotlin', 'Android'],
    github: 'https://github.com/kash-ts/schedule-in-notifications',
  },
];

// Unique categories for filtering
const categories = ['Все', ...Array.from(new Set(projectsData.map((p) => p.category)))];

// Fade up animation variants for project cards
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay: i * 0.1 },
  }),
};

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-80px' });
  const [activeCategory, setActiveCategory] = useState('Все');

  const filteredProjects = activeCategory === 'Все'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <section id="works" className={styles.section} ref={ref}>
      <div className={`container ${styles.inner}`}>

        {/* Section header and filter tabs */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.title}>Мои проекты</h2>

          {/* Project filter buttons */}
          <div className={styles.filters}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.activeFilter : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Project cards grid */}
        <div className={styles.grid}>
          {filteredProjects.map((project, idx) => (
            <motion.article
              key={project.id}
              className={styles.card}
              initial="hidden"
              animate={isInView ? 'show' : 'hidden'}
              custom={idx}
              variants={fadeUp}
            >
              <div className={styles.cardHeader}>
                <span className={styles.folderIcon}>
                  <FiFolder size={24} />
                </span>
                <div className={styles.links}>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.iconLink}
                      aria-label="GitHub Repository"
                    >
                      <FiGithub size={18} />
                    </a>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      className={styles.iconLink}
                      aria-label="Live Demo"
                    >
                      <FiExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>

              <span className={styles.badge}>{project.category}</span>
              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDesc}>{project.description}</p>

              <div className={styles.tags}>
                {project.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
