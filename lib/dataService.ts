// lib/dataService.ts
// Currently backed by localStorage mock data.
// When Supabase is wired: replace each function body with a Supabase query.
// Components should ONLY call this file, never localStorage directly.

import { classTypes, members } from './mockData';
import {
  getClassRegistrations,
  getClassCheckins,
  registerForClass as _register,
  unregisterFromClass as _unregister,
  checkInMember as _checkIn,
  isRegistered as _isRegistered,
  isCheckedIn as _isCheckedIn,
} from './registrations';

export const DataService = {
  // Classes
  getClasses: () => classTypes,
  getClassById: (id: string) => classTypes.find((c) => c.id === id) ?? null,

  // Members
  getMembers: () => members,
  getMemberById: (id: string) => members.find((m) => m.id === id) ?? null,
  getMemberByName: (name: string) =>
    members.find((m) => m.name.toLowerCase() === name.toLowerCase()) ?? null,

  // Registrations
  getRegistrations: (classKey: string) => getClassRegistrations(classKey),
  getCheckins: (classKey: string) => getClassCheckins(classKey),
  register: (classKey: string, memberName: string, maxCapacity: number) =>
    _register(classKey, memberName, maxCapacity),
  unregister: (classKey: string, memberName: string) => _unregister(classKey, memberName),
  checkIn: (classKey: string, memberName: string, maxCapacity?: number) =>
    _checkIn(classKey, memberName, maxCapacity),
  isRegistered: (classKey: string, memberName: string) => _isRegistered(classKey, memberName),
  isCheckedIn: (classKey: string, memberName: string) => _isCheckedIn(classKey, memberName),
};

export type { ClassType, Member } from './mockData';
