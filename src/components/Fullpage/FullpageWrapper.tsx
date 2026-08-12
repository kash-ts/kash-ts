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

  // Sync section state in URL hash on scroll & handle direct hash navigation
  useEffect(() => {
    const container = document.getElementById('fullpage-container');
    if (!container) return;

    const getSectionId = (index: number): string | null => {
      const sectionEl = container.children[index] as HTMLElement | undefined;
      const childSection = sectionEl?.querySelector('section[id]');
      return childSection?.id || null;
    };

    // Scroll to target section on initial load if hash is present in URL
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
      const sections = Array.from(container.children) as HTMLElement[];
      const targetIdx = sections.findIndex((sec) => {
        const childSec = sec.querySelector('section[id]');
        return childSec?.id === initialHash;
      });

      if (targetIdx !== -1) {
        setTimeout(() => {
          container.scrollTo({
            top: targetIdx * container.clientHeight,
            behavior: 'smooth',
          });
        }, 150);
      }
    }

    let scrollTimeout: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const sectionHeight = container.clientHeight;
        if (sectionHeight <= 0) return;
        const currentIndex = Math.round(container.scrollTop / sectionHeight);
        const activeId = getSectionId(currentIndex);

        if (activeId && window.location.hash !== `#${activeId}`) {
          window.history.replaceState(null, '', `#${activeId}`);
        }
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    const container = document.getElementById('fullpage-container');
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // 1. На экранах небольшой ширины или высоты — обычный естественный скролл
      if (window.innerWidth <= 768 || window.innerHeight < 650) {
        return;
      }

      // 2. Проверяем, находится ли курсор мыши над полями формы
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInputField = Boolean(
          target.closest('textarea, input, select, form, [contenteditable="true"]')
        );

        if (isInputField) {
          const textarea = target.closest('textarea') as HTMLTextAreaElement | null;

          if (textarea) {
            // Проверяем наличие внутреннего вертикального скролла у textarea
            const hasScroll = textarea.scrollHeight > textarea.clientHeight + 2;

            if (hasScroll) {
              const atTop = textarea.scrollTop <= 0;
              const atBottom =
                textarea.scrollTop + textarea.clientHeight >= textarea.scrollHeight - 1;

              // Если дошли до края (верх/низ), отменяем прокрутку всей страницы браузером!
              if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
                e.preventDefault();
              }
              // Внутри диапазона текса разрешаем внутренний скролл textarea
              return;
            }
          }

          // Если у textarea нет скролла или мышь над другим полем формы —
          // ПОЛНОСТЬЮ БЛОКИРУЕМ прокрутку всей страницы через e.preventDefault()!
          e.preventDefault();
          return;
        }
      }

      const sections = Array.from(container.children) as HTMLElement[];
      if (sections.length === 0) return;

      const currentScroll = container.scrollTop;
      const sectionHeight = container.clientHeight;
      const currentIndex = Math.round(currentScroll / sectionHeight);

      const currentSection = sections[currentIndex];

      // 3. Проверяем, не переполнен ли контент текущей секции по высоте
      if (currentSection) {
        const isContentOverflowing = currentSection.scrollHeight > currentSection.clientHeight + 20;

        if (isContentOverflowing) {
          const atTop = currentSection.scrollTop <= 5;
          const atBottom =
            currentSection.scrollTop + currentSection.clientHeight >= currentSection.scrollHeight - 5;

          if ((e.deltaY > 0 && !atBottom) || (e.deltaY < 0 && !atTop)) {
            return;
          }
        }
      }

      // 4. Полноэкранный плавный fullpage скролл
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
