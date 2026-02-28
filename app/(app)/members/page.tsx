'use client';

import { useState } from 'react';
import Link from 'next/link';
import { members, Member } from '@/lib/mockData';
import BeltBadge from '@/components/ui/BeltBadge';
import { Search, Plus } from 'lucide-react';

type Filter = 'all' | 'active' | 'trial' | 'at-risk';

const riskColors: Record<string, string> = {
  active: '#22c55e',
  trial: '#3b82f6',
  'at-risk': '#f59e0b',
  inactive: '#6b7280',
};

const riskLabels: Record<string, string> = {
  active: 'Active',
  trial: 'Trial',
  'at-risk': 'At-Risk',
  inactive: 'Inactive',
};

export default function MembersPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = members.filter((m) => {
    const matchesFilter = filter === 'all' || m.status === filter;
    const matchesSearch =
      search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: members.length,
    active: members.filter((m) => m.status === 'active').length,
    trial: members.filter((m) => m.status === 'trial').length,
    'at-risk': members.filter((m) => m.status === 'at-risk').length,
  };

  return (
    <div style={{ padding: '32px', backgroundColor: '#09090d', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#e8e8ea', letterSpacing: '-0.02em', margin: 0 }}>
            Members
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
            {counts.all} total · {counts.active} active · {counts['at-risk']} at-risk
          </p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#b45309',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Filter tabs + Search */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {(['all', 'active', 'trial', 'at-risk'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: filter === f ? '#f59e0b' : 'rgba(255,255,255,0.1)',
              backgroundColor: filter === f ? 'rgba(245,158,11,0.12)' : 'transparent',
              color: filter === f ? '#f59e0b' : '#9ca3af',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {f === 'all' ? 'All' : riskLabels[f]} ({counts[f]})
          </button>
        ))}

        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}
          />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              backgroundColor: '#131318',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '8px 12px 8px 32px',
              color: '#e8e8ea',
              fontSize: '13px',
              outline: 'none',
              width: '220px',
            }}
          />
        </div>
      </div>

      {/* Mobile card list */}
      <div className="flex flex-col gap-2 md:hidden">
        {filtered.map((member) => (
          <Link key={member.id} href={`/members/${member.id}`} style={{ textDecoration: 'none' }}>
            <div
              style={{
                backgroundColor: '#131318',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              {/* Left: name + email */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ color: '#e8e8ea', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {member.name}
                </div>
                <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {member.email}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <BeltBadge belt={member.belt} stripes={member.stripes} size="sm" />
                </div>
              </div>
              {/* Right: status + AI score */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', flexShrink: 0 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontSize: '12px', color: riskColors[member.status], fontWeight: 600,
                  backgroundColor: `${riskColors[member.status]}18`,
                  border: `1px solid ${riskColors[member.status]}44`,
                  borderRadius: '20px', padding: '2px 8px',
                  whiteSpace: 'nowrap',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: riskColors[member.status], display: 'inline-block', flexShrink: 0 }} />
                  {riskLabels[member.status]}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '40px', height: '5px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${member.aiPromotionScore}%`,
                      backgroundColor: member.aiPromotionScore >= 80 ? '#22c55e' : member.aiPromotionScore >= 60 ? '#f59e0b' : '#6b7280',
                      borderRadius: '3px',
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>{member.aiPromotionScore}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Desktop table */}
      <div
        className="hidden md:block"
        style={{
          backgroundColor: '#131318',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1c1c24', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Name', 'Belt', 'Status', 'Join Date', 'Last Seen', 'Fee', 'AI Score'].map((col) => (
                <th
                  key={col}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    color: '#6b7280',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr
                key={member.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                className="hover:bg-[#1c1c24]"
              >
                <td style={{ padding: '14px 16px' }}>
                  <Link href={`/members/${member.id}`} style={{ textDecoration: 'none', color: '#e8e8ea', fontWeight: 600, fontSize: '14px' }}>
                    {member.name}
                  </Link>
                  <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>{member.email}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <BeltBadge belt={member.belt} stripes={member.stripes} size="sm" />
                </td>
                <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: riskColors[member.status], fontWeight: 500 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: riskColors[member.status], display: 'inline-block', flexShrink: 0 }} />
                    {riskLabels[member.status]}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '13px', whiteSpace: 'nowrap' }}>{member.joinDate}</td>
                <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '13px', whiteSpace: 'nowrap' }}>{member.lastSeen}</td>
                <td style={{ padding: '14px 16px', color: '#e8e8ea', fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  ${member.monthlyFee}/mo
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '48px', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${member.aiPromotionScore}%`,
                        backgroundColor: member.aiPromotionScore >= 80 ? '#22c55e' : member.aiPromotionScore >= 60 ? '#f59e0b' : '#6b7280',
                        borderRadius: '3px',
                      }} />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: member.aiPromotionScore >= 80 ? '#22c55e' : member.aiPromotionScore >= 60 ? '#f59e0b' : '#6b7280',
                      fontWeight: 600,
                    }}>{member.aiPromotionScore}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
