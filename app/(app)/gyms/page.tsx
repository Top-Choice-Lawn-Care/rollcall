'use client';

import { useState } from 'react';
import { getCurrentUser } from '@/lib/auth';

// Mock gym data — replace with Supabase query when live
const MOCK_GYMS = [
  {
    id: 'gym-gbdrip',
    name: 'Gracie Barra Dripping Springs',
    slug: 'gbdrip',
    city: 'Dripping Springs',
    state: 'TX',
    plan: 'growth',
    status: 'active',
    members: 142,
    monthlyRevenue: 14380,
    stripeConnected: false,
    onboarding: { profile: true, plan: true, class: true, admin: true, stripe: false, member: true, waiver: false },
    trialEndsAt: null,
    createdAt: '2024-11-15',
  },
  {
    id: 'gym-atxbjj',
    name: 'Austin BJJ Academy',
    slug: 'atxbjj',
    city: 'Austin',
    state: 'TX',
    plan: 'pro',
    status: 'active',
    members: 210,
    monthlyRevenue: 28900,
    stripeConnected: true,
    onboarding: { profile: true, plan: true, class: true, admin: true, stripe: true, member: true, waiver: true },
    trialEndsAt: null,
    createdAt: '2024-08-01',
  },
  {
    id: 'gym-roundrock',
    name: 'Round Rock BJJ',
    slug: 'rrbjj',
    city: 'Round Rock',
    state: 'TX',
    plan: 'starter',
    status: 'trial',
    members: 18,
    monthlyRevenue: 1600,
    stripeConnected: false,
    onboarding: { profile: true, plan: false, class: true, admin: true, stripe: false, member: false, waiver: false },
    trialEndsAt: '2026-03-15',
    createdAt: '2026-02-18',
  },
];

const PLAN_COLORS: Record<string, string> = {
  starter: '#6b7280',
  growth: '#3b82f6',
  pro: '#a855f7',
  enterprise: '#f59e0b',
};

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  trial: '#f59e0b',
  past_due: '#ef4444',
  canceled: '#6b7280',
};

type OnboardingStep = 'profile' | 'plan' | 'class' | 'admin' | 'stripe' | 'member' | 'waiver';
const ONBOARDING_STEPS: { key: OnboardingStep; label: string }[] = [
  { key: 'profile', label: 'Gym Profile' },
  { key: 'plan', label: 'Plans Created' },
  { key: 'class', label: 'Classes Set Up' },
  { key: 'admin', label: 'Admin Invited' },
  { key: 'stripe', label: 'Stripe Connected' },
  { key: 'member', label: 'First Member' },
  { key: 'waiver', label: 'Waiver Created' },
];

