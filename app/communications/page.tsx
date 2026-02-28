'use client';

import { useState } from 'react';

const automations = [
  {
    id: 'welcome',
    name: 'New Member Welcome',
    desc: 'Sends a welcome email + SMS when a new member signs up',
    trigger: 'On member join',
    enabled: true,
  },
  {
    id: 'failed_payment',
    name: 'Failed Payment Recovery',
    desc: 'Notifies member of failed payment and provides retry link',
    trigger: 'On payment failure',
    enabled: true,
  },
  {
    id: 'absence',
    name: '14-Day Absence Check-In',
    desc: 'Sends personalized check-in message to members who haven\'t attended in 14+ days',
    trigger: '14 days since last check-in',
    enabled: true,
  },
  {
    id: 'promotion',
    name: 'Promotion Eligibility Alert',
    desc: 'Notifies instructor when a member\'s AI promotion score exceeds 80',
    trigger: 'AI score > 80',
    enabled: false,
  },
  {
    id: 'milestone',
    name: '100-Class Milestone',
    desc: 'Celebrates member reaching 100, 200, 500 class milestones',
    trigger: 'On class count milestone',
    enabled: true,
  },
];

const aiDrafts: Record<string, string> = {
  'All Active': "Hey {first_name}! Just a reminder that classes are running all week. We'd love to see you on the mat — your consistency has been showing. Let us know if anything's been keeping you away. OSS!",
  'Blue Belts': "Hey {first_name}! Coach wanted to personally reach out — your blue belt journey has been impressive. Keep showing up and those stripes are coming. See you on the mat!",
  'At-Risk': "Hey {first_name}, we noticed it's been a little while since we've seen you at the academy. Life happens — we get it. Whenever you're ready to get back on the mat, we're here. Miss you!",
  'Trial': "Hey {first_name}! Hope you're loving your trial so far. We'd love to answer any questions you have about membership or programs. Ready to make it official? We'll make it easy.",
};

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'automated' | 'manual'>('automated');
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(automations.map((a) => [a.id, a.enabled]))
  );
  const [segment, setSegment] = useState('All Active');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleAIDraft = () => {
    setBody(aiDrafts[segment] || aiDrafts['All Active']);
    setSubject(
      segment === 'At-Risk'
        ? "We miss you at the academy"
        : segment === 'Trial'
        ? "Ready to make it official?"
        : "See you on the mat!"
    );
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
          Communications
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
          Automated flows and manual outreach for Austin BJJ Academy
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', backgroundColor: '#131318', borderRadius: '10px', padding: '4px', width: 'fit-content' }}>
        {(['automated', 'manual'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeTab === tab ? '#1c1c24' : 'transparent',
              color: activeTab === tab ? '#e8e8ea' : '#6b7280',
              fontWeight: activeTab === tab ? 700 : 400,
              fontSize: '14px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'automated' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {automations.map((auto) => (
            <div
              key={auto.id}
              style={{
                backgroundColor: '#131318',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '15px' }}>{auto.name}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      backgroundColor: toggles[auto.id] ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                      color: toggles[auto.id] ? '#22c55e' : '#6b7280',
                      fontWeight: 600,
                    }}
                  >
                    {toggles[auto.id] ? 'ACTIVE' : 'PAUSED'}
                  </span>
                </div>
                <div style={{ color: '#9ca3af', fontSize: '13px', lineHeight: 1.5, marginBottom: '8px' }}>
                  {auto.desc}
                </div>
                <div style={{ color: '#6b7280', fontSize: '12px' }}>
                  Trigger: <span style={{ color: '#9ca3af' }}>{auto.trigger}</span>
                </div>
              </div>

              {/* Toggle */}
              <button
                onClick={() => setToggles((prev) => ({ ...prev, [auto.id]: !prev[auto.id] }))}
                style={{
                  position: 'relative',
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  backgroundColor: toggles[auto.id] ? '#22c55e' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'background-color 0.2s',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: toggles[auto.id] ? '22px' : '2px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    transition: 'left 0.2s',
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Manual Compose */
        <div
          style={{
            backgroundColor: '#131318',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '28px',
            maxWidth: '680px',
          }}
        >
          <h2 style={{ color: '#e8e8ea', fontWeight: 700, fontSize: '16px', margin: '0 0 20px' }}>
            Compose Message
          </h2>

          {/* Segment */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Segment
            </label>
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1c1c24',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#e8e8ea',
                fontSize: '14px',
                outline: 'none',
              }}
            >
              {['All Active', 'Blue Belts', 'At-Risk', 'Trial'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line..."
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

          {/* Body */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ color: '#6b7280', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="Write your message or use AI Draft..."
              style={{
                width: '100%',
                backgroundColor: '#1c1c24',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px 14px',
                color: '#e8e8ea',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAIDraft}
              style={{
                backgroundColor: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '8px',
                padding: '10px 18px',
                color: '#f59e0b',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              ✨ AI Draft
            </button>
            <button
              style={{
                flex: 1,
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 18px',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Send to {segment} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
