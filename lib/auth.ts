// Simple auth state — localStorage backed for prototype
// In production this would be Supabase Auth

const AUTH_KEY = 'rollcall_auth';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
}

const DEMO_USERS: Record<string, AuthUser> = {
  'admin@gbdrip.com': { id: 'admin-1', name: 'Alexandre Santos', email: 'admin@gbdrip.com', role: 'admin' },
  'instructor@gbdrip.com': { id: 'inst-1', name: 'Robert Bookman', email: 'instructor@gbdrip.com', role: 'instructor' },
  'student@gbdrip.com': { id: 'stu-1', name: 'Carlos Mendez', email: 'student@gbdrip.com', role: 'student' },
};

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    // Validate shape
    if (!parsed.id || !parsed.role || !parsed.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function login(email: string, password: string): AuthUser | null {
  // Demo: any password works for demo accounts; add real validation here
  const user = DEMO_USERS[email.toLowerCase()];
  if (!user) return null;
  // In production: verify password hash server-side
  // For demo: accept any non-empty password
  if (!password || password.length < 1) return null;
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch {
    // ignore quota errors
  }
  return user;
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {
    // ignore
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
