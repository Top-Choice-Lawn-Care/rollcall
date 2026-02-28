import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RollCall — BJJ Gym Management',
  description: 'The gym management platform built for BJJ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ backgroundColor: '#09090d', color: '#e8e8ea', margin: 0, padding: 0 }}
      >
        {children}
      </body>
    </html>
  );
}
