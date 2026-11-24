/**
 * Security Rules Verification Suite (Dirty Dozen Payloads)
 * Intended for execution with @firebase/rules-unit-testing against Firestore Emulator.
 */
export interface DirtyDozenCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email: string; email_verified: boolean } | null;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_CASES: DirtyDozenCase[] = [
  {
    id: 1,
    name: 'Unauthenticated PII list scraping',
    operation: 'list',
    path: '/rsvps',
    auth: null,
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Authenticated non-host PII read',
    operation: 'get',
    path: '/rsvps/rsvp_001',
    auth: { uid: 'guest-1', email: 'guest@example.com', email_verified: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Spoofed host email with email_verified=false',
    operation: 'list',
    path: '/rsvps',
    auth: { uid: 'spoof-1', email: 'kacheracheal152@gmail.com', email_verified: false },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow field injection on create',
    operation: 'create',
    path: '/rsvps/rsvp_shadow',
    auth: null,
    payload: {
      fullName: 'Shadow Guest',
      email: 'shadow@example.com',
      attending: 'accept',
      guests: 1,
      message: 'Congrats!',
      language: 'en',
      isAdmin: true,
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'ID poisoning with invalid characters',
    operation: 'create',
    path: '/rsvps/bad$id!@#',
    auth: null,
    payload: {
      fullName: 'Bad Id Guest',
      email: 'badid@example.com',
      attending: 'accept',
      guests: 1,
      message: '',
      language: 'en',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Denial-of-wallet oversized message payload',
    operation: 'create',
    path: '/rsvps/rsvp_huge',
    auth: null,
    payload: {
      fullName: 'Big Message Guest',
      email: 'big@example.com',
      attending: 'accept',
      guests: 1,
      message: 'A'.repeat(2000),
      language: 'en',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Invalid email format rejected',
    operation: 'create',
    path: '/rsvps/rsvp_bademail',
    auth: null,
    payload: {
      fullName: 'No Email Guest',
      email: 'not-a-valid-email',
      attending: 'accept',
      guests: 1,
      message: '',
      language: 'en',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Declining guest with non-zero guest count',
    operation: 'create',
    path: '/rsvps/rsvp_badcount',
    auth: null,
    payload: {
      fullName: 'Decline Guest',
      email: 'decline@example.com',
      attending: 'decline',
      guests: 3,
      message: '',
      language: 'en',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Accepting guest with out-of-range guest count',
    operation: 'create',
    path: '/rsvps/rsvp_overcap',
    auth: null,
    payload: {
      fullName: 'Big Group',
      email: 'group@example.com',
      attending: 'accept',
      guests: 99,
      message: '',
      language: 'en',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Forged client timestamp on create',
    operation: 'create',
    path: '/rsvps/rsvp_forgedtime',
    auth: null,
    payload: {
      fullName: 'Time Traveler',
      email: 'time@example.com',
      attending: 'accept',
      guests: 1,
      message: '',
      language: 'en',
      createdAt: '2020-01-01T00:00:00Z',
      updatedAt: '2020-01-01T00:00:00Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Non-host attempting to update existing RSVP',
    operation: 'update',
    path: '/rsvps/rsvp_001',
    auth: { uid: 'guest-2', email: 'other@example.com', email_verified: true },
    payload: {
      attending: 'decline',
      guests: 0,
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Host attempting to mutate immutable createdAt field',
    operation: 'update',
    path: '/rsvps/rsvp_001',
    auth: { uid: 'host-uid', email: 'kacheracheal152@gmail.com', email_verified: true },
    payload: {
      createdAt: '2025-01-01T00:00:00Z',
    },
    expected: 'PERMISSION_DENIED',
  },
];
