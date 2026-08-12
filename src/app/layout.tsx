import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ToastProvider from '@/components/Providers/ToastProvider';
import './globals.css';

// Load Inter font with cyrillic and latin subsets
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

// Global page metadata and SEO options
export const metadata: Metadata = {
  title: 'Михаил — Fullstack & Automation Developer',
  description:
    'Портфолио разработчика npm-библиотек, веб-сайтов, автоматизаций и чат-ботов с опытом более 4 лет. Проекты на React, Next.js, TypeScript, Python, Telegram Mini Apps, Figma и Blender.',
  keywords: [
    'fullstack',
    'react',
    'nextjs',
    'typescript',
    'python',
    'telegram bot',
    'discord bot',
    'npm',
    'figma',
  ],
  authors: [{ name: 'Михаил', url: 'https://github.com/kash-ts' }],
  creator: 'Михаил',
  openGraph: {
    title: 'Михаил — Fullstack & Automation Developer',
    description:
      'Разработка npm-библиотек, автоматизаций, сайтов и чат-ботов с опытом более 4 лет. Telegram (mini app), Discord, Figma & Blender.',
    url: 'https://github.com/kash-ts',
    siteName: 'Портфолио разработчика',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Михаил — Fullstack & Automation Developer',
    description:
      'Разработка npm-библиотек, веб-сайтов, автоматизаций и чат-ботов с опытом более 4 лет.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/images/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/images/favicon.svg',
    apple: '/images/favicon.svg',
  },
};

// Main root layout component wrapper
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
