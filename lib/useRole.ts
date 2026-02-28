'use client';

import { useState, useEffect, useCallback } from 'react';

export type Role = 'admin' | 'instructor' | 'student';

const ROLE_KEY = 'rollcall_role';
const ROLES: Role[] = ['admin', 'instructor', 'student'];

export function useRole() {
  const [role, setRoleState] = useState<Role>('admin');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(ROLE_KEY) as Role | null;
    if (stored && ROLES.includes(stored)) {
      setRoleState(stored);
    }
    setMounted(true);
  }, []);

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem(ROLE_KEY, newRole);
  }, []);

  const cycleRole = useCallback(() => {
    setRoleState((current) => {
      const idx = ROLES.indexOf(current);
      const next = ROLES[(idx + 1) % ROLES.length];
      localStorage.setItem(ROLE_KEY, next);
      return next;
    });
  }, []);

  return { role, setRole, cycleRole, mounted };
}

export function getRoleLabel(role: Role): string {
  switch (role) {
    case 'admin': return 'Admin Mode';
    case 'instructor': return 'Instructor Mode';
    case 'student': return 'Student Mode';
  }
}

export function getRoleIcon(role: Role): string {
  switch (role) {
    case 'admin': return '🏛️';
    case 'instructor': return '🥋';
    case 'student': return '👤';
  }
}
