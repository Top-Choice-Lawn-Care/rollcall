'use client';

import { useState, useEffect } from 'react';
import { members } from '@/lib/mockData';
import BeltBadge from '@/components/ui/BeltBadge';
import { Search, CheckCircle } from 'lucide-react';

export default function CheckInPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof members>([]);
  const [checkedIn, setCheckedIn] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = members.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()));
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleCheckIn = (memberId: string) => {
    setCheckedIn(memberId);
    setConfirming(true);
    setQuery('');
    setResults([]);
    setTimeout(() => {
      setConfirming(false);
      setCheckedIn(null);
    }, 3000);
  };

  const confirmedMember = checkedIn ? members.find((m) => m.id === checkedIn) : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#09090d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '60px 24px',
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '8px' }}>🥋</div>
        <div style={{ color: '#e8e8ea', fontWeight: 800, fontSize: '28px', letterSpacing: '-0.02em' }}>
          Austin BJJ Academy
        </div>
        <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Member Check-In Kiosk</div>
      </div>

      {/* Main Check-In Area */}
      {!confirming ? (
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <h1
            style={{
              textAlign: 'center',
              fontSize: '48px',
              fontWeight: 800,
              color: '#e8e8ea',
              letterSpacing: '-0.03em',
              marginBottom: '32px',
            }}
          >
            Check In
          </h1>

          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280',
              }}
            />
            <input
              type="text"
              placeholder="Type your name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                backgroundColor: '#131318',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '14px',
                padding: '18px 18px 18px 52px',
                color: '#e8e8ea',
                fontSize: '20px',
                outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 0 0 2px rgba(245,158,11,0.1)',
              }}
            />
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div
              style={{
                backgroundColor: '#131318',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {results.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleCheckIn(member.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '100%',
                    padding: '18px 20px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor:
                        member.belt === 'blue'
                          ? '#3b82f6'
                          : member.belt === 'purple'
                          ? '#a855f7'
                          : member.belt === 'brown'
                          ? '#d97706'
                          : member.belt === 'black'
                          ? '#374151'
                          : '#e5e7eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '18px',
                      color: member.belt === 'white' ? '#09090d' : '#ffffff',
                      flexShrink: 0,
                    }}
                  >
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#e8e8ea', fontSize: '18px', fontWeight: 700 }}>{member.name}</div>
                    <div style={{ marginTop: '4px' }}>
                      <BeltBadge belt={member.belt} stripes={member.stripes} size="sm" />
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: '#22c55e',
                      color: '#fff',
                      padding: '8px 20px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '14px',
                    }}
                  >
                    Check In
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px', fontSize: '16px' }}>
              No members found for &quot;{query}&quot;
            </div>
          )}

          {query.length === 0 && (
            <div style={{ textAlign: 'center', color: '#4b5563', padding: '24px', fontSize: '14px' }}>
              Type at least 2 characters to search
            </div>
          )}
        </div>
      ) : (
        /* Confirmation */
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 28px',
              border: '3px solid #22c55e',
            }}
          >
            <CheckCircle size={60} color="#22c55e" />
          </div>
          <h1 style={{ fontSize: '40px', fontWeight: 800, color: '#22c55e', marginBottom: '8px' }}>Checked In!</h1>
          {confirmedMember && (
            <>
              <div style={{ color: '#e8e8ea', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
                {confirmedMember.name}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <BeltBadge belt={confirmedMember.belt} stripes={confirmedMember.stripes} size="lg" />
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                Class #{confirmedMember.attendanceCount + 1} · Welcome to the mat!
              </div>
            </>
          )}
          <div style={{ color: '#4b5563', fontSize: '13px', marginTop: '32px' }}>Resetting in 3 seconds...</div>
        </div>
      )}
    </div>
  );
}
