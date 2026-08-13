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
    tags: ['Python', 'Telegram'],
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
          {projectsData.map((project, idx) => {
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
                          <FiDownload size={14} className={styles.downloadIcon} /> {downloadValue}
                        </span>
                      )}
                    </div>

                    <span className={styles.starStat} title="Звёзды GitHub">
                      {starValue} <FiStar size={14} className={styles.starIcon} />
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

        {/* Continue button at bottom center */}
        <motion.div
          className={styles.actionContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? 'show' : 'hidden'}
          custom={0.4}
          variants={fadeUp}
        >
          <a href="#contact" className={styles.btnContinue}>
            Продолжить
          </a>
        </motion.div>

      </div>
    </section>
  );
}
