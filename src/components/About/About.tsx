'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiMapPin } from 'react-icons/fi';
import styles from './About.module.css';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-80px' });

  return (
    <section id="about" className={styles.about} ref={ref}>
      <div className={`container ${styles.inner}`}>

        {/* About section card */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className={styles.title}>Обо мне</h2>

          <p className={styles.text}>
            Более 4 лет занимаюсь Fullstack-разработкой, проектированием автоматизаций и созданием собственного Open-Source инструментария.
          </p>
          <p className={styles.text}>
            Специализируюсь на веб-приложениях на React/Next.js и TypeScript, а также на серверной логике и архитектуре БД (PostgreSQL, MongoDB). Отдельное направление работы — экосистема Telegram (включая Telegram Mini Apps), Discord-боты и публикация готовых npm-библиотек.
          </p>

          <div className={styles.highlights}>

            <div className={styles.highlight}>
              <span className={styles.highlightIcon}>
                <FiMapPin size={18} />
              </span>
              <div>
                <strong>Местоположение</strong>
                <p>Удалённо / Весь мир</p>
              </div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
