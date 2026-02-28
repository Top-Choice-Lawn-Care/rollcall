'use client';

import { useState } from 'react';
import { members, Member } from '@/lib/mockData';
import BeltBadge from '@/components/ui/BeltBadge';
import AIInsightCard from '@/components/ui/AIInsightCard';
import Link from 'next/link';

const beltOrder = ['white', 'blue', 'purple', 'brown', 'black'];

const nextBelt: Record<string, string> = {
  white: 'blue',
  blue: 'purple',
  purple: 'brown',
  brown: 'black',
  black: 'black',
};

const beltColors: Record<string, string> = {
  white: '#e5e7eb',
  blue: '#3b82f6',
  purple: '#a855f7',
  brown: '#d97706',
  black: '#374151',
};

const promotionQueue = members.filter((m) => m.aiPromotionScore > 75).sort((a, b) => b.aiPromotionScore - a.aiPromotionScore);

const beltDistribution = beltOrder.map((belt) => ({
  belt,
  count: members.filter((m) => m.belt === belt).length,
  color: beltColors[belt],
}));
const maxCount = Math.max(...beltDistribution.map((b) => b.count));

export default function BeltsPage() {
  const [promoting, setPromoting] = useState<Member | null>(null);
  const [promoted, setPromoted] = useState<Set<string>>(new Set());

  const handlePromote = (member: Member) => {
    setPromoted((prev) => new Set([...prev, member.id]));
    setPromoting(null);
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
          Belt Management
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          AI-powered promotion tracking for Austin BJJ Academy
        </p>
      </div>

      {/* AI Queue */}
      <AIInsightCard title="AI Promotion Queue" className="mb-6" style={{ marginBottom: '24px' }}>
        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px' }}>
          {promotionQueue.length} members scored above 75 — likely ready for belt evaluation.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {promotionQueue.map((member) => (
            <div
              key={member.id}
              style={{
                backgroundColor: '#1c1c24',
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                flexWrap: 'wrap',
              }}
            >
              {/* Score */}
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '2px solid #f59e0b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: '#f59e0b',
                  flexShrink: 0,
                }}
              >
                {member.aiPromotionScore}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <Link
                    href={`/members/${member.id}`}
                    style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}
                  >
                    {member.name}
                  </Link>
                  <BeltBadge belt={member.belt} stripes={member.stripes} size="sm" />
                  {promoted.has(member.id) && (
                    <span
                      style={{
                        backgroundColor: 'rgba(34,197,94,0.15)',
                        color: '#22c55e',
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontWeight: 600,
                      }}
                    >
                      ✅ Promoted
                    </span>
                  )}
                </div>
                <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '3px' }}>
                  {member.daysAtCurrentBelt} days at belt · {member.attendanceCount} total classes
                </div>
              </div>

              {!promoted.has(member.id) && (
                <button
                  onClick={() => setPromoting(member)}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#09090d',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  Promote →
                </button>
              )}
            </div>
          ))}
        </div>
      </AIInsightCard>

      {/* Belt Distribution */}
      <div
        style={{
          backgroundColor: '#131318',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', margin: '0 0 20px' }}>
          Belt Distribution
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {beltDistribution.map(({ belt, count, color }) => (
            <div key={belt} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '80px', flexShrink: 0 }}>
                <BeltBadge belt={belt as any} size="sm" />
              </div>
              <div
                style={{
                  flex: 1,
                  height: '24px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(count / maxCount) * 100}%`,
                    backgroundColor: color,
                    borderRadius: '6px',
                    opacity: 0.85,
                  }}
                />
              </div>
              <div style={{ width: '32px', textAlign: 'right', color: '#9ca3af', fontSize: '14px', fontWeight: 600 }}>
                {count}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {beltDistribution.map(({ belt, count, color }) => (
              <div key={belt} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color }}>{count}</div>
                <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'capitalize', marginTop: '2px' }}>{belt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promote Modal */}
      {promoting && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
          onClick={() => setPromoting(null)}
        >
          <div
            style={{
              backgroundColor: '#1c1c24',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '420px',
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#e8e8ea', fontWeight: 800, fontSize: '22px', margin: '0 0 8px' }}>
              Confirm Promotion
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px' }}>
              This will record a belt promotion for this member.
            </p>

            <div
              style={{
                backgroundColor: '#131318',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
              }}
            >
              <div style={{ fontWeight: 700, color: '#e8e8ea', fontSize: '16px', marginBottom: '8px' }}>
                {promoting.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BeltBadge belt={promoting.belt} stripes={promoting.stripes} />
                <span style={{ color: '#6b7280' }}>→</span>
                <BeltBadge belt={nextBelt[promoting.belt] as any} stripes={0} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setPromoting(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handlePromote(promoting)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#f59e0b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#09090d',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                🥋 Promote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
