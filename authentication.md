# authentication.md — AuthN / AuthZ

## Principle
Farmers: no account, no password, no OTP in MVP. Admins: real auth, no shortcuts.

## Farmer (anonymous profile)
**Problem:** in-app alerts need persistent profile, but we do not want to collect identity.

**Design:**
- On profile save, server issue random `profile_id` (UUIDv4) + opaque `profile_token` (256-bit random).
- Token stored in device (httpOnly, Secure, SameSite=Lax cookie preferred; localStorage fallback if cookie blocked).
- Server store only SHA-256 of token. Token = bearer for that one profile.
- Token grants: read own profile/alerts, edit/delete own profile. Nothing else.
- Public endpoints (schemes, notices) need no token.

**Tradeoffs (counter-argument, honest):**
- Clear browser data / new phone → lose profile. Accept; re-onboarding is 3 taps.
- Token theft = access to someone's district + crops (low sensitivity). Acceptable for prototype.
- Later (phone/SMS): add OTP login. Phone stored encrypted + blind index (encryption.md). Not in MVP.
- Never ask Aadhaar, bank, land record, PAN. Ever.

## Admin
- Provider: Supabase Auth or `fastapi-users`. Do not hand-roll password storage.
- Email + password + **MFA (TOTP)** for admin/reviewer roles.
- Password hash: Argon2id (or bcrypt cost ≥ 12) — provider-handled.
- Short-lived JWT (≤ 15 min) + refresh. Server verify signature, expiry, role on every call.
- Lockout / rate limit on login. Generic error messages.
- No shared accounts. Team members get named accounts. Revoke on leave.

## Roles (RBAC)
| Role | Can |
|------|-----|
| viewer | Read admin dashboard |
| reviewer | + approve/edit/reject extractions |
| admin | + manage sources, users, publish alerts |

Least privilege. Deny by default.

## API protections
- CORS allow-list (our frontend origin only).
- CSRF protection if cookies used for auth.
- Rate limit: per IP + per token. Stricter on profile-create and admin login.
- Input validation (Pydantic). Parameterized queries only.
- Admin routes separate prefix (`/admin/*`), auth dependency applied at router level, not per-handler.
- If Supabase: RLS **on** for every table. Service key only server-side, never in frontend.

## Audit
Log: login, failed login, role change, approve/reject, source edit, alert publish. Actor + time + target. No secrets in logs.

## Test checklist
- [ ] Anonymous cannot hit `/admin/*` (401).
- [ ] Viewer cannot approve (403).
- [ ] Token A cannot read profile B.
- [ ] Expired JWT rejected.
- [ ] Service key not in frontend bundle (grep build output).
