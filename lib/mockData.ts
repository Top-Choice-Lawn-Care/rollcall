export type Belt = 'white' | 'blue' | 'purple' | 'brown' | 'black';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  belt: Belt;
  stripes: number;
  joinDate: string;
  lastSeen: string;
  attendanceCount: number;
  monthlyFee: number;
  aiPromotionScore: number;
  status: 'active' | 'trial' | 'at-risk' | 'inactive';
  plan: string;
  daysAtCurrentBelt: number;
  avatar?: string;
}

export interface ClassType {
  id: string;
  name: string;
  type: 'fundamentals' | 'advanced' | 'open-mat' | 'kids' | 'competition';
  days: string[];
  time: string;
  duration: number; // minutes
  instructor: string;
  maxCapacity: number;
  color: string;
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  date: string;
  status: 'paid' | 'failed' | 'pending';
  plan: string;
}

export interface CheckIn {
  id: string;
  memberId: string;
  memberName: string;
  classType: string;
  time: string;
}

export const GYM_NAME = 'Austin BJJ Academy';

export const members: Member[] = [
  {
    id: '1',
    name: 'Carlos Mendez',
    email: 'carlos@example.com',
    phone: '512-555-0101',
    belt: 'blue',
    stripes: 3,
    joinDate: '2022-03-15',
    lastSeen: '2026-02-27',
    attendanceCount: 312,
    monthlyFee: 149,
    aiPromotionScore: 89,
    status: 'active',
    plan: 'BJJ Program',
    daysAtCurrentBelt: 620,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '512-555-0102',
    belt: 'white',
    stripes: 4,
    joinDate: '2024-01-10',
    lastSeen: '2026-02-14',
    attendanceCount: 87,
    monthlyFee: 99,
    aiPromotionScore: 78,
    status: 'at-risk',
    plan: 'Fundamentals',
    daysAtCurrentBelt: 140,
  },
  {
    id: '3',
    name: 'Sarah Kim',
    email: 'sarah@example.com',
    phone: '512-555-0103',
    belt: 'purple',
    stripes: 1,
    joinDate: '2020-08-22',
    lastSeen: '2026-02-26',
    attendanceCount: 589,
    monthlyFee: 199,
    aiPromotionScore: 82,
    status: 'active',
    plan: 'Unlimited',
    daysAtCurrentBelt: 480,
  },
  {
    id: '4',
    name: 'David Torres',
    email: 'david@example.com',
    phone: '512-555-0104',
    belt: 'brown',
    stripes: 2,
    joinDate: '2018-05-01',
    lastSeen: '2026-02-28',
    attendanceCount: 1102,
    monthlyFee: 199,
    aiPromotionScore: 91,
    status: 'active',
    plan: 'Unlimited',
    daysAtCurrentBelt: 730,
  },
  {
    id: '5',
    name: 'Emma Rodriguez',
    email: 'emma@example.com',
    phone: '512-555-0105',
    belt: 'white',
    stripes: 0,
    joinDate: '2026-01-15',
    lastSeen: '2026-02-25',
    attendanceCount: 18,
    monthlyFee: 99,
    aiPromotionScore: 34,
    status: 'trial',
    plan: 'Fundamentals',
    daysAtCurrentBelt: 44,
  },
  {
    id: '6',
    name: 'James Park',
    email: 'james@example.com',
    phone: '512-555-0106',
    belt: 'blue',
    stripes: 2,
    joinDate: '2023-02-28',
    lastSeen: '2026-02-10',
    attendanceCount: 143,
    monthlyFee: 149,
    aiPromotionScore: 56,
    status: 'at-risk',
    plan: 'BJJ Program',
    daysAtCurrentBelt: 365,
  },
  {
    id: '7',
    name: 'Aisha Williams',
    email: 'aisha@example.com',
    phone: '512-555-0107',
    belt: 'blue',
    stripes: 4,
    joinDate: '2021-11-03',
    lastSeen: '2026-02-27',
    attendanceCount: 421,
    monthlyFee: 149,
    aiPromotionScore: 95,
    status: 'active',
    plan: 'BJJ Program',
    daysAtCurrentBelt: 820,
  },
  {
    id: '8',
    name: 'Tyler Grant',
    email: 'tyler@example.com',
    phone: '512-555-0108',
    belt: 'white',
    stripes: 2,
    joinDate: '2025-06-01',
    lastSeen: '2026-02-05',
    attendanceCount: 45,
    monthlyFee: 99,
    aiPromotionScore: 42,
    status: 'at-risk',
    plan: 'Fundamentals',
    daysAtCurrentBelt: 272,
  },
  {
    id: '9',
    name: 'Lily Chen',
    email: 'lily@example.com',
    phone: '512-555-0109',
    belt: 'purple',
    stripes: 3,
    joinDate: '2019-07-14',
    lastSeen: '2026-02-28',
    attendanceCount: 782,
    monthlyFee: 199,
    aiPromotionScore: 88,
    status: 'active',
    plan: 'Unlimited',
    daysAtCurrentBelt: 590,
  },
  {
    id: '10',
    name: 'Marcus Bell',
    email: 'marcus@example.com',
    phone: '512-555-0110',
    belt: 'black',
    stripes: 1,
    joinDate: '2015-03-20',
    lastSeen: '2026-02-26',
    attendanceCount: 2341,
    monthlyFee: 199,
    aiPromotionScore: 99,
    status: 'active',
    plan: 'Unlimited',
    daysAtCurrentBelt: 1460,
  },
  {
    id: '11',
    name: 'Nina Patel',
    email: 'nina@example.com',
    phone: '512-555-0111',
    belt: 'white',
    stripes: 3,
    joinDate: '2025-09-10',
    lastSeen: '2026-02-27',
    attendanceCount: 62,
    monthlyFee: 89,
    aiPromotionScore: 67,
    status: 'active',
    plan: 'Kids',
    daysAtCurrentBelt: 171,
  },
  {
    id: '12',
    name: 'Roberto Vega',
    email: 'roberto@example.com',
    phone: '512-555-0112',
    belt: 'blue',
    stripes: 1,
    joinDate: '2022-12-05',
    lastSeen: '2026-02-22',
    attendanceCount: 198,
    monthlyFee: 149,
    aiPromotionScore: 61,
    status: 'active',
    plan: 'BJJ Program',
    daysAtCurrentBelt: 420,
  },
];

