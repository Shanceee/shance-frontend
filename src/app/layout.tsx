import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { QueryProvider } from '@/components/providers/QueryProvider';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Shance - Стань частью стартапа',
  description:
    'Твой путь в IT-стартапе — просто и быстро. Стань частью стартапа, найди свой проект и расти профессионально.',
  keywords: 'стартап, IT, проекты, команда, разработка, карьера',
  authors: [{ name: 'Shance Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#232323',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
