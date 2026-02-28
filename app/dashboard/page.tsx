'use client';

import { revenueData, stats, classTypes, recentActivity } from '@/lib/mockData';
import AIInsightCard from '@/components/ui/AIInsightCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const statCards = [
  { label: 'Active Members', value: stats.activeMembers, format: (v: number) => v.toString(), color: '#3b82f6', icon: '👥' },
  { label: 'Monthly Revenue', value: stats.monthlyRevenue, format: (v: number) => `$${v.toLocaleString()}`, color: '#22c55e', icon: '💰' },
  { label: 'Classes This Week', value: stats.classesThisWeek, format: (v: number) => v.toString(), color: '#a855f7', icon: '🗓️' },
  { label: 'At-Risk Members', value: stats.atRiskMembers, format: (v: number) => v.toString(), color: '#f59e0b', icon: '⚠️' },
];

const todayClasses = [
  { name: 'Kids BJJ', time: '4:00 PM', instructor: 'Sarah Kim', enrolled: 8, capacity: 12, color: '#f59e0b' },
  { name: 'Fundamentals', time: '7:00 PM', instructor: 'Marcus Bell', enrolled: 16, capacity: 20, color: '#3b82f6' },
];

export default function Dashboard() {
  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '14px' }}>
          Monday, February 28, 2026 · Austin BJJ Academy
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              backgroundColor: '#131318',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span>{card.icon}</span>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>{card.label}</span>
            </div>
            <div style={{ color: card.color, fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em' }}>
              {card.format(card.value)}
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <AIInsightCard className="mb-6" style={{ marginBottom: '24px' }}>
        <p style={{ color: '#e8e8ea', lineHeight: 1.7, fontSize: '14px', margin: 0 }}>
          <strong style={{ color: '#f59e0b' }}>3 members are likely promotion-ready.</strong> 5 members show dropout
          risk. This month&apos;s retention: <strong>94%</strong> (+2% vs last month).
          <br />
          <span style={{ color: '#9ca3af' }}>
            Recommended action: Send check-in message to{' '}
            <strong style={{ color: '#e8e8ea' }}>Carlos Mendez, Mike Johnson, Sarah Kim</strong>.
          </span>
        </p>
      </AIInsightCard>

      {/* Charts + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', marginBottom: '20px', margin: '0 0 20px' }}>
            Revenue (Last 6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e8e8ea' }}
                formatter={(v: number | undefined) => [`$${(v ?? 0).toLocaleString()}`, 'Revenue']}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', margin: '0 0 16px' }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentActivity.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>{item.icon}</span>
                <div>
                  <div style={{ color: '#e8e8ea', fontSize: '13px', lineHeight: 1.4 }}>{item.text}</div>
                  <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px' }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Classes */}
      <div
        style={{
          backgroundColor: '#131318',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', margin: '0 0 16px' }}>Today&apos;s Classes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {todayClasses.map((cls) => (
            <div
              key={cls.name}
              style={{
                backgroundColor: '#1c1c24',
                border: `1px solid ${cls.color}44`,
                borderLeft: `4px solid ${cls.color}`,
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div style={{ fontWeight: 700, color: '#e8e8ea', marginBottom: '6px' }}>{cls.name}</div>
              <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '4px' }}>
                {cls.time} · {cls.instructor}
              </div>
              <div style={{ color: '#6b7280', fontSize: '12px' }}>
                {cls.enrolled}/{cls.capacity} enrolled
              </div>
              <div
                style={{
                  marginTop: '10px',
                  height: '4px',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${(cls.enrolled / cls.capacity) * 100}%`,
                    backgroundColor: cls.color,
                    borderRadius: '2px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
