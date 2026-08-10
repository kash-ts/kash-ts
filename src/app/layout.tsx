import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Portfolio — Frontend Developer',
  description:
    'Personal portfolio of a Frontend Developer specializing in React, TypeScript and modern web technologies.',
  keywords: ['portfolio', 'frontend', 'developer', 'react', 'typescript', 'nextjs'],
  authors: [{ name: 'Portfolio' }],
  openGraph: {
    title: 'Portfolio — Frontend Developer',
    description: 'Personal portfolio of a Frontend Developer.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