export const classTypes: ClassType[] = [
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    type: 'fundamentals',
    days: ['Monday', 'Wednesday', 'Friday'],
    time: '19:00',
    duration: 60,
    instructor: 'Marcus Bell',
    maxCapacity: 20,
    color: '#3b82f6',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    type: 'advanced',
    days: ['Tuesday', 'Thursday'],
    time: '19:00',
    duration: 90,
    instructor: 'David Torres',
    maxCapacity: 15,
    color: '#a855f7',
  },
  {
    id: 'open-mat',
    name: 'Open Mat',
    type: 'open-mat',
    days: ['Saturday'],
    time: '10:00',
    duration: 120,
    instructor: 'Marcus Bell',
    maxCapacity: 30,
    color: '#6b7280',
  },
  {
    id: 'kids',
    name: 'Kids BJJ',
    type: 'kids',
    days: ['Monday', 'Wednesday'],
    time: '16:00',
    duration: 45,
    instructor: 'Sarah Kim',
    maxCapacity: 12,
    color: '#f59e0b',
  },
  {
    id: 'competition',
    name: 'Competition Prep',
    type: 'competition',
    days: ['Saturday'],
    time: '13:00',
    duration: 90,
    instructor: 'David Torres',
    maxCapacity: 10,
    color: '#dc2626',
  },
];

