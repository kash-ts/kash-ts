'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './FullpageWrapper.module.css';

interface FullpageWrapperProps {
  children: React.ReactNode;
}

const sectionVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

export default function FullpageWrapper({ children }: FullpageWrapperProps) {
  const isScrollingRef = useRef(false);

  useEffect(() => {
    const container = document.getElementById('fullpage-container');
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // 1. Если ширина или высота экрана слишком мала — используем естественную обычную прокрутку
      if (window.innerWidth <= 768 || window.innerHeight < 650) {
        return;
      }

      const sections = Array.from(container.children) as HTMLElement[];
      if (sections.length === 0) return;

      const currentScroll = container.scrollTop;
      const sectionHeight = container.clientHeight;
      const currentIndex = Math.round(currentScroll / sectionHeight);

      const currentSection = sections[currentIndex];

      // 2. Проверяем, не переполнен ли контент текущей секции по высоте
      if (currentSection) {
        const isContentOverflowing = currentSection.scrollHeight > currentSection.clientHeight + 20;
        
        // Если контенту внутри секции не хватает места:
        if (isContentOverflowing) {
          const atTop = currentSection.scrollTop <= 5;
          const atBottom =
            currentSection.scrollTop + currentSection.clientHeight >= currentSection.scrollHeight - 5;

          // Разрешаем естественный скролл внутри самой секции
          if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
            return; // Даём браузеру обычный скролл внутри секции
          }
        }
      }

      // 3. Во всех остальных случаях — полноэкранный плавный fullpage скролл
      if (isScrollingRef.current) {
        e.preventDefault();
        return;
      }

      const delta = e.deltaY;
      if (Math.abs(delta) < 15) return;

      if (delta > 0 && currentIndex < sections.length - 1) {
        // Скролл вниз к следующей секции
        e.preventDefault();
        isScrollingRef.current = true;
        const targetTop = (currentIndex + 1) * sectionHeight;

        container.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 700);
      } else if (delta < 0 && currentIndex > 0) {
        // Скролл вверх к предыдущей секции
        e.preventDefault();
        isScrollingRef.current = true;
        const targetTop = (currentIndex - 1) * sectionHeight;

        container.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        });

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 700);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className={styles.fullpageContainer} id="fullpage-container">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return (
          <div className={styles.section}>
            <motion.div
              className={styles.sectionContent}
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.3 }}
              variants={sectionVariant}
            >
              {child}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
