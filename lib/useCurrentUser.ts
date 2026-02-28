'use client';

import { useRole, type Role } from './useRole';

export interface CurrentUser {
  name: string;
  role: Role;
  title: string;
}

const USER_BY_ROLE: Record<Role, CurrentUser> = {
  super_admin: { name: 'RollCall Admin', role: 'super_admin', title: 'Platform Administrator' },
  admin: { name: 'Alexandre Santos', role: 'admin', title: 'Gym Administrator' },
  instructor: { name: 'Robert Bookman', role: 'instructor', title: 'Head Instructor' },
  student: { name: 'Carlos Mendez', role: 'student', title: 'Blue Belt · 3 Stripes' },
};

export function useCurrentUser(): CurrentUser {
  const { role } = useRole();
  return USER_BY_ROLE[role] ?? USER_BY_ROLE['student'];
}
