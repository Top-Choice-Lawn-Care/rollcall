'use client';

import { useState, useEffect, useCallback } from 'react';
import { classTypes } from '@/lib/mockData';
import { useRole } from '@/lib/useRole';
import { useCurrentUser } from '@/lib/useCurrentUser';
import RoleSwitcher from '@/components/ui/RoleSwitcher';
import {
  getClassRegistrations,
  getClassCheckins,
  registerForClass,
  unregisterFromClass,
  checkInMember,
  isRegistered,
} from '@/lib/registrations';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 17 }, (_, i) => i + 6);

function formatHour(h: number) {
  if (h === 12) return '12 PM';
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
}

interface ClassDetail {
  id: string;
  name: string;
  time: string;
  duration: number;
  instructor: string;
  color: string;
  day: string;
  type: string;
  style?: string;
  ageGroup?: string;
  description?: string;
  maxCapacity: number;
}

function capacityColor(count: number, max: number): string {
  const pct = count / max;
  if (pct >= 1) return '#ef4444';
  if (pct >= 0.8) return '#f59e0b';
  return '#3b82f6';
}

function CapacityBar({ count, max, color }: { count: number; max: number; color: string }) {
  const pct = Math.min(count / max, 1);
  const barColor = capacityColor(count, max);
  return (
    <div style={{ marginTop: '4px' }}>
      <div style={{
        height: '4px', borderRadius: '2px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct * 100}%`,
          backgroundColor: barColor,
          borderRadius: '2px',
          transition: 'width 0.3s',
        }} />
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const { role, mounted: roleMounted } = useRole();
  const currentUser = useCurrentUser();
  const [selected, setSelected] = useState<ClassDetail | null>(null);

  // Registration state — refreshed whenever we take an action
  const [regTick, setRegTick] = useState(0);
  const refresh = useCallback(() => setRegTick((t) => t + 1), []);

  // Walk-in input state
  const [walkInName, setWalkInName] = useState('');

  // Per-card enrollment counts (recalculated on regTick)
  const [enrollmentMap, setEnrollmentMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const map: Record<string, number> = {};
    classTypes.forEach((cls) => {
      cls.days.forEach((day) => {
        const key = `${cls.id}_${day}`;
        map[key] = getClassRegistrations(key).length;
      });
    });
    setEnrollmentMap(map);
  }, [regTick]);

  const getClassesForDayHour = (day: string, hour: number) => {
    return classTypes.filter((cls) => {
      if (!cls.days.includes(day)) return false;
      const [h] = cls.time.split(':').map(Number);
      return h === hour;
    });
  };

  const handleRegister = (classKey: string) => {
    registerForClass(classKey, currentUser.name);
    refresh();
  };

  const handleUnregister = (classKey: string) => {
    unregisterFromClass(classKey, currentUser.name);
    refresh();
  };

  const handleCheckIn = (classKey: string, memberName: string) => {
    checkInMember(classKey, memberName);
    refresh();
  };

  const handleAddWalkIn = (classKey: string) => {
    const name = walkInName.trim();
    if (!name) return;
    checkInMember(classKey, name);
    setWalkInName('');
    refresh();
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
            Schedule
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Week of February 24–March 1, 2026</p>
        </div>
        {roleMounted && <RoleSwitcher />}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {Array.from(new Map(classTypes.map((c) => [`${c.name}-${c.color}`, c])).values()).map((cls) => (
          <div key={`${cls.name}-${cls.color}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: cls.color + '18', border: `1px solid ${cls.color}44`, borderRadius: '20px', padding: '3px 10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: cls.color, flexShrink: 0 }} />
            <span style={{ color: cls.color, fontSize: '11px', fontWeight: 600 }}>{cls.name}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        backgroundColor: '#131318',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '12px',
        overflow: 'auto',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', minWidth: '700px' }}>
          {/* Header */}
          <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }} />
          {days.map((day, i) => (
            <div key={day} style={{
              padding: '12px 8px', textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              borderLeft: '1px solid rgba(255,255,255,0.06)',
              color: '#9ca3af', fontSize: '12px', fontWeight: 600,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {shortDays[i]}
            </div>
          ))}

          {/* Hour rows */}
          {hours.map((hour) => (
            <>
              <div key={`time-${hour}`} style={{
                padding: '12px 8px 4px', textAlign: 'right',
                color: '#4b5563', fontSize: '11px',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                minHeight: '64px',
                display: 'flex', alignItems: 'flex-start',
              }}>
                {formatHour(hour)}
              </div>

              {days.map((day) => {
                const classes = getClassesForDayHour(day, hour);
                return (
                  <div key={`${day}-${hour}`} style={{
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    borderLeft: '1px solid rgba(255,255,255,0.06)',
                    minHeight: '64px', padding: '4px',
                    display: 'flex', flexDirection: 'column', gap: '3px',
                  }}>
                    {classes.map((cls) => {
                      const classKey = `${cls.id}_${day}`;
                      const enrolled = enrollmentMap[classKey] ?? 0;
                      const capColor = capacityColor(enrolled, cls.maxCapacity);
                      return (
                        <button
                          key={cls.id}
                          onClick={() => {
                            setWalkInName('');
                            setSelected({ ...cls, day });
                          }}
                          style={{
                            display: 'block', width: '100%',
                            backgroundColor: cls.color + '22',
                            border: `1px solid ${cls.color}66`,
                            borderLeft: `3px solid ${cls.color}`,
                            borderRadius: '6px', padding: '4px 6px',
                            cursor: 'pointer', textAlign: 'left',
                          }}
                        >
                          <div style={{ color: cls.color, fontSize: '11px', fontWeight: 700, lineHeight: 1.2 }}>
                            {cls.name}
                          </div>
                          <div style={{ color: '#9ca3af', fontSize: '10px' }}>
                            {cls.time}{cls.style && cls.style !== 'both' ? ` · ${cls.style === 'nogi' ? 'NoGi' : 'Gi'}` : ''}
                          </div>
                          {cls.ageGroup && (
                            <div style={{ color: '#6b7280', fontSize: '9px', marginTop: '1px', lineHeight: 1.2 }}>{cls.ageGroup}</div>
                          )}
                          {/* Enrollment count */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                            <span style={{ color: capColor, fontSize: '9px', fontWeight: 700 }}>
                              {enrolled}/{cls.maxCapacity}
                            </span>
                          </div>
                          <CapacityBar count={enrolled} max={cls.maxCapacity} color={cls.color} />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <ModalContent
          selected={selected}
          role={role}
          currentUser={currentUser}
          regTick={regTick}
          walkInName={walkInName}
          setWalkInName={setWalkInName}
          onRegister={handleRegister}
          onUnregister={handleUnregister}
          onCheckIn={handleCheckIn}
          onAddWalkIn={handleAddWalkIn}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function ModalContent({
  selected,
  role,
  currentUser,
  regTick,
  walkInName,
  setWalkInName,
  onRegister,
  onUnregister,
  onCheckIn,
  onAddWalkIn,
  onClose,
}: {
  selected: ClassDetail;
  role: string;
  currentUser: { name: string };
  regTick: number;
  walkInName: string;
  setWalkInName: (v: string) => void;
  onRegister: (key: string) => void;
  onUnregister: (key: string) => void;
  onCheckIn: (key: string, name: string) => void;
  onAddWalkIn: (key: string) => void;
  onClose: () => void;
}) {
  const classKey = `${selected.id}_${selected.day}`;
  const registrations = getClassRegistrations(classKey);
  const checkins = getClassCheckins(classKey);
  const enrolled = registrations.length;
  const max = selected.maxCapacity;
  const isFull = enrolled >= max;
  const studentRegistered = isRegistered(classKey, currentUser.name);
  const studentCheckedIn = checkins.includes(currentUser.name);
  const capColor = capacityColor(enrolled, max);
  const pct = Math.min(enrolled / max, 1);

  // Unused regTick — just here to ensure re-render when registrations change
  void regTick;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1c1c24',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '14px',
          padding: '28px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: selected.color }} />
          <h2 style={{ color: '#e8e8ea', fontWeight: 800, fontSize: '20px', margin: 0, flex: 1 }}>{selected.name}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}>✕</button>
        </div>

        {selected.description && (
          <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>{selected.description}</p>
        )}

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {[
            { label: 'Day', value: selected.day },
            { label: 'Time', value: selected.time },
            { label: 'Duration', value: `${selected.duration} min` },
            { label: 'Instructor', value: selected.instructor },
            ...(selected.ageGroup ? [{ label: 'Age Group', value: selected.ageGroup }] : []),
            ...(selected.style ? [{ label: 'Style', value: selected.style === 'nogi' ? 'NoGi' : selected.style === 'gi' ? 'Gi' : 'Gi & NoGi' }] : []),
          ].map((row) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>{row.label}</span>
              <span style={{ color: '#e8e8ea', fontSize: '13px', fontWeight: 600 }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Capacity section */}
        <div style={{
          backgroundColor: '#131318',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '14px',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 600 }}>Enrollment</span>
            <span style={{ color: capColor, fontSize: '13px', fontWeight: 700 }}>
              {enrolled} / {max} spots
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${pct * 100}%`,
              backgroundColor: capColor,
              borderRadius: '3px',
              transition: 'width 0.3s',
            }} />
          </div>

          {/* Enrolled names */}
          <div style={{ marginTop: '12px' }}>
            {registrations.length === 0 ? (
              <div style={{ color: '#4b5563', fontSize: '12px', fontStyle: 'italic' }}>No one registered yet</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {registrations.map((name) => {
                  const checkedIn = checkins.includes(name);
                  return (
                    <span key={name} style={{
                      padding: '3px 9px', borderRadius: '999px',
                      fontSize: '11px', fontWeight: 600,
                      backgroundColor: checkedIn ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)',
                      border: `1px solid ${checkedIn ? 'rgba(34,197,94,0.4)' : 'rgba(59,130,246,0.4)'}`,
                      color: checkedIn ? '#22c55e' : '#60a5fa',
                    }}>
                      {checkedIn ? '✓ ' : ''}{name.split(' ')[0]}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* === STUDENT VIEW === */}
        {role === 'student' && (
          <div>
            {isFull && !studentRegistered ? (
              <div style={{
                padding: '12px', borderRadius: '8px',
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171', fontSize: '14px', fontWeight: 600,
                textAlign: 'center',
              }}>
                🚫 Class Full
              </div>
            ) : studentCheckedIn ? (
              <div style={{
                padding: '12px', borderRadius: '8px',
                backgroundColor: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.3)',
                color: '#22c55e', fontSize: '14px', fontWeight: 600,
                textAlign: 'center',
              }}>
                ✓ Present — Checked In
              </div>
            ) : studentRegistered ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  padding: '10px 14px', borderRadius: '8px',
                  backgroundColor: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.3)',
                  color: '#60a5fa', fontSize: '13px', fontWeight: 600,
                  textAlign: 'center',
                }}>
                  📋 You&apos;re registered ✓
                </div>
                <button
                  onClick={() => onUnregister(classKey)}
                  style={{
                    padding: '10px', borderRadius: '8px',
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    color: '#f87171', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer', width: '100%',
                  }}
                >
                  Unregister
                </button>
              </div>
            ) : (
              <button
                onClick={() => onRegister(classKey)}
                style={{
                  padding: '12px', borderRadius: '8px',
                  backgroundColor: 'rgba(34,197,94,0.15)',
                  border: '1px solid rgba(34,197,94,0.4)',
                  color: '#22c55e', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', width: '100%',
                }}
              >
                Register for this class
              </button>
            )}
          </div>
        )}

        {/* === INSTRUCTOR / ADMIN VIEW === */}
        {(role === 'instructor' || role === 'admin') && (
          <div>
            {/* Full roster with check-in buttons */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Roster
              </div>
              {registrations.length === 0 ? (
                <div style={{ color: '#4b5563', fontSize: '12px', fontStyle: 'italic' }}>No one registered</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {registrations.map((name) => {
                    const isIn = checkins.includes(name);
                    return (
                      <div key={name} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '8px 12px', borderRadius: '8px',
                        backgroundColor: isIn ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isIn ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                        <span style={{ color: '#e8e8ea', fontSize: '13px', fontWeight: 500 }}>{name}</span>
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
                              padding: '4px 10px', borderRadius: '6px',
                              backgroundColor: 'rgba(34,197,94,0.1)',
                              border: '1px solid rgba(34,197,94,0.3)',
                              color: '#22c55e', fontSize: '11px', fontWeight: 600,
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

            {/* Add Walk-In */}
            <div>
              <div style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                + Add Walk-In
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Member name..."
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onAddWalkIn(classKey)}
                  style={{
                    flex: 1,
                    backgroundColor: '#131318',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#e8e8ea',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={() => onAddWalkIn(classKey)}
                  style={{
                    padding: '8px 14px', borderRadius: '8px',
                    backgroundColor: 'rgba(34,197,94,0.15)',
                    border: '1px solid rgba(34,197,94,0.4)',
                    color: '#22c55e', fontSize: '13px', fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            marginTop: '20px', width: '100%', padding: '10px',
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: 'none', borderRadius: '8px',
            color: '#9ca3af', cursor: 'pointer', fontSize: '14px',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
