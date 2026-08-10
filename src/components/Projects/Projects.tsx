'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiExternalLink, FiGithub, FiFolder } from 'react-icons/fi';
import styles from './Projects.module.css';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: 'Telegram Бот-Сервис и Интегратор',
    category: 'Telegram Bot',
    description: 'Многофункциональный бот для авто-продаж, модерации каналов и приема платежей (ЮKassa, Crypto Pay). Поддержка админ-панели и уведомлений.',
    tags: ['Python', 'Aiogram', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/kash-ts',
  },
  {
    id: 2,
    title: 'VK & Discord Игровой Менеджер',
    category: 'VK & Discord Bot',
    description: 'Бот автоматизации сообществ с ролевой системой, авто-модерацией, экономикой и триггерными командами для Discord и VKontakte.',
    tags: ['TypeScript', 'Node.js', 'Discord.js', 'VK API'],
    githubUrl: 'https://github.com/kash-ts',
  },
  {
    id: 3,
    title: 'Адаптивный Веб-Сайт & Портфолио',
    category: 'Web App',
    description: 'Высокопроизводительный веб-сайт с плавной навигацией, адаптивным дизайном под все устройства и поддержкой современной CSS-архитектуры.',
    tags: ['Next.js', 'React', 'TypeScript', 'CSS Modules'],
    githubUrl: 'https://github.com/kash-ts',
    demoUrl: '#home',
  },
  {
    id: 4,
    title: '3D Визуализация & UI/UX Концепт',
    category: 'Figma & Blender',
    description: 'Разработка интерактивных 3D-моделей интерфейсов в Blender и создание продуманной UI/UX дизайн-системы в Figma.',
    tags: ['Figma', 'Blender', '3D Design', 'UI/UX'],
  },
];

const categories = ['Все', 'Telegram Bot', 'VK & Discord Bot', 'Web App', 'Figma & Blender'];

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
        
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.title}>Мои проекты</h2>
          <p className={styles.subtitle}>
            Сайты, чат-боты для Telegram, VK, Discord и 3D дизайн-решения.
          </p>

          {/* Filter Tabs */}
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

        {/* Projects Grid */}
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
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.iconLink}
                      aria-label="GitHub Repository"
                    >
                      <FiGithub size={18} />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
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
