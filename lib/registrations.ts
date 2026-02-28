// localStorage-backed registration store
// Key: "rollcall_registrations" → { [classKey: string]: string[] }
// Key: "rollcall_checkins" → { [classKey: string]: string[] }
// classKey = `${classId}_${day}`

const REG_KEY = 'rollcall_registrations';
const CHECKIN_KEY = 'rollcall_checkins';

// Seed data — pre-registered for first load
const SEED_REGISTRATIONS: Record<string, string[]> = {
  // Monday GB1 Fundamentals (6:30 AM)
  'gb1-morning-mwf_Monday': ['Carlos Mendez', 'Sarah Kim', 'Aisha Williams', 'James Park', 'Nina Patel'],
  // Monday Live Training (7:30 PM)
  'live-training-eve-mtwth_Monday': ['Carlos Mendez', 'David Torres', 'Lily Chen'],
  // Wednesday GB1 Fundamentals (6:30 AM)
  'gb1-morning-mwf_Wednesday': ['Carlos Mendez', 'Mike Johnson', 'Emma Rodriguez'],
  // Friday GB1 Fundamentals (6:30 AM)
  'gb1-morning-mwf_Friday': ['Sarah Kim', 'Roberto Vega'],
};

const SEED_CHECKINS: Record<string, string[]> = {
  // A couple already checked in to Monday GB1
  'gb1-morning-mwf_Monday': ['Sarah Kim', 'Aisha Williams'],
};

function isServer() {
  return typeof window === 'undefined';
}

function initStore(key: string, seed: Record<string, string[]>): Record<string, string[]> {
  if (isServer()) return seed;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // ignore
    }
  }
  // First load — seed it
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function saveStore(key: string, data: Record<string, string[]>) {
  if (isServer()) return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function getRegistrations(): Record<string, string[]> {
  return initStore(REG_KEY, SEED_REGISTRATIONS);
}

export function getCheckins(): Record<string, string[]> {
  return initStore(CHECKIN_KEY, SEED_CHECKINS);
}

export function getClassRegistrations(classKey: string): string[] {
  const regs = getRegistrations();
  return regs[classKey] || [];
}

export function getClassCheckins(classKey: string): string[] {
  const checkins = getCheckins();
  return checkins[classKey] || [];
}

export function isRegistered(classKey: string, memberName: string): boolean {
  return getClassRegistrations(classKey).includes(memberName);
}

export function isCheckedIn(classKey: string, memberName: string): boolean {
  return getClassCheckins(classKey).includes(memberName);
}

export function registerForClass(classKey: string, memberName: string): void {
  if (isServer()) return;
  const regs = getRegistrations();
  const list = regs[classKey] || [];
  if (!list.includes(memberName)) {
    regs[classKey] = [...list, memberName];
    saveStore(REG_KEY, regs);
  }
}

export function unregisterFromClass(classKey: string, memberName: string): void {
  if (isServer()) return;
  const regs = getRegistrations();
  const list = regs[classKey] || [];
  regs[classKey] = list.filter((n) => n !== memberName);
  saveStore(REG_KEY, regs);
}

export function checkInMember(classKey: string, memberName: string): void {
  if (isServer()) return;
  // Also register if not already
  registerForClass(classKey, memberName);
  const checkins = getCheckins();
  const list = checkins[classKey] || [];
  if (!list.includes(memberName)) {
    checkins[classKey] = [...list, memberName];
    saveStore(CHECKIN_KEY, checkins);
  }
}
