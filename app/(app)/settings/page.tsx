'use client';

import { useState } from 'react';
import { CheckCircle, Plus } from 'lucide-react';

const beltLevels = [
  { belt: 'White', color: '#e5e7eb', min: 0, max: 4, textColor: '#111827' },
  { belt: 'Blue', color: '#3b82f6', min: 0, max: 4, textColor: '#fff' },
  { belt: 'Purple', color: '#a855f7', min: 0, max: 4, textColor: '#fff' },
  { belt: 'Brown', color: '#d97706', min: 0, max: 4, textColor: '#fff' },
  { belt: 'Black', color: '#374151', min: 0, max: 9, textColor: '#fff' },
];

const staff = [
  { name: 'Marcus Bell', role: 'Head Instructor', belt: 'Black', access: 'Admin' },
  { name: 'David Torres', role: 'Instructor', belt: 'Brown', access: 'Instructor' },
  { name: 'Sarah Kim', role: 'Kids Instructor', belt: 'Purple', access: 'Instructor' },
  { name: 'Jennifer Hayes', role: 'Front Desk', belt: '—', access: 'Staff' },
];

const integrations = [
  { name: 'Stripe', desc: 'Payment processing', status: 'connected', icon: '💳' },
  { name: 'Email (SendGrid)', desc: 'Transactional email', status: 'connected', icon: '📧' },
  { name: 'SMS (Twilio)', desc: 'Text message alerts', status: 'disconnected', icon: '📱' },
  { name: 'Google Calendar', desc: 'Class schedule sync', status: 'disconnected', icon: '📅' },
  { name: 'Zapier', desc: 'Workflow automation', status: 'disconnected', icon: '⚡' },
  { name: 'Mailchimp', desc: 'Email marketing', status: 'disconnected', icon: '🐒' },
];

const membershipPlans = [
  { name: 'Fundamentals', price: 99, desc: '3x/week, fundamentals only' },
  { name: 'BJJ Program', price: 149, desc: 'All regular classes, unlimited' },
  { name: 'Unlimited', price: 199, desc: 'Everything, including competition prep' },
  { name: 'Kids BJJ', price: 89, desc: 'Kids classes only (ages 5-14)' },
];

export default function SettingsPage() {
  const [gymName, setGymName] = useState('Austin BJJ Academy');
  const [email, setEmail] = useState('info@austinbjj.com');
  const [phone, setPhone] = useState('512-555-0100');
  const [address, setAddress] = useState('1234 South Congress Ave, Austin TX 78704');

  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh', maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
          Settings
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Manage your gym configuration, plans, and integrations
        </p>
      </div>

      {/* Gym Info */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ color: '#e8e8ea', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Gym Info</h2>
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
          }}
        >
          {[
            { label: 'Gym Name', value: gymName, setter: setGymName },
            { label: 'Email', value: email, setter: setEmail },
            { label: 'Phone', value: phone, setter: setPhone },
            { label: 'Address', value: address, setter: setAddress },
          ].map((field) => (
            <div key={field.label}>
              <label style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                {field.label}
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#1c1c24',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#e8e8ea',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
          <div style={{ gridColumn: '1 / -1' }}>
            <button
              style={{
                backgroundColor: '#f59e0b',
                color: '#09090d',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </section>

      {/* Belt System */}
      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ color: '#e8e8ea', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Belt System</h2>
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px', margin: '0 0 20px' }}>
            BJJ belt progression configured for standard IBJJF guidelines.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {beltLevels.map((b) => (
              <div key={b.belt} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '100px',
                    height: '28px',
                    backgroundColor: b.color,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '10px',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: b.textColor,
                    flexShrink: 0,
                  }}
                >
                  {b.belt}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '13px' }}>
                  {b.min}–{b.max} stripes · {b.belt === 'Black' ? 'Degrees (not stripes)' : 'Standard stripe progression'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#e8e8ea', fontSize: '16px', fontWeight: 700, margin: 0 }}>Membership Plans</h2>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '6px 14px',
              color: '#9ca3af',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Add Plan
          </button>
        </div>
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {membershipPlans.map((plan, i) => (
            <div
              key={plan.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: i < membershipPlans.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                gap: '16px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '14px' }}>{plan.name}</div>
                <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{plan.desc}</div>
              </div>
              <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '18px' }}>${plan.price}<span style={{ fontSize: '12px', fontWeight: 400, color: '#6b7280' }}>/mo</span></div>
              <button style={{ color: '#6b7280', background: 'none', border: 'none', fontSize: '13px', cursor: 'pointer' }}>Edit</button>
            </div>
          ))}
        </div>
      </section>

      {/* Staff */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#e8e8ea', fontSize: '16px', fontWeight: 700, margin: 0 }}>Staff</h2>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '6px 14px',
              color: '#9ca3af',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} /> Add Staff
          </button>
        </div>
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1c1c24' }}>
                {['Name', 'Role', 'Belt', 'Access'].map((col) => (
                  <th key={col} style={{ textAlign: 'left', padding: '10px 16px', color: '#6b7280', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((s) => (
                <tr key={s.name} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '14px 16px', color: '#e8e8ea', fontWeight: 600, fontSize: '14px' }}>{s.name}</td>
                  <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '13px' }}>{s.role}</td>
                  <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '13px' }}>{s.belt}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: s.access === 'Admin' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.06)',
                      color: s.access === 'Admin' ? '#f59e0b' : '#9ca3af',
                    }}>
                      {s.access}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Integrations */}
      <section>
        <h2 style={{ color: '#e8e8ea', fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Integrations</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {integrations.map((int) => (
            <div
              key={int.name}
              style={{
                backgroundColor: '#131318',
                border: `1px solid ${int.status === 'connected' ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '24px' }}>{int.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '14px' }}>{int.name}</div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>{int.desc}</div>
              </div>
              {int.status === 'connected' ? (
                <CheckCircle size={18} color="#22c55e" />
              ) : (
                <button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    color: '#9ca3af',
                    fontSize: '12px',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Plus size={12} /> Add
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
