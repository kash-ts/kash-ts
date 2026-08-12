'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  SiJavascript,
  SiMongodb,
  SiTypescript,
  SiNodedotjs,
  SiGit,
  SiDocker,
  SiPython,
  SiPostgresql,
  SiCplusplus,
} from 'react-icons/si';
import styles from './TechStack.module.css';

// Tech stack technology list
const technologies = [
  { icon: SiJavascript, name: 'JavaScript', color: '#F7DF1E', bg: '#1a1a00' },
  { icon: SiTypescript, name: 'TypeScript', color: '#3178C6', bg: '#0d1422' },
  { icon: SiPython, name: 'Python', color: '#3776AB', bg: '#0d1b2a' },
  { icon: SiCplusplus, name: 'C++', color: '#00599C', bg: '#0a1526' },
  { icon: SiDocker, name: 'Docker', color: '#2496ED', bg: '#0a192f' },
  { icon: SiPostgresql, name: 'PostgreSQL', color: '#4169E1', bg: '#0c192c' },
  { icon: SiMongodb, name: 'MongoDB', color: '#4DB33D', bg: '#0d1a0c' },
  { icon: SiNodedotjs, name: 'Node.js', color: '#68A063', bg: '#0d1a0c' },
  { icon: SiGit, name: 'Git', color: '#F05032', bg: '#1f0d08' },
];

// Container and item animation variants
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
  const isInView = useInView(ref, { once: false, margin: '-80px' });

  return (
    <section id="skills" className={styles.section} ref={ref}>
      <div className={`container ${styles.inner}`}>

        {/* Section header */}
        <motion.div
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <h2 className={styles.title}>Мой стек технологий</h2>
        </motion.div>

        {/* Technology cards grid */}
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
