'use client';

import { useState } from 'react';
import { classTypes } from '@/lib/mockData';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6am to 10pm

function formatHour(h: number) {
  if (h === 12) return '12 PM';
  if (h < 12) return `${h} AM`;
  return `${h - 12} PM`;
}

function timeToRow(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h - 6 + m / 60;
}

interface ClassDetail {
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
}

export default function SchedulePage() {
  const [selected, setSelected] = useState<ClassDetail | null>(null);

  const getClassesForDayHour = (day: string, hour: number) => {
    return classTypes.filter((cls) => {
      if (!cls.days.includes(day)) return false;
      const [h] = cls.time.split(':').map(Number);
      return h === hour;
    });
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
          Schedule
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>Week of February 24–March 1, 2026</p>
      </div>

      {/* Legend — deduplicated by name+color */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {Array.from(new Map(classTypes.map((c) => [`${c.name}-${c.color}`, c])).values()).map((cls) => (
          <div key={`${cls.name}-${cls.color}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: cls.color + '18', border: `1px solid ${cls.color}44`, borderRadius: '20px', padding: '3px 10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: cls.color, flexShrink: 0 }} />
            <span style={{ color: cls.color, fontSize: '11px', fontWeight: 600 }}>{cls.name}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          backgroundColor: '#131318',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          overflow: 'auto',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', minWidth: '700px' }}>
          {/* Header */}
          <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }} />
          {days.map((day, i) => (
            <div
              key={day}
              style={{
                padding: '12px 8px',
                textAlign: 'center',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                borderLeft: '1px solid rgba(255,255,255,0.06)',
                color: '#9ca3af',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {shortDays[i]}
            </div>
          ))}

          {/* Hour rows */}
          {hours.map((hour) => (
            <>
              {/* Time label */}
              <div
                key={`time-${hour}`}
                style={{
                  padding: '12px 8px 4px',
                  textAlign: 'right',
                  color: '#4b5563',
                  fontSize: '11px',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  minHeight: '64px',
                  display: 'flex',
                  alignItems: 'flex-start',
                }}
              >
                {formatHour(hour)}
              </div>

              {/* Day cells */}
              {days.map((day) => {
                const classes = getClassesForDayHour(day, hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.04)',
                      borderLeft: '1px solid rgba(255,255,255,0.06)',
                      minHeight: '64px',
                      padding: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                    }}
                  >
                    {classes.map((cls) => (
                      <button
                        key={cls.id}
                        onClick={() => setSelected({ ...cls, day })}
                        style={{
                          display: 'block',
                          width: '100%',
                          backgroundColor: cls.color + '22',
                          border: `1px solid ${cls.color}66`,
                          borderLeft: `3px solid ${cls.color}`,
                          borderRadius: '6px',
                          padding: '4px 6px',
                          cursor: 'pointer',
                          textAlign: 'left',
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
                      </button>
                    ))}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              backgroundColor: '#1c1c24',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '14px',
              padding: '28px',
              maxWidth: '400px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px',
              }}
            >
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: selected.color }} />
              <h2 style={{ color: '#e8e8ea', fontWeight: 800, fontSize: '20px', margin: 0 }}>{selected.name}</h2>
            </div>
            {selected.description && (
              <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '16px', lineHeight: 1.5 }}>{selected.description}</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Day', value: selected.day },
                { label: 'Time', value: selected.time },
                { label: 'Duration', value: `${selected.duration} min` },
                { label: 'Instructor', value: selected.instructor },
                ...(selected.ageGroup ? [{ label: 'Age Group', value: selected.ageGroup }] : []),
                ...(selected.style ? [{ label: 'Style', value: selected.style === 'nogi' ? 'NoGi' : selected.style === 'gi' ? 'Gi' : 'Gi & NoGi' }] : []),
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>{row.label}</span>
                  <span style={{ color: '#e8e8ea', fontSize: '14px', fontWeight: 600 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{
                marginTop: '20px',
                width: '100%',
                padding: '10px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '8px',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
