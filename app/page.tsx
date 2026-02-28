import Link from 'next/link';

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#09090d',
        color: '#e8e8ea',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🥋</span>
          <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.03em' }}>RollCall</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
            Sign In
          </Link>
          <Link
            href="/dashboard"
            style={{
              backgroundColor: '#f59e0b',
              color: '#09090d',
              padding: '8px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            Start Free Trial
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '100px 40px 60px' }}>
        <div
          style={{
            display: 'inline-block',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '999px',
            padding: '4px 16px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#f59e0b',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          ✨ AI-Powered Gym Management
        </div>
        <h1
          style={{
            fontSize: 'clamp(36px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            maxWidth: '800px',
            margin: '0 auto 20px',
          }}
        >
          The gym management platform built for BJJ.{' '}
          <span style={{ color: '#f59e0b' }}>Finally.</span>
        </h1>
        <p
          style={{
            color: '#9ca3af',
            fontSize: '20px',
            maxWidth: '560px',
            margin: '0 auto 40px',
            lineHeight: 1.6,
          }}
        >
          AI-powered promotion tracking, Stripe-native billing at 2.7% flat, and belt management built by someone who
          actually rolls.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/dashboard"
            style={{
              backgroundColor: '#f59e0b',
              color: '#09090d',
              padding: '14px 32px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '16px',
            }}
          >
            Start Free Trial →
          </Link>
          <Link
            href="/dashboard"
            style={{
              backgroundColor: '#1c1c24',
              color: '#e8e8ea',
              padding: '14px 32px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '16px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            View Demo
          </Link>
        </div>
      </section>

      {/* Dashboard Screenshot Mockup */}
      <section style={{ padding: '0 40px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          }}
        >
          {/* Fake browser bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              padding: '8px 12px',
              backgroundColor: '#09090d',
              borderRadius: '8px',
            }}
          >
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#dc2626' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <div
              style={{
                flex: 1,
                backgroundColor: '#1c1c24',
                borderRadius: '4px',
                padding: '4px 12px',
                fontSize: '12px',
                color: '#6b7280',
              }}
            >
              app.rollcall.io/dashboard
            </div>
          </div>

          {/* Dashboard preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              { label: 'Active Members', value: '142', color: '#3b82f6' },
              { label: 'Monthly Revenue', value: '$14,380', color: '#22c55e' },
              { label: 'Classes This Week', value: '23', color: '#a855f7' },
              { label: 'At-Risk Members', value: '7', color: '#f59e0b' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: '#1c1c24',
                  borderRadius: '10px',
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div style={{ color: '#6b7280', fontSize: '11px', marginBottom: '8px' }}>{stat.label}</div>
                <div style={{ color: stat.color, fontSize: '22px', fontWeight: 700 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              backgroundColor: '#1c1c24',
              borderRadius: '10px',
              padding: '16px',
              border: '1px solid #f59e0b',
              boxShadow: '0 0 15px rgba(245,158,11,0.05)',
            }}
          >
            <div style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
              ✨ AI INSIGHTS
            </div>
            <div style={{ color: '#9ca3af', fontSize: '13px' }}>
              3 members are likely promotion-ready. 5 members show dropout risk. This month&apos;s retention: 94% (+2%
              vs last month).
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section style={{ padding: '40px 40px 80px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            {
              icon: '✨',
              title: 'AI-Powered Promotion Engine',
              desc: 'Our AI analyzes attendance patterns, training frequency, and mat time to surface exactly who is ready to level up — before you have to guess.',
              color: '#f59e0b',
            },
            {
              icon: '💳',
              title: 'Stripe-Native Billing (2.7% flat)',
              desc: "No markup. No lock-in. We pass Stripe's rate directly to you. Automated recurring billing, failed payment recovery, and instant payouts.",
              color: '#22c55e',
            },
            {
              icon: '🥋',
              title: 'Built by a BJJ Gym Owner',
              desc: "Not a generic SaaS slapped with a gi patch. Every feature was designed by someone who's run a BJJ academy and knows what actually matters.",
              color: '#a855f7',
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                backgroundColor: '#131318',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '28px',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{card.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '10px', color: card.color }}>
                {card.title}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: 1.7 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: 'center',
          padding: '60px 40px 100px',
          backgroundColor: '#131318',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Ready to roll?
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '32px', fontSize: '16px' }}>
          30-day free trial. No credit card required. Set up in under 10 minutes.
        </p>
        <Link
          href="/dashboard"
          style={{
            backgroundColor: '#f59e0b',
            color: '#09090d',
            padding: '16px 40px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '18px',
          }}
        >
          Start Free Trial →
        </Link>
      </section>
    </div>
  );
}
