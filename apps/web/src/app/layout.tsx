import { cn } from 'apps/web/lib/utils';
import { Inter } from 'next/font/google';
import './global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'Link Manager',
  description: 'Fast link shortener with telemetry',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn('dark', 'font-sans', inter.variable)}>
      <body>{children}</body>
    </html>
  );
}
