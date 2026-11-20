# Chez Moni Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. Public catalog (`/products/{productId}`), categories (`/categories/{categoryId}`), and store settings (`/settings/{settingId}`) are publicly readable for storefront visitors.
2. All write operations (`create`, `update`, `delete`) across `/products`, `/categories`, and `/settings` are strictly restricted to `request.auth != null && request.auth.token.email == "admin@chezmoni.app"`.
3. Every document ID must satisfy `^[a-zA-Z0-9_-]+$` and `size <= 128`.
4. Products must pass `isValidProduct`, enforcing strict key allowlists (`hasAll` + `hasOnly`), bounded string lengths, positive bounded prices, bounded `colors` (<= 12) and `images` (1..10) arrays, immutable `createdAt`, and server timestamp `request.time`.
5. Categories must pass `isValidCategory`, enforcing strict key allowlists, slug regex, bounded string lengths, and server timestamp `request.time`.
6. Settings (`shop` document only) must pass `isValidShopSettings`, enforcing strict key allowlists, bounded URLs/strings, bounded `heroImages` (<= 8), and server timestamp `request.time`.
7. Firebase Storage allows public read and restricts all writes to `request.auth != null && request.auth.token.email == "admin@chezmoni.app"`.

## 2. The "Dirty Dozen" Adversarial Payloads
1. Unauthenticated write to `/products/p1` -> DENIED.
2. Authenticated non-admin (`user@example.com`) write to `/products/p1` -> DENIED.
3. Authenticated non-admin delete on `/categories/smartwatches` -> DENIED.
4. Authenticated non-admin update on `/settings/shop` -> DENIED.
5. Admin write with shadow field (`isFeaturedHack: true`) on `/products/p1` -> DENIED by `hasOnly`.
6. Admin write with invalid document ID (`../etc/passwd` or > 128 chars) -> DENIED by `isValidId`.
7. Admin write with negative product price (`price: -5`) -> DENIED by `price >= 0`.
8. Admin write with oversized description (> 1500 chars) -> DENIED by `.size() <= 1500`.
9. Admin write with unbounded `images` array (> 10 items) or empty `images` array -> DENIED.
10. Admin update attempting to mutate `createdAt` on `/products/p1` -> DENIED by immutability check.
11. Admin write with forged client timestamp (`updatedAt` != `request.time`) -> DENIED.
12. Admin write to arbitrary settings document `/settings/backdoor` (not `shop`) -> DENIED.
