'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { FiArrowRight, FiStar, FiDownload } from 'react-icons/fi';
import { env } from '@/config/env';
import styles from './Projects.module.css';

// Project data interface
interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
  isNpm?: boolean;
  github?: string;
  link?: string;
}

interface ProjectStats {
  stars?: number | string;
  downloads?: number | string;
}

// Portfolio projects list matching API paths
const projectsData: Project[] = [
  {
    id: 'kash-ts/alerts-SDK',
    title: 'DonationAlerts SDK',
    category: 'NPM Library',
    description:
      'Библиотека для интеграции с DonationAlerts API. Она предоставляет полный набор инструментов для авторизации, управления пользовательскими токенами, получения данных учетной записи и обработки других взаимодействий.',
    tags: ['TypeScript', 'NPM'],
    image: '/images/project/alerts-SDK.png',
    isNpm: true,
    github: 'https://github.com/kash-ts/alerts-SDK',
  },
  {
    id: 'kash-ts/atb-currency-bot',
    title: 'Отслеживание курса АТБ',
    category: 'Telegram Bot',
    description:
      'Telegram-бот для отслеживания курсов валют (USD, EUR, CNY) с сайта АТБ (Азиатско-Тихоокеанский банк). Бот сохраняет курсы в локальную базу данных (SQLite) и каждый час отправляет пользователю уведомления об их изменении.',
    tags: ['Python', 'SQLite', 'Telegram'],
    image: '/images/project-2.png',
    isNpm: false,
    github: 'https://github.com/kash-ts/atb-currency-bot',
  },
  {
    id: 'kash-ts/schedule-in-notifications',
    title: 'Schedule Notifications',
    category: 'Android App',
    description:
      'Простое Android-приложение, написанное на Kotlin, для удобного отображения пользовательского расписания занятий и текущих задач в постоянных системных уведомлениях (Foreground Service Notification).',
    tags: ['Kotlin', 'Android'],
    image: '/images/project-3.png',
    isNpm: false,
    github: 'https://github.com/kash-ts/schedule-in-notifications',
  },
];

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
  const [statsMap, setStatsMap] = useState<Record<string, ProjectStats>>({});
  const [isExpanded, setIsExpanded] = useState(false);

  // Check URL hash for #works-full on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#works-full') {
      setIsExpanded(true);
    }
  }, []);

  useEffect(() => {
    const fetchAllProjectStats = async () => {
      const newStatsMap: Record<string, ProjectStats> = {};

      await Promise.all(
        projectsData.map(async (project) => {
          try {
            const baseUrl = env.apiUrl.replace(/\/$/, '');
            const queryParam = project.isNpm ? '?npm=true' : '';
            const endpoint = `${baseUrl}/api/project/${project.id}${queryParam}`;

            const response = await fetch(endpoint);
            if (!response.ok) {
              newStatsMap[project.id] = { stars: '???' };
              return;
            }

            const data = await response.json();
            const stars = data.stars ?? data.stargazers_count ?? data.starCount;
            const downloads = data.downloads ?? data.downloadCount ?? data.downloadsCount;

            newStatsMap[project.id] = {
              stars: stars !== undefined && stars !== null ? stars : '???',
              downloads: downloads !== undefined && downloads !== null && downloads !== 0 ? downloads : undefined,
            };
          } catch (err) {
            console.error(`Failed to fetch stats for ${project.id}:`, err);
            newStatsMap[project.id] = { stars: '???' };
          }
        })
      );

      setStatsMap(newStatsMap);
    };

    fetchAllProjectStats();
  }, []);

  // Display only 4 projects initially unless expanded or project count <= 4
  const visibleProjects =
    isExpanded || projectsData.length <= 4 ? projectsData : projectsData.slice(0, 4);

  return (
    <section id="works" className={styles.section} ref={ref}>
      <div className={`container ${styles.inner}`}>

        {/* Section header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className={styles.title}>Мои проекты</h2>
        </motion.div>

        {/* Project cards grid */}
        <div className={styles.grid}>
          {visibleProjects.map((project, idx) => {
            const stats = statsMap[project.id];
            const starValue = stats?.stars !== undefined ? stats.stars : '???';
            const downloadValue = stats?.downloads !== undefined ? stats.downloads : '???';

            return (
              <motion.article
                key={project.id}
                className={styles.card}
                initial="hidden"
                animate={isInView ? 'show' : 'hidden'}
                custom={idx}
                variants={fadeUp}
              >
                {/* Banner Image Container */}
                <div className={styles.imageContainer}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    unoptimized
                    className={styles.projectImage}
                  />
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  {/* Top Stats Row: Downloads on LEFT, Stars on RIGHT */}
                  <div className={styles.statsRow}>
                    <div>
                      {project.isNpm && (
                        <span className={styles.downloadStat} title="Количество установок">
                          <FiDownload size={14} className={styles.downloadIcon} />
                          <span>{downloadValue}</span>
                        </span>
                      )}
                    </div>

                    <span className={styles.starStat} title="Звёзды GitHub">
                      <span>{starValue}</span>
                      <FiStar size={14} className={styles.starIcon} />
                    </span>
                  </div>

                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDesc}>{project.description}</p>

                  <a
                    href={project.github || project.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewDetailsBtn}
                  >
                    Подробнее <FiArrowRight className={styles.btnArrow} size={16} />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* View all projects text link (renders only if projects count > 4 and not expanded) */}
        {projectsData.length > 4 && !isExpanded && (
          <motion.div
            className={styles.actionContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? 'show' : 'hidden'}
            custom={0.4}
            variants={fadeUp}
          >
            <a
              href="#works-full"
              className={styles.viewAllLink}
              onClick={() => setIsExpanded(true)}
            >
              Посмотреть все проекты &rarr;
            </a>
          </motion.div>
        )}

      </div>
    </section>
  );
}
