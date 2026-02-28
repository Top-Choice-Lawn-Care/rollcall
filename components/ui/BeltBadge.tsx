'use client';

import { Belt } from '@/lib/mockData';

const beltColors: Record<Belt, { bg: string; text: string; label: string }> = {
  white: { bg: '#e5e7eb', text: '#111827', label: 'White' },
  blue: { bg: '#3b82f6', text: '#ffffff', label: 'Blue' },
  purple: { bg: '#a855f7', text: '#ffffff', label: 'Purple' },
  brown: { bg: '#d97706', text: '#ffffff', label: 'Brown' },
  black: { bg: '#374151', text: '#ffffff', label: 'Black' },
};

interface BeltBadgeProps {
  belt: Belt;
  stripes?: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function BeltBadge({ belt, stripes = 0, size = 'md' }: BeltBadgeProps) {
  const { bg, text, label } = beltColors[belt];

  const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 16px' : '4px 12px';
  const fontSize = size === 'sm' ? '11px' : size === 'lg' ? '15px' : '13px';
  const stripeSize = size === 'sm' ? 3 : size === 'lg' ? 5 : 4;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        backgroundColor: bg,
        color: text,
        padding,
        borderRadius: '999px',
        fontSize,
        fontWeight: 600,
        letterSpacing: '0.02em',
      }}
    >
      {label}
      {stripes > 0 && (
        <span style={{ display: 'flex', gap: '2px', marginLeft: '2px' }}>
          {Array.from({ length: stripes }).map((_, i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: `${stripeSize}px`,
                height: size === 'sm' ? '10px' : size === 'lg' ? '16px' : '12px',
                backgroundColor: belt === 'white' ? '#374151' : 'rgba(255,255,255,0.7)',
                borderRadius: '1px',
              }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
