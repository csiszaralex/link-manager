import './global.css';

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
