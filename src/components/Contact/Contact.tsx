'use client';

import { useRef, useState, useEffect } from 'react';
import Script from 'next/script';
import { motion, useInView } from 'framer-motion';
import { FiMail, FiGithub, FiCheckCircle } from 'react-icons/fi';
import styles from './Contact.module.css';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: 'light' | 'dark' | 'auto';
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

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

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string; turnstile?: string }>({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const initTurnstile = () => {
    if (window.turnstile && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
          theme: 'dark',
          callback: (token: string) => {
            setTurnstileToken(token);
            setErrors((prev) => ({ ...prev, turnstile: undefined }));
          },
          'error-callback': () => {
            setTurnstileToken('');
            setErrors((prev) => ({ ...prev, turnstile: 'Ошибка капчи Cloudflare Turnstile' }));
          },
          'expired-callback': () => {
            setTurnstileToken('');
          },
        });
      } catch (err) {
        console.error('Turnstile render error:', err);
      }
    }
  };

  useEffect(() => {
    initTurnstile();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldKey = id.replace('contact-', '');
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));

    // Real-time error clearance
    if (fieldKey === 'email') {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, email: 'Введите email адрес' }));
      } else if (!validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: 'Некорректный формат email (например, user@domain.com)' }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    } else if (fieldKey === 'name') {
      setErrors((prev) => ({ ...prev, name: value.trim() ? undefined : 'Пожалуйста, введите ваше имя' }));
    } else if (fieldKey === 'message') {
      setErrors((prev) => ({ ...prev, message: value.trim() ? undefined : 'Пожалуйста, введите сообщение' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; email?: string; message?: string; turnstile?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, введите ваше имя';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Пожалуйста, введите email адрес';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Некорректный формат email (например, user@domain.com)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Пожалуйста, введите сообщение';
    }

    if (!turnstileToken) {
      newErrors.turnstile = 'Пройдите проверку Cloudflare Turnstile перед отправкой';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // Simulate request send
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTurnstileToken('');
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }, 800);
  };

  return (
    <section id="contact" className={styles.section} ref={ref}>
      {/* Cloudflare Turnstile Explicit API Script */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        onLoad={initTurnstile}
        strategy="afterInteractive"
      />

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
          {isSubmitted ? (
            <div className={styles.successMessage}>
              <FiCheckCircle size={28} style={{ marginBottom: 8, display: 'block', margin: '0 auto' }} />
              Спасибо! Ваше сообщение успешно отправлено.
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-name">Имя</label>
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Ваше имя"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-message">Сообщение</label>
                <textarea
                  id="contact-message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                  placeholder="Расскажите о вашем проекте..."
                />
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              </div>

              {/* Cloudflare Turnstile Container */}
              <div className={styles.turnstileContainer}>
                <div ref={turnstileRef} />
              </div>
              {errors.turnstile && <span className={styles.errorText}>{errors.turnstile}</span>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.btn}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          )}
        </motion.div>

      </div>
    </section>
  );
}
