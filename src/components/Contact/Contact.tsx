'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import toast from 'react-hot-toast';
import { SmartCaptcha } from '@yandex/smart-captcha';
import { env } from '@/config/env';
import styles from './Contact.module.css';

const CAPTCHA_SITE_KEY = env.yandexCaptchaSiteKey;

const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 100;
const MIN_MESSAGE_LENGTH = 50;
const MAX_MESSAGE_LENGTH = 1024;

const DRAFT_STORAGE_KEY = 'contact_form_draft';
const DRAFT_EXPIRY_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

// Name: letters, numbers, spaces, and allowed special characters (- _ ')
const sanitizeName = (val: string) => val.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s\-_']/g, '');

// Email: allowed email characters (latin, digits, @ . _ - +)
const sanitizeEmail = (val: string) => val.replace(/[^a-zA-Z0-9@._+-]/g, '');

// Message: strip control characters
const sanitizeMessage = (val: string) => val.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, '');

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
  captcha?: string;
};

const validateEmail = (email: string) =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '-80px' });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [captchaToken, setCaptchaToken] = useState('');
  const [resetCaptchaKey, setResetCaptchaKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore draft from localStorage (if non-expired <= 12h)
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && parsed.expiry && parsed.expiry > Date.now() && parsed.data) {
          setFormData(parsed.data);
        } else {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
        }
      }
    } catch (err) {
      console.error('Failed to load form draft from localStorage:', err);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldKey = id.replace('contact-', '') as keyof typeof formData;
    let cleanedValue = value;

    if (fieldKey === 'name') {
      cleanedValue = sanitizeName(value).slice(0, MAX_NAME_LENGTH);
    } else if (fieldKey === 'email') {
      cleanedValue = sanitizeEmail(value).slice(0, MAX_EMAIL_LENGTH);
    } else if (fieldKey === 'message') {
      cleanedValue = sanitizeMessage(value).slice(0, MAX_MESSAGE_LENGTH);
    }

    const updatedData = { ...formData, [fieldKey]: cleanedValue };
    setFormData(updatedData);

    // Auto-save form draft to localStorage (valid for 12 hours)
    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({
          data: updatedData,
          expiry: Date.now() + DRAFT_EXPIRY_TIME,
        })
      );
    } catch (err) {
      console.error('Failed to save form draft to localStorage:', err);
    }

    if (fieldKey === 'email') {
      if (!cleanedValue.trim()) {
        setErrors((prev) => ({ ...prev, email: 'Введите email адрес' }));
      } else if (!validateEmail(cleanedValue)) {
        setErrors((prev) => ({ ...prev, email: 'Некорректный формат email' }));
      } else {
        setErrors((prev) => ({ ...prev, email: undefined }));
      }
    } else if (fieldKey === 'name') {
      if (!cleanedValue.trim()) {
        setErrors((prev) => ({ ...prev, name: 'Пожалуйста, введите ваше имя' }));
      } else if (cleanedValue.trim().length < 2) {
        setErrors((prev) => ({ ...prev, name: 'Имя должно содержать минимум 2 символа' }));
      } else {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }
    } else if (fieldKey === 'message') {
      const trimmed = cleanedValue.trim();
      if (!trimmed) {
        setErrors((prev) => ({ ...prev, message: 'Пожалуйста, введите сообщение' }));
      } else if (trimmed.length < MIN_MESSAGE_LENGTH) {
        setErrors((prev) => ({
          ...prev,
          message: `Сообщение должно содержать минимум ${MIN_MESSAGE_LENGTH} символов`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, message: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      newErrors.name = 'Пожалуйста, введите ваше имя';
    } else if (trimmedName.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!trimmedEmail) {
      newErrors.email = 'Пожалуйста, введите email адрес';
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = 'Некорректный формат email';
    }

    if (!trimmedMessage) {
      newErrors.message = 'Пожалуйста, введите сообщение';
    } else if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
      newErrors.message = `Сообщение должно содержать минимум ${MIN_MESSAGE_LENGTH} символов`;
    }

    if (CAPTCHA_SITE_KEY && !captchaToken) {
      newErrors.captcha = 'Пройдите проверку Яндекс SmartCaptcha перед отправкой';
    }

    setErrors(newErrors);

    const hasInputErrors = Boolean(newErrors.name || newErrors.email || newErrors.message);
    const hasCaptchaError = Boolean(newErrors.captcha);

    if (hasInputErrors) {
      toast.error('Заполните все обязательные поля формы');
      return;
    }

    if (hasCaptchaError) {
      toast.error('Пройдите проверку капчи перед отправкой');
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = env.apiUrl.replace(/\/$/, '');
      const endpoint = `${baseUrl}/api/message/new/`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          captchaToken: captchaToken || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      // Success toast notification
      toast.success('Сообщение успешно отправлено!');

      // Reset form fields, clear draft, and reset captcha
      setFormData({ name: '', email: '', message: '' });
      setCaptchaToken('');
      setResetCaptchaKey((prev) => prev + 1);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to submit message to API:', err);
      // Error toast notification without resetting form fields
      toast.error('Ошибка при отправке сообщения. Попробуйте снова чуть позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className={styles.section} ref={ref}>
      <div className={`container ${styles.inner}`}>

        {/* Section Header */}
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

        {/* Feedback content grid */}
        <div className={styles.grid}>

          {/* Left column: contact form */}
          <motion.div
            className={styles.card}
            initial="hidden"
            animate={isInView ? 'show' : 'hidden'}
            custom={0.1}
            variants={fadeUp}
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-name">Имя</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  maxLength={MAX_NAME_LENGTH}
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
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  maxLength={MAX_EMAIL_LENGTH}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="email@example.com"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label className={styles.label} htmlFor="contact-message">Сообщение</label>
                  <span className={styles.charCounter}>
                    {formData.message.length}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  autoComplete="off"
                  value={formData.message}
                  onChange={handleInputChange}
                  maxLength={MAX_MESSAGE_LENGTH}
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                  placeholder="Расскажите о вашем проекте (минимум 50 символов)..."
                />
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              </div>

              {/* Official Yandex SmartCaptcha React component */}
              {CAPTCHA_SITE_KEY ? (
                <div className={styles.turnstileContainer}>
                  <SmartCaptcha
                    key={resetCaptchaKey}
                    sitekey={CAPTCHA_SITE_KEY}
                    onSuccess={(token) => {
                      setCaptchaToken(token);
                      setErrors((prev) => ({ ...prev, captcha: undefined }));
                    }}
                    onTokenExpired={() => setCaptchaToken('')}
                    onNetworkError={() => {
                      setCaptchaToken('');
                      setErrors((prev) => ({ ...prev, captcha: 'Ошибка капчи Яндекс SmartCaptcha' }));
                    }}
                    theme="light"
                  />
                </div>
              ) : null}
              {errors.captcha && <span className={styles.errorText}>{errors.captcha}</span>}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.btn}
              >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          </motion.div>

          {/* Right column: responsive avatar */}
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