export default function GymsPage() {
  const user = getCurrentUser();
  const [showNewGym, setShowNewGym] = useState(false);
  const [newGym, setNewGym] = useState({ name: '', slug: '', city: '', state: '', adminEmail: '', plan: 'starter' });
  const [search, setSearch] = useState('');

  // Only super_admin can access this page
  if (!user || user.role !== 'super_admin') {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
        <p>Super Admin access required.</p>
      </div>
    );
  }

  const filtered = MOCK_GYMS.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalMRR = MOCK_GYMS.reduce((s, g) => s + (g.status === 'active' ? 99 : 0), 0); // platform fee
  const totalMembers = MOCK_GYMS.reduce((s, g) => s + g.members, 0);

  return (
    <div style={{ padding: '24px', backgroundColor: '#09090d', minHeight: '100vh', maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            🏛️ RollCall Super Admin
          </span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', margin: 0, letterSpacing: '-0.02em' }}>
          Gym Management
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Provision and manage all gyms on the RollCall platform
        </p>
      </div>

      {/* Platform stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Gyms', value: MOCK_GYMS.length, sub: `${MOCK_GYMS.filter(g => g.status === 'active').length} active` },
          { label: 'Total Members', value: totalMembers.toLocaleString(), sub: 'across all gyms' },
          { label: 'Platform MRR', value: `$${totalMRR.toLocaleString()}`, sub: 'subscription fees' },
          { label: 'Stripe Connected', value: `${MOCK_GYMS.filter(g => g.stripeConnected).length}/${MOCK_GYMS.length}`, sub: 'processing live' },
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: '#131318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '16px' }}>
            <div style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ color: '#e8e8ea', fontSize: '22px', fontWeight: 800 }}>{s.value}</div>
            <div style={{ color: '#4b5563', fontSize: '12px', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search gyms..."
          style={{ flex: 1, minWidth: '200px', padding: '10px 14px', backgroundColor: '#131318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e8e8ea', fontSize: '14px', outline: 'none' }}
        />
        <button
          onClick={() => setShowNewGym(true)}
          style={{ padding: '10px 18px', backgroundColor: '#f59e0b', color: '#000', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          + Provision New Gym
        </button>
      </div>

      {/* Gym list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((gym) => {
          const onboardingDone = Object.values(gym.onboarding).filter(Boolean).length;
          const onboardingTotal = ONBOARDING_STEPS.length;
          const onboardingPct = Math.round((onboardingDone / onboardingTotal) * 100);

          return (
            <div key={gym.id} style={{ backgroundColor: '#131318', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                {/* Left */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '16px' }}>{gym.name}</span>
                    <span style={{ fontSize: '11px', color: STATUS_COLORS[gym.status], backgroundColor: STATUS_COLORS[gym.status] + '18', border: `1px solid ${STATUS_COLORS[gym.status]}44`, borderRadius: '20px', padding: '2px 8px', fontWeight: 600, textTransform: 'capitalize' }}>
                      {gym.status}
                    </span>
                    <span style={{ fontSize: '11px', color: PLAN_COLORS[gym.plan], backgroundColor: PLAN_COLORS[gym.plan] + '18', border: `1px solid ${PLAN_COLORS[gym.plan]}44`, borderRadius: '20px', padding: '2px 8px', fontWeight: 600, textTransform: 'capitalize' }}>
                      {gym.plan}
                    </span>
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '13px' }}>
                    {gym.city}, {gym.state} · rollcall.app/{gym.slug} · {gym.members} members
                  </div>
                  {gym.trialEndsAt && (
                    <div style={{ color: '#f59e0b', fontSize: '12px', marginTop: '4px' }}>⚠️ Trial ends {gym.trialEndsAt}</div>
                  )}
                </div>

                {/* Right: stats */}
                <div style={{ display: 'flex', gap: '24px', flexShrink: 0 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '2px' }}>MEMBER MRR</div>
                    <div style={{ color: '#e8e8ea', fontWeight: 700 }}>${gym.monthlyRevenue.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '2px' }}>STRIPE</div>
                    <div style={{ color: gym.stripeConnected ? '#22c55e' : '#ef4444', fontWeight: 700, fontSize: '13px' }}>
                      {gym.stripeConnected ? '✓ Connected' : '✗ Not connected'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Onboarding progress */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Onboarding</span>
                  <span style={{ color: onboardingPct === 100 ? '#22c55e' : '#9ca3af', fontSize: '11px', fontWeight: 600 }}>{onboardingDone}/{onboardingTotal}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {ONBOARDING_STEPS.map((step) => {
                    const done = gym.onboarding[step.key];
                    return (
                      <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: done ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}`, borderRadius: '20px', padding: '3px 8px' }}>
                        <span style={{ fontSize: '10px' }}>{done ? '✓' : '○'}</span>
                        <span style={{ fontSize: '11px', color: done ? '#22c55e' : '#6b7280', fontWeight: 500 }}>{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                {['View Gym', 'Login as Admin', 'Send Invite', gym.stripeConnected ? 'Stripe Dashboard' : 'Connect Stripe'].map(action => (
                  <button key={action} style={{ padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', color: '#9ca3af', fontSize: '12px', cursor: 'pointer' }}>
                    {action}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Provision New Gym Modal */}
      {showNewGym && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}
          onClick={() => setShowNewGym(false)}>
          <div style={{ backgroundColor: '#1c1c24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '28px', maxWidth: '480px', width: '100%' }}
            onClick={e => e.stopPropagation()}>
            <h2 style={{ color: '#e8e8ea', fontWeight: 800, fontSize: '20px', margin: '0 0 20px 0' }}>Provision New Gym</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'Gym Name', key: 'name', placeholder: 'e.g. Gracie Barra Austin' },
                { label: 'URL Slug', key: 'slug', placeholder: 'e.g. gba (→ rollcall.app/gba)' },
                { label: 'City', key: 'city', placeholder: 'Austin' },
                { label: 'State', key: 'state', placeholder: 'TX' },
                { label: 'Admin Email', key: 'adminEmail', placeholder: 'owner@gym.com' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>{label}</label>
                  <input
                    value={newGym[key as keyof typeof newGym]}
                    onChange={e => setNewGym(g => ({ ...g, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: '100%', padding: '10px 12px', backgroundColor: '#131318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e8e8ea', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>Plan</label>
                <select value={newGym.plan} onChange={e => setNewGym(g => ({ ...g, plan: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', backgroundColor: '#131318', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e8e8ea', fontSize: '14px', outline: 'none' }}>
                  <option value="starter">Starter — $99/mo (up to 50 members)</option>
                  <option value="growth">Growth — $149/mo (up to 150 members)</option>
                  <option value="pro">Pro — $199/mo (up to 300 members)</option>
                  <option value="enterprise">Enterprise — Custom</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => setShowNewGym(false)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#9ca3af', fontWeight: 600, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => { alert('Gym provisioned! (mock — wire to Supabase to make live)'); setShowNewGym(false); }}
                style={{ flex: 2, padding: '12px', backgroundColor: '#f59e0b', color: '#000', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Provision Gym + Send Invite
              </button>
            </div>
            <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
              This will create the gym account and email the admin an invite link.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
