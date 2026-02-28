'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
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
      <div style={{ fontSize: '48px' }}>⚠️</div>
      <h2 style={{ color: '#e8e8ea', fontSize: '20px', fontWeight: 700, margin: 0 }}>
        Something went wrong
      </h2>
      <p
        style={{
          color: '#6b7280',
          fontSize: '14px',
          maxWidth: '400px',
          textAlign: 'center',
          margin: 0,
        }}
      >
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        style={{
          padding: '10px 20px',
          backgroundColor: '#f59e0b',
          color: '#000',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
