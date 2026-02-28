'use client';

import { transactions, plans, revenueData } from '@/lib/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const statusColors: Record<string, string> = {
  paid: '#22c55e',
  failed: '#dc2626',
  pending: '#f59e0b',
};

export default function BillingPage() {
  const totalRevenue = plans.reduce((acc, p) => acc + p.price * p.members, 0);
  const totalMembers = plans.reduce((acc, p) => acc + p.members, 0);

  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh' }}>
      {/* Stripe Banner */}
      <div
        style={{
          backgroundColor: 'rgba(34,197,94,0.08)',
          border: '1px solid rgba(34,197,94,0.25)',
          borderRadius: '10px',
          padding: '12px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '18px' }}>✅</span>
        <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '14px' }}>Stripe-Native</span>
        <span style={{ color: '#9ca3af', fontSize: '14px' }}>
          2.7% flat processing — no markup, no lock-in. Payouts in 2 business days.
        </span>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
          Billing
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          {totalMembers} paying members · ${totalRevenue.toLocaleString()} monthly recurring
        </p>
      </div>

      {/* Plan Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.name}
            style={{
              backgroundColor: '#131318',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {plan.name}
            </div>
            <div style={{ color: '#e8e8ea', fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>
              ${plan.price}
              <span style={{ fontSize: '13px', fontWeight: 400, color: '#6b7280' }}>/mo</span>
            </div>
            <div style={{ color: '#9ca3af', fontSize: '13px' }}>{plan.members} members</div>
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color: '#f59e0b', fontSize: '14px', fontWeight: 700 }}>
                ${(plan.price * plan.members).toLocaleString()}/mo
              </div>
              <div style={{ color: '#6b7280', fontSize: '11px' }}>monthly recurring</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Revenue Chart */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', margin: '0 0 20px' }}>
            Revenue Trend
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                formatter={(v: number | undefined) => [`$${(v ?? 0).toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#22c55e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', margin: 0 }}>This Month</h2>
          {[
            { label: 'Gross Revenue', value: '$14,828', color: '#22c55e' },
            { label: 'Processing Fees (2.7%)', value: '-$400', color: '#dc2626' },
            { label: 'Net Revenue', value: '$14,380', color: '#e8e8ea' },
            { label: 'Failed Payments', value: '2 ($198)', color: '#f59e0b' },
            { label: 'Avg Revenue / Member', value: '$101.27', color: '#9ca3af' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>{stat.label}</span>
              <span style={{ color: stat.color, fontSize: '14px', fontWeight: 700 }}>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div
        style={{
          backgroundColor: '#131318',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px', margin: 0 }}>Recent Transactions</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1c1c24' }}>
              {['Member', 'Plan', 'Amount', 'Date', 'Status'].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: 'left',
                    padding: '10px 16px',
                    color: '#6b7280',
                    fontSize: '11px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '14px 16px', color: '#e8e8ea', fontWeight: 600, fontSize: '14px' }}>
                  {txn.memberName}
                </td>
                <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '13px' }}>{txn.plan}</td>
                <td style={{ padding: '14px 16px', color: '#e8e8ea', fontSize: '14px', fontWeight: 700 }}>
                  ${txn.amount}
                </td>
                <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '13px' }}>{txn.date}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: statusColors[txn.status] + '22',
                      color: statusColors[txn.status],
                      textTransform: 'capitalize',
                    }}
                  >
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
