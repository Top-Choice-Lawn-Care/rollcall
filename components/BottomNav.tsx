'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, CheckSquare, Award } from 'lucide-react';
import { useRole, getRoleLabel } from '@/lib/useRole';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Members', href: '/members', icon: Users },
  { label: 'Schedule', href: '/schedule', icon: Calendar },
  { label: 'Check-In', href: '/checkin', icon: CheckSquare },
  { label: 'Belts', href: '/belts', icon: Award },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { role, mounted } = useRole();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#131318',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        zIndex: 50,
      }}
    >
      {mounted && (
        <div style={{
          textAlign: 'center',
          fontSize: '9px',
          fontWeight: 600,
          color: '#d4a843',
          padding: '3px 0 0',
          letterSpacing: '0.04em',
        }}>
          {getRoleLabel(role)}
        </div>
      )}
      <div style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                color: isActive ? '#f59e0b' : '#6b7280',
                textDecoration: 'none',
                fontSize: '10px',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
