import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './Home.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
  }),
};

export default function Home() {
  return (
    <section id="home" className={styles.home}>

      {/* Avatar — Full background layer */}
      <div className={styles.avatarBg}>
        <Image
          src="/images/hero-avatar.png"
          alt="Михаил — AI Аватар"
          fill
          priority
          unoptimized
          className={styles.avatarImage}
        />
      </div>

      {/* Foreground Content */}
      <div className={`container ${styles.inner}`}>
        {/* Left: Text Content */}
        <div className={styles.content}>
          <motion.h1
            className={styles.title}
            initial="hidden"
            animate="show"
            custom={0.1}
            variants={fadeUp}
          >
            Привет, я <span className={styles.titleAccent}>Михаил</span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial="hidden"
            animate="show"
            custom={0.2}
            variants={fadeUp}
          >
            Разработчик npm-библиотек, автоматизаций, сайтов и чат-ботов с опытом
            более 4 лет. Чат-боты для платформ: Telegram (mini app) и Discord.
            Также уверенное владение Figma и Blender.
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
      </div>
    </section>
  );
}
