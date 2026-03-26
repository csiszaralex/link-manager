import { Inter } from 'next/font/google';
import './global.css';

export const metadata = {
  title: 'Link Manager',
  description: 'Fast link shortener with telemetry',
};
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
