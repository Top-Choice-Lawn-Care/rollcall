import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#09090d',
        gap: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ fontSize: '64px', fontWeight: 800, color: '#1c1c24', letterSpacing: '-0.04em' }}>
        404
      </div>
      <h2 style={{ color: '#e8e8ea', fontSize: '20px', fontWeight: 700, margin: 0 }}>
        Page not found
      </h2>
      <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
        That page doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/dashboard"
        style={{
          padding: '10px 20px',
          backgroundColor: '#f59e0b',
          color: '#09090d',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '14px',
          marginTop: '8px',
        }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
