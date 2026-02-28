// localStorage-backed registration store
// Key: "rollcall_registrations" → { [classKey: string]: string[] }
// Key: "rollcall_checkins" → { [classKey: string]: string[] }
// classKey = `${classId}_${day}`

const REG_KEY = 'rollcall_registrations';
const CHECKIN_KEY = 'rollcall_checkins';
const SEEDED_KEY = 'rollcall_seeded';

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

// ── Safe localStorage wrappers ───────────────────────────────────────────────

function safeGet(key: string): Record<string, string[]> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // Validate it's the right shape
    if (typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, string[]>;
  } catch {
    return {};
  }
}

function safeSet(key: string, data: Record<string, string[]>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // QuotaExceededError or SecurityError — fail silently but log
    console.warn('RollCall: localStorage write failed', e);
  }
}

// ── Seed guard — only seed once ──────────────────────────────────────────────

function shouldSeed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return !localStorage.getItem(SEEDED_KEY);
  } catch {
    return false;
  }
}

function markSeeded(): void {
  try {
    localStorage.setItem(SEEDED_KEY, '1');
  } catch {
    // ignore
  }
}

function ensureSeeded(): void {
  if (!shouldSeed()) return;
  // Only write if keys are not already set
  if (!localStorage.getItem(REG_KEY)) {
    safeSet(REG_KEY, SEED_REGISTRATIONS);
  }
  if (!localStorage.getItem(CHECKIN_KEY)) {
    safeSet(CHECKIN_KEY, SEED_CHECKINS);
  }
  markSeeded();
}

// ── Input sanitization ───────────────────────────────────────────────────────

function sanitizeName(name: string): string {
  return name.trim().slice(0, 100).replace(/[<>"'&]/g, '');
}

// ── Public API ───────────────────────────────────────────────────────────────

export function getRegistrations(): Record<string, string[]> {
  if (typeof window !== 'undefined') ensureSeeded();
  return safeGet(REG_KEY);
}

export function getCheckins(): Record<string, string[]> {
  if (typeof window !== 'undefined') ensureSeeded();
  return safeGet(CHECKIN_KEY);
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

/**
 * Register a member for a class.
 * @returns true on success, false if at capacity or already registered.
 */
export function registerForClass(
  classKey: string,
  memberName: string,
  maxCapacity: number = 20,
): boolean {
  if (typeof window === 'undefined') return false;
  const name = sanitizeName(memberName);
  if (!name) return false;
  const regs = safeGet(REG_KEY);
  const list = regs[classKey] || [];
  if (list.includes(name)) return false; // already registered
  if (list.length >= maxCapacity) return false; // at capacity
  regs[classKey] = [...list, name];
  safeSet(REG_KEY, regs);
  return true;
}

export function unregisterFromClass(classKey: string, memberName: string): void {
  if (typeof window === 'undefined') return;
  const name = sanitizeName(memberName);
  if (!name) return;
  const regs = safeGet(REG_KEY);
  const list = regs[classKey] || [];
  regs[classKey] = list.filter((n) => n !== name);
  safeSet(REG_KEY, regs);
}

export function checkInMember(classKey: string, memberName: string, maxCapacity: number = 20): void {
  if (typeof window === 'undefined') return;
  const name = sanitizeName(memberName);
  if (!name) return;
  // Also register if not already (respects capacity)
  registerForClass(classKey, name, maxCapacity);
  const checkins = safeGet(CHECKIN_KEY);
  const list = checkins[classKey] || [];
  if (!list.includes(name)) {
    checkins[classKey] = [...list, name];
    safeSet(CHECKIN_KEY, checkins);
  }
}
