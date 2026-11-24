# Security Specification — Racheal Kache Graduation 2026 RSVP

## 1. Data Invariants

1. **Strict PII Isolation**: `/rsvps/{rsvpId}` documents contain guest PII (`email`). Only the verified host (`request.auth.token.email == 'kacheracheal152@gmail.com'` with `request.auth.token.email_verified == true`) may `get`, `list`, `update`, or `delete` RSVP documents. Unauthenticated users and non-host signed-in users can never read or list any guest RSVP.
2. **Public Submission Dropbox**: Invited guests may `create` a new document at `/rsvps/{rsvpId}` without signing in, provided the document ID passes `isValidId(rsvpId)` and the payload strictly satisfies `isValidRsvp(incoming())`.
3. **Zero Shadow Fields**: Incoming RSVP payloads must contain all and only the exact 8 declared keys: `fullName`, `email`, `attending`, `guests`, `message`, `language`, `createdAt`, `updatedAt`.
4. **Domain & Volumetric Constraints**:
   - `fullName`: non-empty string, `1 <= size <= 120`
   - `email`: valid email pattern `^[^\s@]+@[^\s@]+\.[^\s@]+$`, `3 <= size <= 160`
   - `attending`: `'accept'` or `'decline'`
   - `guests`: integer, `1 <= guests <= 4` when `attending == 'accept'`, strictly `0` when `attending == 'decline'`
   - `message`: string, `size <= 1000`
   - `language`: `'en'` or `'fr'`
5. **Temporal Integrity & Immutability**:
   - On `create`: `createdAt == request.time` and `updatedAt == request.time`
   - On `update` (host-only): `createdAt == existing().createdAt` (immutable) and `updatedAt == request.time`
6. **Global Default-Deny**: All undeclared collections and paths are explicitly denied for read and write.

## 2. The "Dirty Dozen" Adversarial Payloads

| # | Attack Vector | Operation | Payload / Context | Expected Result |
|---|---|---|---|---|
| 1 | Unauthenticated PII Scraping | `list /rsvps` | Unauthenticated client | `PERMISSION_DENIED` |
| 2 | Authenticated Non-Host PII Read | `get /rsvps/rsvp_1` | Signed in as `guest@example.com` (verified) | `PERMISSION_DENIED` |
| 3 | Host Email Spoofing (Unverified) | `list /rsvps` | Signed in as `kacheracheal152@gmail.com` with `email_verified: false` | `PERMISSION_DENIED` |
| 4 | Shadow Field Injection | `create /rsvps/rsvp_shadow` | Valid RSVP + `isAdmin: true` | `PERMISSION_DENIED` |
| 5 | ID Poisoning (Oversized/Illegal ID) | `create /rsvps/bad$id!...` | Valid RSVP payload with invalid doc ID | `PERMISSION_DENIED` |
| 6 | Denial-of-Wallet Oversized Message | `create /rsvps/rsvp_big` | `message` string of 50,000 chars | `PERMISSION_DENIED` |
| 7 | Invalid Email Format | `create /rsvps/rsvp_bademail` | `email: "not-an-email"` | `PERMISSION_DENIED` |
| 8 | Attending/Guests Invariant Violation | `create /rsvps/rsvp_badcount` | `attending: "decline", guests: 4` | `PERMISSION_DENIED` |
| 9 | Out-of-Range Guest Count | `create /rsvps/rsvp_many` | `attending: "accept", guests: 99` | `PERMISSION_DENIED` |
| 10 | Forged Client Timestamp | `create /rsvps/rsvp_time` | `createdAt: Timestamp(2020-01-01)` instead of serverTimestamp | `PERMISSION_DENIED` |
| 11 | Unauthorized Update by Guest | `update /rsvps/rsvp_1` | Non-host tries to modify another guest's RSVP | `PERMISSION_DENIED` |
| 12 | Immutable Field Tampering by Host | `update /rsvps/rsvp_1` | Host tries to change `createdAt` during update | `PERMISSION_DENIED` |
