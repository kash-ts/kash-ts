'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiCode, FiMapPin } from 'react-icons/fi';
import styles from './About.module.css';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" className={styles.about} ref={ref}>
      <div className={`container ${styles.inner}`}>

        {/* Left: Avatar Image */}
        <motion.div
          className={styles.imageWrap}
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className={styles.imageFrame}>
            <Image
              src="/images/about-avatar.png"
              alt="About Mikhail — full body portrait"
              fill
              unoptimized
              className={styles.image}
            />
          </div>
          <div className={styles.imageBadge} aria-hidden="true">
            <FiCode size={22} color="var(--color-accent)" />
          </div>
        </motion.div>

        {/* Right: About Card */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
        >
          <h2 className={styles.title}>Обо мне</h2>

          <p className={styles.text}>
            Фронтенд-разработчик с опытом создания современных адаптивных
            веб-приложений. Превращаю сложную логику в доступные,
            высокопроизводительные интерфейсы.
          </p>
          <p className={styles.text}>
            Мой стек — React, TypeScript и современная CSS-архитектура.
            Фокусируюсь на надёжной структуре кода, переиспользуемых компонентах
            и чистом пользовательском опыте.
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
