import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import BottomNav from '@/components/BottomNav';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RollCall — BJJ Gym Management',
  description: 'The gym management platform built for BJJ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: '#09090d', color: '#e8e8ea', margin: 0, padding: 0 }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <Sidebar />
          </div>

          {/* Main content */}
          <main
            style={{ flex: 1, overflowY: 'auto', marginLeft: 0 }}
            className="md:ml-[220px] pb-20 md:pb-0"
          >
            {children}
          </main>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="block md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