export const transactions: Transaction[] = [
  { id: 't1', memberId: '1', memberName: 'Carlos Mendez', amount: 149, date: '2026-02-01', status: 'paid', plan: 'BJJ Program' },
  { id: 't2', memberId: '2', memberName: 'Mike Johnson', amount: 99, date: '2026-02-01', status: 'failed', plan: 'Fundamentals' },
  { id: 't3', memberId: '3', memberName: 'Sarah Kim', amount: 199, date: '2026-02-01', status: 'paid', plan: 'Unlimited' },
  { id: 't4', memberId: '4', memberName: 'David Torres', amount: 199, date: '2026-02-01', status: 'paid', plan: 'Unlimited' },
  { id: 't5', memberId: '5', memberName: 'Emma Rodriguez', amount: 99, date: '2026-02-01', status: 'paid', plan: 'Fundamentals' },
  { id: 't6', memberId: '6', memberName: 'James Park', amount: 149, date: '2026-02-01', status: 'pending', plan: 'BJJ Program' },
  { id: 't7', memberId: '7', memberName: 'Aisha Williams', amount: 149, date: '2026-02-01', status: 'paid', plan: 'BJJ Program' },
  { id: 't8', memberId: '8', memberName: 'Tyler Grant', amount: 99, date: '2026-02-01', status: 'failed', plan: 'Fundamentals' },
  { id: 't9', memberId: '9', memberName: 'Lily Chen', amount: 199, date: '2026-02-01', status: 'paid', plan: 'Unlimited' },
  { id: 't10', memberId: '10', memberName: 'Marcus Bell', amount: 199, date: '2026-02-01', status: 'paid', plan: 'Unlimited' },
];

export const revenueData = [
  { month: 'Sep', revenue: 10200 },
  { month: 'Oct', revenue: 11800 },
  { month: 'Nov', revenue: 12400 },
  { month: 'Dec', revenue: 13100 },
  { month: 'Jan', revenue: 13900 },
  { month: 'Feb', revenue: 14380 },
];

export const stats = {
  activeMembers: 142,
  monthlyRevenue: 14380,
  classesThisWeek: 23,
  atRiskMembers: 7,
  retentionRate: 94,
};

export const plans = [
  { name: 'Fundamentals', price: 99, members: 38 },
  { name: 'BJJ Program', price: 149, members: 64 },
  { name: 'Unlimited', price: 199, members: 28 },
  { name: 'Kids', price: 89, members: 22 },
];

export const recentActivity = [
  { id: 'a1', type: 'checkin', text: 'Carlos Mendez checked in to Advanced', time: '7:08 PM', icon: '✅' },
  { id: 'a2', type: 'join', text: 'Emma Rodriguez joined as a trial member', time: '2:15 PM', icon: '🆕' },
  { id: 'a3', type: 'payment', text: 'Payment of $199 processed — Lily Chen', time: '12:01 AM', icon: '💳' },
  { id: 'a4', type: 'checkin', text: 'Aisha Williams checked in to Fundamentals', time: 'Yesterday 7:12 PM', icon: '✅' },
  { id: 'a5', type: 'payment_failed', text: 'Payment failed — Mike Johnson ($99)', time: 'Yesterday 12:01 AM', icon: '❌' },
  { id: 'a6', type: 'promotion', text: 'David Torres promoted to Brown Belt 2 stripes', time: '2 days ago', icon: '🥋' },
];

export const promotionHistory = [
  { belt: 'white', date: '2018-05-01', note: 'Started BJJ' },
  { belt: 'blue', date: '2019-11-15', note: 'Promoted at Academy Championship' },
  { belt: 'purple', date: '2021-06-20', note: 'After 540 classes' },
  { belt: 'brown', date: '2023-08-10', note: 'Promoted at end of year ceremony' },
];

export const attendanceByClass = [
  { name: 'Fundamentals', value: 38 },
  { name: 'Advanced', value: 24 },
  { name: 'Open Mat', value: 18 },
  { name: 'Kids', value: 12 },
  { name: 'Competition', value: 8 },
];

export const newMembersByMonth = [
  { month: 'Sep', count: 8 },
  { month: 'Oct', count: 12 },
  { month: 'Nov', count: 7 },
  { month: 'Dec', count: 5 },
  { month: 'Jan', count: 14 },
  { month: 'Feb', count: 11 },
];

export const retentionTrend = [
  { month: 'Sep', rate: 88 },
  { month: 'Oct', rate: 90 },
  { month: 'Nov', rate: 91 },
  { month: 'Dec', rate: 92 },
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 94 },
];

export const revenueByPlan = [
  { plan: 'Fundamentals', revenue: 3762 },
  { plan: 'BJJ Program', revenue: 9536 },
  { plan: 'Unlimited', revenue: 5572 },
  { plan: 'Kids', revenue: 1958 },
];
