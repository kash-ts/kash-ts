'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  }),
};

export default function Hero() {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    const container = document.getElementById('fullpage-container');
    const handleScroll = () => {
      const scrollTop = container ? container.scrollTop : window.scrollY;
      if (scrollTop > 60) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="home" className={styles.hero}>

      {/* Background Avatar — absolute, behind everything */}
      <motion.div
        className={styles.avatarBg}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
        aria-hidden="true"
      >
        <Image
          src="/images/hero-avatar.png"
          alt=""
          fill
          priority
          unoptimized
          className={styles.avatarImage}
        />
      </motion.div>

      {/* Foreground content — sits on top of avatar */}
      <div className={`container ${styles.inner}`}>

        {/* Left: Text Content */}
        <div className={styles.content}>
          <motion.h1
            className={styles.title}
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
          >
            Привет, я{' '}
            <span className={styles.titleAccent}>Михаил</span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial="hidden"
            animate="show"
            custom={0.2}
            variants={fadeUp}
          >
            Уверенный разработчик сайтов и чат ботов с опытом более 4 лет.
            <br />
            Чат боты для платформ: Telegram, VKontakte, Discord. Так же увереное владение Figma и Blender.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial="hidden"
            animate="show"
            custom={0.3}
            variants={fadeUp}
          >
            <a href="#works" className={styles.btnPrimary}>
              Глянуть мои проекты
            </a>
          </motion.div>
        </div>

        {/* Right: Stats Card */}

      </div>

      {/* Scroll Down Mouse Indicator — visible only when at top */}
      <motion.a
        href="#about"
        className={styles.scrollIndicator}
        initial={{ opacity: 0, y: 15 }}
        animate={{
          opacity: showScrollIndicator ? 1 : 0,
          y: showScrollIndicator ? 0 : 15,
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        style={{ pointerEvents: showScrollIndicator ? 'auto' : 'none' }}
        aria-label="Скролл вниз"
      >
        <div className={styles.mouse}>
          <motion.div
            className={styles.wheel}
            animate={{
              y: [0, 0, 10],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              times: [0, 0.35, 1],
              ease: ['linear', 'easeOut'],
            }}
          />
        </div>
      </motion.a>
    </section>
  );
}


