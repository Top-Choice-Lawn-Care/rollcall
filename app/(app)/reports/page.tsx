'use client';

import { useState } from 'react';
import { attendanceByClass, newMembersByMonth, retentionTrend, revenueByPlan } from '@/lib/mockData';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Search } from 'lucide-react';

const PIE_COLORS = ['#3b82f6', '#a855f7', '#6b7280', '#f59e0b', '#dc2626'];

const mockResponses: Record<string, string> = {
  default: "Showing members who haven't checked in within the last 14 days: Mike Johnson (Blue, last seen Feb 14), James Park (Blue, last seen Feb 10), Tyler Grant (White, last seen Feb 5). These 3 members are flagged as at-risk. Recommend sending a check-in message.",
  attendance: "Attendance trends show a 12% increase in Advanced classes over the last 6 weeks. Fundamentals remains the most attended at 38 avg/week. Open Mat attendance dips in cold weather months (Nov–Feb).",
  revenue: "Revenue has grown 41% over the last 6 months ($10,200 → $14,380). The BJJ Program plan drives the most revenue at $9,536/month. Recommend upselling Fundamentals members to BJJ Program.",
  retention: "Retention rate is 94% this month — up from 88% in September. The biggest retention gains came from the automated 14-day absence message campaign, which re-engaged 9 at-risk members.",
};

export default function ReportsPage() {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuery = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const lower = query.toLowerCase();
      if (lower.includes('attendance')) setAiResponse(mockResponses.attendance);
      else if (lower.includes('revenue') || lower.includes('money')) setAiResponse(mockResponses.revenue);
      else if (lower.includes('retention')) setAiResponse(mockResponses.retention);
      else setAiResponse(mockResponses.default);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
          Reports
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          AI-powered analytics for Austin BJJ Academy
        </p>
      </div>

      {/* AI Query Box */}
      <div
        style={{
          backgroundColor: '#131318',
          border: '1px solid #f59e0b',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: '0 0 20px rgba(245,158,11,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <span style={{ fontSize: '18px' }}>✨</span>
          <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Ask AI Anything
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: '240px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
              }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
              placeholder="Who hasn't been in 2 weeks? Show me attendance trends..."
              style={{
                width: '100%',
                backgroundColor: '#1c1c24',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px 14px 12px 40px',
                color: '#e8e8ea',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            onClick={handleQuery}
            style={{
              backgroundColor: '#f59e0b',
              color: '#09090d',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Thinking...' : '✨ Ask AI'}
          </button>
        </div>

        {aiResponse && !loading && (
          <div
            style={{
              marginTop: '16px',
              padding: '16px',
              backgroundColor: '#1c1c24',
              borderRadius: '8px',
              borderLeft: '3px solid #f59e0b',
              color: '#e8e8ea',
              fontSize: '14px',
              lineHeight: 1.7,
            }}
          >
            {aiResponse}
          </div>
        )}

        {/* Suggestion chips */}
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {["Who hasn't been in 2 weeks?", 'Show me attendance trends', 'Revenue breakdown', 'Retention rate'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
              }}
              style={{
                backgroundColor: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '999px',
                padding: '4px 12px',
                color: '#f59e0b',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Attendance by class type - Pie */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '14px', margin: '0 0 16px' }}>
            Attendance by Class Type
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={attendanceByClass} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {attendanceByClass.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* New Members by Month - Bar */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '14px', margin: '0 0 16px' }}>
            New Members by Month
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={newMembersByMonth} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Plan - Bar */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '14px', margin: '0 0 16px' }}>
            Revenue by Plan
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByPlan} barSize={28} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v.toLocaleString()}`} />
              <YAxis type="category" dataKey="plan" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                formatter={(v: number | undefined) => [`$${(v ?? 0).toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#a855f7" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Retention Rate Trend - Line */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '14px', margin: '0 0 16px' }}>
            Retention Rate Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={retentionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[85, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                formatter={(v: number | undefined) => [`${v ?? 0}%`, 'Retention']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
