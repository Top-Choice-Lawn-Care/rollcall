'use client';

import { useRole, type Role } from './useRole';

export interface CurrentUser {
  name: string;
  role: Role;
  title: string;
}

const USER_BY_ROLE: Record<Role, CurrentUser> = {
  admin: { name: 'Nolan', role: 'admin', title: 'Administrator' },
  instructor: { name: 'Alexandre Santos', role: 'instructor', title: 'Head Instructor' },
  student: { name: 'Carlos Mendez', role: 'student', title: 'Blue Belt · 3 Stripes' },
};

export function useCurrentUser(): CurrentUser {
  const { role } = useRole();
  return USER_BY_ROLE[role];
}
