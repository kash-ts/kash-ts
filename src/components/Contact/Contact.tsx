'use client';

import { useRef, useState, useCallback } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { env } from '@/config/env';
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

const TURNSTILE_SITE_KEY = env.turnstileSiteKey;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const, delay },
  }),
};

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
  turnstile?: string;
};

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-80px' });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [turnstileToken, setTurnstileToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const initTurnstile = useCallback(() => {
    if (TURNSTILE_SITE_KEY && window.turnstile && turnstileRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: 'light',
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldKey = id.replace('contact-', '') as keyof typeof formData;
    setFormData((prev) => ({ ...prev, [fieldKey]: value }));

    if (fieldKey === 'email') {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, email: 'Введите email адрес' }));
      } else if (!validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: 'Некорректный формат email' }));
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

    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Пожалуйста, введите ваше имя';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Пожалуйста, введите email адрес';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Пожалуйста, введите сообщение';
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      newErrors.turnstile = 'Пройдите проверку Cloudflare Turnstile перед отправкой';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

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
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          onLoad={initTurnstile}
          strategy="afterInteractive"
        />
      )}

      <div className={`container ${styles.inner}`}>

        {/* Top Header */}
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={isInView ? 'show' : 'hidden'}
          custom={0}
          variants={fadeUp}
        >
          <h2 className={styles.title}>Свяжитесь со мной</h2>
          <p className={styles.subtitle}>Напишите — отвечу в течение дня.</p>
        </motion.div>

        {/* Bottom Content Grid */}
        <div className={styles.grid}>

          {/* Left: form */}
          <motion.div
            className={styles.card}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            custom={0.1}
            variants={fadeUp}
          >
            {isSubmitted ? (
              <div className={styles.successMessage}>
                <FiCheckCircle size={28} className={styles.successIcon} />
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
                    placeholder="email@example.com"
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
                {TURNSTILE_SITE_KEY ? (
                  <div className={styles.turnstileContainer}>
                    <div ref={turnstileRef} />
                  </div>
                ) : null}
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

          {/* Right: avatar placeholder */}
          <motion.div
            className={styles.avatarContainer}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            custom={0.2}
            variants={fadeUp}
          >
            <div className={styles.avatarCard}>
              <Image
                src="/images/contact-avatar.png"
                alt="Михаил — Контакты"
                fill
                unoptimized
                className={styles.avatarImage}
              />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
