import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dimsum Ampas Tahu - Kitchen Display System',
  description: 'Real-time kitchen display system untuk Dimsum Ampas Tahu',
  manifest: '/manifest.json',
  themeColor: '#f97316',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}