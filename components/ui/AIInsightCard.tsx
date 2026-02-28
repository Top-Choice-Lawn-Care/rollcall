'use client';

import { ReactNode, CSSProperties } from 'react';

interface AIInsightCardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function AIInsightCard({ title = 'AI Insights', children, className = '', style }: AIInsightCardProps) {
  return (
    <div
      className={className}
      style={{
        backgroundColor: '#131318',
        border: '1px solid #f59e0b',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 0 20px rgba(245, 158, 11, 0.08)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <span style={{ fontSize: '18px' }}>✨</span>
        <span
          style={{
            color: '#f59e0b',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ color: '#e8e8ea' }}>{children}</div>
    </div>
  );
}
