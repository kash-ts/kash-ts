'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FiMail, FiGithub } from 'react-icons/fi';
import styles from './Contact.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay },
  }),
};

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="contact" className={styles.section} ref={ref}>
      <div className={`container ${styles.inner}`}>

        {/* Left: info */}
        <motion.div
          className={styles.lead}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          custom={0}
          variants={fadeUp}
        >
          <h2 className={styles.title}>Свяжитесь со мной</h2>
          <p className={styles.subtitle}>
            Открыт к новым проектам и предложениям о сотрудничестве.
            Напишите — отвечу в течение дня.
          </p>

          <div className={styles.links}>
            <a
              href="mailto:ipomainkra@gmail.com"
              className={styles.link}
            >
              <FiMail size={18} className={styles.linkIcon} />
              ipomainkra@gmail.com
            </a>
            <a
              href="https://github.com/kash-ts"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <FiGithub size={18} className={styles.linkIcon} />
              github.com/kash-ts
            </a>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          className={styles.card}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          custom={0.1}
          variants={fadeUp}
        >
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-name">Имя</label>
            <input
              id="contact-name"
              type="text"
              className={styles.input}
              placeholder="Ваше имя"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-message">Сообщение</label>
            <textarea
              id="contact-message"
              className={styles.textarea}
              placeholder="Расскажите о вашем проекте..."
            />
          </div>
          <button type="button" className={styles.btn}>
            Отправить
          </button>
        </motion.div>

      </div>
    </section>
  );
}
