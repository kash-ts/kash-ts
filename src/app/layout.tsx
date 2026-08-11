import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

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
    title: 'Михаил — Fullstack & Automation Developer | Портфолио',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
