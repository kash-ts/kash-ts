'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  SiReact,
  SiJavascript,
  SiTailwindcss,
  SiMongodb,
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiGit,
} from 'react-icons/si';
import styles from './TechStack.module.css';

const technologies = [
  { icon: SiReact, name: 'React', color: '#61DAFB', bg: '#0d1b2a' },
  { icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E', bg: '#1a1a00' },
  { icon: SiTailwindcss, name: 'Tailwind CSS', color: '#38BDF8', bg: '#0c1922' },
  { icon: SiMongodb, name: 'MongoDB', color: '#4DB33D', bg: '#0d1a0c' },
  { icon: SiTypescript, name: 'TypeScript', color: '#3178C6', bg: '#0d1422' },
  { icon: SiNextdotjs, name: 'Next.js', color: '#ffffff', bg: '#111111' },
  { icon: SiNodedotjs, name: 'Node.js', color: '#68A063', bg: '#0d1a0c' },
  { icon: SiGit, name: 'Git', color: '#F05032', bg: '#1f0d08' },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className={styles.section} ref={ref}>
      <div className="container">

        {/* Heading */}
        <motion.div
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className={styles.title}>Мой стек технологий</h2>
          <p className={styles.subtitle}>Технологии, с которыми я работаю</p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className={styles.grid}
          variants={container}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
        >
          {technologies.map(({ icon: Icon, name, color, bg }) => (
            <motion.div
              key={name}
              className={styles.card}
              style={{ '--card-bg': bg } as React.CSSProperties}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <div className={styles.iconWrap} style={{ color }}>
                <Icon size={42} aria-hidden="true" />
              </div>
              <span className={styles.name}>{name}</span>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
