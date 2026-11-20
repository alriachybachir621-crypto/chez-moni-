/**
 * Phase 0 Payload-First Security Test Cases for Chez Moni Firestore Rules.
 * Verifies Dirty Dozen adversarial payloads against the hardened schema rules.
 */
export interface SecurityTestCase {
  name: string;
  path: string;
  authEmail: string | null;
  operation: 'create' | 'update' | 'delete' | 'get';
  payload?: Record<string, unknown>;
  expected: 'ALLOW' | 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_CASES: SecurityTestCase[] = [
  {
    name: 'Unauthenticated product creation',
    path: '/products/prod_1',
    authEmail: null,
    operation: 'create',
    payload: { id: 'prod_1', name: 'Test', price: 10 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Non-owner authenticated product creation',
    path: '/products/prod_1',
    authEmail: 'customer@example.com',
    operation: 'create',
    payload: { id: 'prod_1', name: 'Test', price: 10 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Non-owner category deletion',
    path: '/categories/smartwatches',
    authEmail: 'customer@example.com',
    operation: 'delete',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Non-owner settings update',
    path: '/settings/shop',
    authEmail: 'customer@example.com',
    operation: 'update',
    payload: { heroTitle: 'Hacked' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Shadow field injection on product',
    path: '/products/prod_1',
    authEmail: 'admin@chezmoni.app',
    operation: 'create',
    payload: { id: 'prod_1', name: 'Watch', price: 25, shadowHack: true },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Invalid document ID poisoning',
    path: '/products/invalid$id!',
    authEmail: 'admin@chezmoni.app',
    operation: 'create',
    payload: { id: 'invalid$id!', name: 'Watch', price: 25 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Negative price injection',
    path: '/products/prod_neg',
    authEmail: 'admin@chezmoni.app',
    operation: 'create',
    payload: { id: 'prod_neg', name: 'Watch', price: -5 },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Oversized description exhaustion (> 1500 chars)',
    path: '/products/prod_big',
    authEmail: 'admin@chezmoni.app',
    operation: 'create',
    payload: { id: 'prod_big', name: 'Watch', price: 25, description: 'a'.repeat(1501) },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Empty product images array',
    path: '/products/prod_noimg',
    authEmail: 'admin@chezmoni.app',
    operation: 'create',
    payload: { id: 'prod_noimg', name: 'Watch', price: 25, images: [] },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Immutable createdAt mutation attempt',
    path: '/products/prod_1',
    authEmail: 'admin@chezmoni.app',
    operation: 'update',
    payload: { createdAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Arbitrary settings document creation',
    path: '/settings/backdoor',
    authEmail: 'admin@chezmoni.app',
    operation: 'create',
    payload: { heroTitle: 'Backdoor' },
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Public product catalog read allowed',
    path: '/products/prod_1',
    authEmail: null,
    operation: 'get',
    expected: 'ALLOW',
  },
];
