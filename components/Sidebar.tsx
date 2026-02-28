'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CheckSquare,
  Award,
  CreditCard,
  BarChart2,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { useRole, getRoleLabel } from '@/lib/useRole';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Members', href: '/members', icon: Users },
  { label: 'Schedule', href: '/schedule', icon: Calendar },
  { label: 'Check-In', href: '/checkin', icon: CheckSquare },
  { label: 'Belts', href: '/belts', icon: Award },
  { label: 'Billing', href: '/billing', icon: CreditCard },
  { label: 'Reports', href: '/reports', icon: BarChart2 },
  { label: 'Comms', href: '/communications', icon: MessageSquare },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role, mounted } = useRole();

  return (
    <aside
      style={{
        width: '220px',
        height: '100vh',
        backgroundColor: '#131318',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🥋</span>
            <div>
              <div style={{ color: '#e8e8ea', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em' }}>
                RollCall
              </div>
              <div style={{ color: '#6b7280', fontSize: '11px' }}>Austin BJJ Academy</div>
              {mounted && (
                <div style={{ color: '#d4a843', fontSize: '10px', fontWeight: 600, marginTop: '2px', letterSpacing: '0.02em' }}>
                  {getRoleLabel(role)}
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                color: isActive ? '#e8e8ea' : '#6b7280',
                backgroundColor: isActive ? '#1c1c24' : 'transparent',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive ? '3px solid #f59e0b' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: '#09090d',
            }}
          >
            MB
          </div>
          <div>
            <div style={{ color: '#e8e8ea', fontSize: '13px', fontWeight: 600 }}>Marcus Bell</div>
            <div style={{ color: '#6b7280', fontSize: '11px' }}>Head Instructor</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
