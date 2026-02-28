'use client';

import { useState, useEffect, useCallback } from 'react';
import { members, classTypes } from '@/lib/mockData';
import BeltBadge from '@/components/ui/BeltBadge';
import RoleSwitcher from '@/components/ui/RoleSwitcher';
import { Search, CheckCircle, X } from 'lucide-react';
import { useRole } from '@/lib/useRole';
import { useCurrentUser } from '@/lib/useCurrentUser';
import {
  getClassRegistrations,
  getClassCheckins,
  checkInMember,
  isCheckedIn,
} from '@/lib/registrations';

// Get current day of week, default to Monday for demo
function getCurrentDay(): string {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  const day = dayNames[today];
  // If Sunday (no classes typically), fall back to Monday for demo
  if (!classTypes.some((c) => c.days.includes(day))) return 'Monday';
  return day;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// --- Student View ---
function StudentView({ studentName, regTick, onRefresh }: { studentName: string; regTick: number; onRefresh: () => void }) {
  // Find all class instances where this student is registered
  const upcomingClasses: Array<{ cls: typeof classTypes[0]; day: string; classKey: string }> = [];
  for (const cls of classTypes) {
    for (const day of cls.days) {
      const classKey = `${cls.id}_${day}`;
      const regs = getClassRegistrations(classKey);
      if (regs.includes(studentName)) {
        upcomingClasses.push({ cls, day, classKey });
      }
    }
  }
  // Sort by day order then time
  upcomingClasses.sort((a, b) => {
    const dayDiff = WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day);
    if (dayDiff !== 0) return dayDiff;
    return a.cls.time.localeCompare(b.cls.time);
  });

  // Unused regTick — triggers re-render
  void regTick;

  return (
    <div style={{ width: '100%', maxWidth: '560px' }}>
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <div style={{ color: '#e8e8ea', fontWeight: 800, fontSize: '24px', letterSpacing: '-0.02em' }}>
          My Schedule
        </div>
        <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Upcoming classes this week for <span style={{ color: '#d4a843' }}>{studentName}</span>
        </div>
      </div>

      {upcomingClasses.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '40px 24px',
          backgroundColor: '#131318',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          color: '#4b5563', fontSize: '14px',
        }}>
          No classes registered this week.<br />
          <span style={{ fontSize: '12px', color: '#374151', marginTop: '4px', display: 'block' }}>
            Go to Schedule to register for classes.
          </span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {upcomingClasses.map(({ cls, day, classKey }) => {
            const checkedIn = isCheckedIn(classKey, studentName);
            return (
              <div key={classKey} style={{
                backgroundColor: '#131318',
                border: `1px solid ${checkedIn ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderLeft: `4px solid ${checkedIn ? '#22c55e' : cls.color}`,
                borderRadius: '10px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: cls.color, fontSize: '12px', fontWeight: 700, marginBottom: '2px' }}>
                    {day} · {cls.time}
                  </div>
                  <div style={{ color: '#e8e8ea', fontSize: '15px', fontWeight: 700 }}>{cls.name}</div>
                  <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>
                    {cls.instructor} · {cls.duration} min
                    {cls.style && cls.style !== 'both' ? ` · ${cls.style === 'nogi' ? 'NoGi' : 'Gi'}` : ''}
                  </div>
                </div>
                {checkedIn ? (
                  <span style={{
                    padding: '5px 12px', borderRadius: '999px',
                    backgroundColor: 'rgba(34,197,94,0.15)',
                    border: '1px solid rgba(34,197,94,0.4)',
                    color: '#22c55e', fontSize: '12px', fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>
                    ✓ Checked In
                  </span>
                ) : (
                  <span style={{
                    padding: '5px 12px', borderRadius: '999px',
                    backgroundColor: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.35)',
                    color: '#f59e0b', fontSize: '12px', fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>
                    📋 Registered
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Roster Modal ---
function RosterModal({
  cls,
  day,
  regTick,
  onCheckIn,
  onClose,
}: {
  cls: typeof classTypes[0];
  day: string;
  regTick: number;
  onCheckIn: (classKey: string, name: string) => void;
  onClose: () => void;
}) {
  const classKey = `${cls.id}_${day}`;
  const registrations = getClassRegistrations(classKey);
  const checkins = getClassCheckins(classKey);

  void regTick;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 200, padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1c1c24',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '14px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ color: cls.color, fontSize: '12px', fontWeight: 700 }}>{day} · {cls.time}</div>
            <h3 style={{ color: '#e8e8ea', fontWeight: 800, fontSize: '18px', margin: '2px 0 0' }}>{cls.name}</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '14px' }}>
          {registrations.length} registered · {checkins.length} checked in · {cls.maxCapacity} max
        </div>

        {registrations.length === 0 ? (
          <div style={{ color: '#4b5563', fontSize: '13px', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
            No one registered yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {registrations.map((name) => {
              const isIn = checkins.includes(name);
              return (
                <div key={name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: '8px',
                  backgroundColor: isIn ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isIn ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                  <span style={{ color: '#e8e8ea', fontSize: '14px', fontWeight: 500 }}>{name}</span>
                  {isIn ? (
                    <span style={{
                      padding: '3px 10px', borderRadius: '999px',
                      backgroundColor: 'rgba(34,197,94,0.15)',
                      border: '1px solid rgba(34,197,94,0.4)',
                      color: '#22c55e', fontSize: '11px', fontWeight: 700,
                    }}>
                      ✓ Present
                    </span>
                  ) : (
                    <button
                      onClick={() => onCheckIn(classKey, name)}
                      style={{
                        padding: '5px 12px', borderRadius: '6px',
                        backgroundColor: 'rgba(34,197,94,0.1)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        color: '#22c55e', fontSize: '12px', fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ✓ Check In
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Instructor / Admin View ---
function InstructorAdminView({
  regTick,
  onRefresh,
}: {
  regTick: number;
  onRefresh: () => void;
}) {
  const today = getCurrentDay();
  const todayClasses = classTypes.filter((c) => c.days.includes(today));

  const [rosterClass, setRosterClass] = useState<typeof classTypes[0] | null>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof members>([]);
  const [checkedIn, setCheckedIn] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  // For walk-in kiosk: which class to add them to
  const [selectedKioskClass, setSelectedKioskClass] = useState<string>(
    todayClasses[0] ? `${todayClasses[0].id}_${today}` : ''
  );

  useEffect(() => {
    if (query.length >= 2) {
      setResults(members.filter((m) => m.name.toLowerCase().includes(query.toLowerCase())));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleKioskCheckIn = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    if (selectedKioskClass) {
      checkInMember(selectedKioskClass, member.name);
      onRefresh();
    }
    setCheckedIn(memberId);
    setConfirming(true);
    setQuery('');
    setResults([]);
    setTimeout(() => {
      setConfirming(false);
      setCheckedIn(null);
    }, 3000);
  };

  const handleRosterCheckIn = (classKey: string, name: string) => {
    checkInMember(classKey, name);
    onRefresh();
  };

  const confirmedMember = checkedIn ? members.find((m) => m.id === checkedIn) : null;

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      {/* Today's Classes */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Today&apos;s Classes — {today}
        </div>
        {todayClasses.length === 0 ? (
          <div style={{ color: '#4b5563', fontSize: '13px' }}>No classes today</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {todayClasses.map((cls) => {
              const classKey = `${cls.id}_${today}`;
              const enrolled = getClassRegistrations(classKey).length;
              const checkins = getClassCheckins(classKey).length;
              void regTick;
              return (
                <button
                  key={cls.id}
                  onClick={() => setRosterClass(cls)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    gap: '14px',
                    padding: '12px 16px',
                    backgroundColor: '#131318',
                    border: `1px solid rgba(255,255,255,0.08)`,
                    borderLeft: `4px solid ${cls.color}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#e8e8ea', fontSize: '14px', fontWeight: 700 }}>{cls.name}</div>
                    <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>
                      {cls.time} · {cls.instructor}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#e8e8ea', fontSize: '13px', fontWeight: 700 }}>{enrolled}/{cls.maxCapacity}</div>
                    <div style={{ color: '#22c55e', fontSize: '11px' }}>{checkins} in</div>
                  </div>
                  <div style={{ color: '#4b5563', fontSize: '12px' }}>→</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: '28px' }} />

      {/* Kiosk Check-In */}
      {!confirming ? (
        <div>
          <div style={{ marginBottom: '16px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
              Walk-In Check-In
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>Search for a member to check in</p>
          </div>

          {/* Class selector */}
          {todayClasses.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ color: '#9ca3af', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Adding to class:
              </label>
              <select
                value={selectedKioskClass}
                onChange={(e) => setSelectedKioskClass(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  backgroundColor: '#131318',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  color: '#e8e8ea', fontSize: '14px', outline: 'none',
                }}
              >
                {todayClasses.map((cls) => (
                  <option key={cls.id} value={`${cls.id}_${today}`}>
                    {cls.time} — {cls.name}
                  </option>
                ))}
                <option value="">Walk-in (no class)</option>
              </select>
            </div>
          )}

          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            <input
              type="text"
              placeholder="Type member name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#131318',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                padding: '16px 16px 16px 48px',
                color: '#e8e8ea', fontSize: '18px', outline: 'none',
                boxSizing: 'border-box',
                boxShadow: '0 0 0 2px rgba(245,158,11,0.1)',
              }}
            />
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div style={{
              backgroundColor: '#131318',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', overflow: 'hidden',
            }}>
              {results.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleKioskCheckIn(member.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    width: '100%', padding: '16px 20px',
                    backgroundColor: 'transparent', border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    backgroundColor: member.belt === 'blue' ? '#3b82f6' : member.belt === 'purple' ? '#a855f7' : member.belt === 'brown' ? '#d97706' : member.belt === 'black' ? '#374151' : '#e5e7eb',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '16px',
                    color: member.belt === 'white' ? '#09090d' : '#ffffff', flexShrink: 0,
                  }}>
                    {member.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#e8e8ea', fontSize: '16px', fontWeight: 700 }}>{member.name}</div>
                    <div style={{ marginTop: '3px' }}>
                      <BeltBadge belt={member.belt} stripes={member.stripes} size="sm" />
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#22c55e', color: '#fff',
                    padding: '7px 16px', borderRadius: '8px',
                    fontWeight: 700, fontSize: '13px',
                  }}>
                    Check In
                  </div>
                </button>
              ))}
            </div>
          )}

          {query.length >= 2 && results.length === 0 && (
            <div style={{ textAlign: 'center', color: '#6b7280', padding: '24px', fontSize: '15px' }}>
              No members found for &quot;{query}&quot;
            </div>
          )}
          {query.length === 0 && (
            <div style={{ textAlign: 'center', color: '#4b5563', padding: '20px', fontSize: '13px' }}>
              Type at least 2 characters to search
            </div>
          )}
        </div>
      ) : (
        /* Confirmation */
        <div style={{ textAlign: 'center', maxWidth: '360px', margin: '0 auto' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            backgroundColor: 'rgba(34,197,94,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            border: '3px solid #22c55e',
          }}>
            <CheckCircle size={50} color="#22c55e" />
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#22c55e', marginBottom: '8px' }}>Checked In!</h2>
          {confirmedMember && (
            <>
              <div style={{ color: '#e8e8ea', fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>
                {confirmedMember.name}
              </div>
              <div style={{ marginBottom: '14px' }}>
                <BeltBadge belt={confirmedMember.belt} stripes={confirmedMember.stripes} size="lg" />
              </div>
              <div style={{ color: '#6b7280', fontSize: '13px' }}>
                Class #{confirmedMember.attendanceCount + 1} · Welcome to the mat!
              </div>
            </>
          )}
          <div style={{ color: '#4b5563', fontSize: '12px', marginTop: '24px' }}>Resetting in 3 seconds...</div>
        </div>
      )}

      {/* Roster Modal */}
      {rosterClass && (
        <RosterModal
          cls={rosterClass}
          day={today}
          regTick={regTick}
          onCheckIn={handleRosterCheckIn}
          onClose={() => setRosterClass(null)}
        />
      )}
    </div>
  );
}

// --- Main Check-In Page ---
export default function CheckInPage() {
  const { role, mounted: roleMounted } = useRole();
  const currentUser = useCurrentUser();
  const [regTick, setRegTick] = useState(0);
  const refresh = useCallback(() => setRegTick((t) => t + 1), []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#09090d',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '48px 24px',
    }}>
      {/* Header */}
      <div style={{
        width: '100%', maxWidth: '600px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '32px',
      }}>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '28px', marginBottom: '4px' }}>🥋</div>
          <div style={{ color: '#e8e8ea', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.02em' }}>
            Austin BJJ Academy
          </div>
          <div style={{ color: '#6b7280', fontSize: '13px', marginTop: '2px' }}>
            {role === 'student' ? `Welcome, ${currentUser.name}` : 'Member Check-In Kiosk'}
          </div>
        </div>
        {roleMounted && <RoleSwitcher />}
      </div>

      {/* Role-based content */}
      {roleMounted && role === 'student' ? (
        <StudentView studentName={currentUser.name} regTick={regTick} onRefresh={refresh} />
      ) : roleMounted ? (
        <InstructorAdminView regTick={regTick} onRefresh={refresh} />
      ) : null}
    </div>
  );
}
