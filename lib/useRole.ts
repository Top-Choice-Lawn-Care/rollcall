'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser } from '@/lib/auth';

export type Role = 'super_admin' | 'admin' | 'instructor' | 'student';

const VIEW_KEY = 'rollcall_view_as';
const ROLES: Role[] = ['admin', 'instructor', 'student'];

export function useRole() {
  const [mounted, setMounted] = useState(false);
  const [viewAs, setViewAs] = useState<Role>('student');

  useEffect(() => {
    const user = getCurrentUser();
    const baseRole: Role = (user?.role as Role) ?? 'student';

    // Admins can switch views; load their saved view preference
    if (baseRole === 'admin') {
      const stored = localStorage.getItem(VIEW_KEY) as Role | null;
      if (stored && ROLES.includes(stored)) {
        setViewAs(stored);
      } else {
        setViewAs('admin');
      }
    } else {
      // Non-admins: role is fixed to their account role
      setViewAs(baseRole);
    }
    setMounted(true);
  }, []);

  // Effective role is what's displayed
  const role = viewAs;

  // Base role from auth (always real)
  const baseRole: Role = (() => {
    if (!mounted) return 'student';
    return (getCurrentUser()?.role as Role) ?? 'student';
  })();

  // Only gym admins can switch views (super_admin has their own fixed view)
  const canSwitch = mounted && baseRole === 'admin';

  const setRole = useCallback((newRole: Role) => {
    setViewAs(newRole);
    try {
      localStorage.setItem(VIEW_KEY, newRole);
    } catch {
      // ignore
    }
  }, []);

  const cycleRole = useCallback(() => {
    setViewAs((current) => {
      const idx = ROLES.indexOf(current);
      const next = ROLES[(idx + 1) % ROLES.length];
      try {
        localStorage.setItem(VIEW_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { role, setRole, cycleRole, mounted, canSwitch, baseRole };
}

export function getRoleLabel(role: Role): string {
  switch (role) {
    case 'super_admin': return 'RollCall Admin';
    case 'admin': return 'Admin Mode';
    case 'instructor': return 'Instructor Mode';
    case 'student': return 'Student Mode';
  }
}

export function getRoleIcon(role: Role): string {
  switch (role) {
    case 'super_admin': return '🏛️';
    case 'admin': return '⚙️';
    case 'instructor': return '🥋';
    case 'student': return '👤';
  }
}
