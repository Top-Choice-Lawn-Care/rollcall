'use client';

import { useRole, getRoleIcon, getRoleLabel } from '@/lib/useRole';

export default function RoleSwitcher() {
  const { role, cycleRole, mounted, canSwitch } = useRole();

  // Only render after hydration and only for admins
  if (!mounted || !canSwitch) return null;

  return (
    <button
      onClick={cycleRole}
      title={`Current: ${getRoleLabel(role)} — click to switch view`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 12px',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '999px',
        color: '#d4a843',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245, 158, 11, 0.6)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(245, 158, 11, 0.08)';
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(245, 158, 11, 0.35)';
      }}
    >
      <span>{getRoleIcon(role)}</span>
      <span>{getRoleLabel(role)}</span>
    </button>
  );
}
