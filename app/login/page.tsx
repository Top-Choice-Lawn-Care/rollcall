'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = login(email, password);
      if (!user) {
        setError('Invalid credentials. Check the demo accounts below.');
        return;
      }
      router.replace(user.role === 'super_admin' ? '/gyms' : '/dashboard');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#09090d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🥋</div>
          <div
            style={{
              color: '#e8e8ea',
              fontWeight: 800,
              fontSize: '28px',
              letterSpacing: '-0.03em',
            }}
          >
            RollCall
          </div>
          <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>
            Austin BJJ Academy
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '32px',
          }}
        >
          <h2
            style={{
              color: '#e8e8ea',
              fontSize: '18px',
              fontWeight: 700,
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Sign In
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                style={{
                  backgroundColor: '#09090d',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#e8e8ea',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Any password works for demo"
                style={{
                  backgroundColor: '#09090d',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#e8e8ea',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              />
            </div>

            {error && (
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '13px',
                  backgroundColor: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#a37808' : '#f59e0b',
                color: '#09090d',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.15s',
                marginTop: '4px',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo credentials */}
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          <div
            style={{
              color: '#6b7280',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            Demo Accounts (any password)
          </div>
          {[
            { email: 'super@rollcall.app', role: '🏛️ RollCall Super Admin' },
            { email: 'admin@gbdrip.com', role: '⚙️ Gym Admin' },
            { email: 'instructor@gbdrip.com', role: '🥋 Instructor' },
            { email: 'student@gbdrip.com', role: '👤 Student' },
          ].map(({ email: demoEmail, role }) => (
            <button
              key={demoEmail}
              type="button"
              onClick={() => {
                setEmail(demoEmail);
                setPassword('demo');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '8px 10px',
                marginBottom: '6px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(245,158,11,0.06)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
            >
              <span style={{ color: '#9ca3af', fontSize: '12px', fontFamily: 'monospace' }}>{demoEmail}</span>
              <span
                style={{
                  color: '#f59e0b',
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: 'rgba(245,158,11,0.1)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                {role}
              </span>
            </button>
          ))}
          <div style={{ color: '#4b5563', fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
            Click any row to auto-fill credentials
          </div>
        </div>
      </div>
    </div>
  );
}
