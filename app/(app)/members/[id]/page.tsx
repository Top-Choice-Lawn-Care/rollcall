'use client';

import { members, promotionHistory } from '@/lib/mockData';
import BeltBadge from '@/components/ui/BeltBadge';
import AIInsightCard from '@/components/ui/AIInsightCard';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

const recentClasses = [
  { date: 'Feb 27', class: 'Advanced', duration: '90 min', time: '7:00 PM' },
  { date: 'Feb 26', class: 'Fundamentals', duration: '60 min', time: '7:00 PM' },
  { date: 'Feb 25', class: 'Open Mat', duration: '120 min', time: '10:00 AM' },
  { date: 'Feb 22', class: 'Competition Prep', duration: '90 min', time: '1:00 PM' },
  { date: 'Feb 20', class: 'Advanced', duration: '90 min', time: '7:00 PM' },
  { date: 'Feb 19', class: 'Fundamentals', duration: '60 min', time: '7:00 PM' },
];

const beltColors: Record<string, string> = {
  white: '#e5e7eb',
  blue: '#3b82f6',
  purple: '#a855f7',
  brown: '#d97706',
  black: '#374151',
};

export default function MemberProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const member = members.find((m) => m.id === id) || members[0];

  const scoreColor =
    member.aiPromotionScore >= 80 ? '#22c55e' : member.aiPromotionScore >= 60 ? '#f59e0b' : '#6b7280';

  // Calculate circle progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progress = (member.aiPromotionScore / 100) * circumference;

  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh' }}>
      {/* Back */}
      <Link
        href="/members"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: '#6b7280',
          textDecoration: 'none',
          fontSize: '14px',
          marginBottom: '24px',
        }}
      >
        <ArrowLeft size={14} />
        Back to Members
      </Link>

      {/* Profile Header */}
      <div
        style={{
          backgroundColor: '#131318',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '28px',
          marginBottom: '24px',
          display: 'flex',
          gap: '28px',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: beltColors[member.belt] || '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '28px',
            color: member.belt === 'white' ? '#09090d' : '#ffffff',
            flexShrink: 0,
          }}
        >
          {member.name.split(' ').map((n) => n[0]).join('')}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#e8e8ea', margin: 0 }}>{member.name}</h1>
            <BeltBadge belt={member.belt} stripes={member.stripes} size="md" />
          </div>
          <div style={{ display: 'flex', gap: '20px', color: '#6b7280', fontSize: '13px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={13} /> {member.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={13} /> {member.phone}
            </span>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div
              style={{
                backgroundColor: '#1c1c24',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                color: '#9ca3af',
              }}
            >
              Joined {member.joinDate}
            </div>
            <div
              style={{
                backgroundColor: '#1c1c24',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                color: '#9ca3af',
              }}
            >
              {member.plan} · ${member.monthlyFee}/mo
            </div>
            <div
              style={{
                backgroundColor: '#1c1c24',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                color: '#9ca3af',
              }}
            >
              Last seen {member.lastSeen}
            </div>
          </div>
        </div>

        {/* AI Score Ring */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeDasharray={`${progress} ${circumference}`}
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '20px', fontWeight: 800, color: scoreColor }}>{member.aiPromotionScore}</div>
            </div>
          </div>
          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px', fontWeight: 600, letterSpacing: '0.05em' }}>
            AI PROMO SCORE
          </div>
        </div>
      </div>

      {/* Stats + AI Insight */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { label: 'Total Classes', value: member.attendanceCount.toLocaleString() },
            { label: 'Days at Belt', value: member.daysAtCurrentBelt },
            { label: 'Monthly Fee', value: `$${member.monthlyFee}` },
            { label: 'Stripes', value: `${member.stripes}/4` },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: '#131318',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </div>
              <div style={{ color: '#e8e8ea', fontSize: '22px', fontWeight: 700 }}>{stat.value}</div>
            </div>
          ))}
        </div>

        <AIInsightCard title="AI Promotion Analysis">
          <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.7, margin: '0 0 12px' }}>
            {member.name} has a promotion score of <strong style={{ color: '#f59e0b' }}>{member.aiPromotionScore}/100</strong>.
          </p>
          <p style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
            {member.aiPromotionScore >= 80
              ? `✅ This member is likely ready for promotion. ${member.daysAtCurrentBelt} days at current belt with ${member.attendanceCount} total classes. Recommend belt evaluation at next class.`
              : member.aiPromotionScore >= 60
              ? `⚠️ Getting closer. Attendance is good but more mat time is needed. Recommend 20 more classes before evaluation.`
              : `📋 Not yet ready. Needs more consistent attendance. ${member.status === 'at-risk' ? 'Member is showing dropout risk — recommend outreach.' : 'Keep encouraging regular attendance.'}`}
          </p>
        </AIInsightCard>
      </div>

      {/* Belt Stripe Visualization */}
      <div
        style={{
          backgroundColor: '#131318',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', margin: '0 0 16px' }}>Belt & Stripes</h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              height: '32px',
              flex: 1,
              backgroundColor: beltColors[member.belt],
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {Array.from({ length: member.stripes }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  right: `${(i + 1) * 24 + i * 4}px`,
                  top: 0,
                  bottom: 0,
                  width: '16px',
                  backgroundColor: 'rgba(255,255,255,0.6)',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>
          <div style={{ color: '#9ca3af', fontSize: '13px', flexShrink: 0 }}>
            {member.stripes}/4 stripes
          </div>
        </div>
        <div style={{ marginTop: '8px', color: '#6b7280', fontSize: '12px' }}>
          {member.daysAtCurrentBelt} days at {member.belt} belt
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Classes */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', margin: '0 0 16px' }}>Recent Classes</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentClasses.map((cls, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: '#1c1c24',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div style={{ color: '#e8e8ea', fontSize: '13px', fontWeight: 600 }}>{cls.class}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px' }}>{cls.date} · {cls.time}</div>
                </div>
                <div style={{ color: '#9ca3af', fontSize: '12px' }}>{cls.duration}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Belt Promotion History */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', margin: '0 0 16px' }}>
            Promotion History
          </h2>
          <div style={{ position: 'relative', paddingLeft: '20px' }}>
            <div
              style={{
                position: 'absolute',
                left: '7px',
                top: '8px',
                bottom: '8px',
                width: '2px',
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
            />
            {promotionHistory.map((entry, i) => (
              <div key={i} style={{ position: 'relative', marginBottom: '20px' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '-13px',
                    top: '4px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: beltColors[entry.belt] || '#6b7280',
                    border: '2px solid #09090d',
                  }}
                />
                <div style={{ color: '#e8e8ea', fontSize: '13px', fontWeight: 600, textTransform: 'capitalize' }}>
                  {entry.belt} Belt
                </div>
                <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>{entry.date}</div>
                <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '3px' }}>{entry.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
