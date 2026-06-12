import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'annotation.gg',
  description: 'Developer team project tracking and Kanban board',
  icons: {
    icon: '/icons/perikon-logo.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark h-full ${inter.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-[#1a1015] text-[#f1dde5]">
        <Navbar />
        <Sidebar />
        <main className="md:ml-[200px] pt-[52px] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
