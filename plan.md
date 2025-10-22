# Ω-Aurora Codex – QR Demo Accounts Transformation Plan

## 1) Executive Summary
We will pivot from OAuth-first access to a frictionless QR → special link → instant demo account flow while preserving all admin and compliance capabilities. Scanning a conference QR opens a special activation URL that provisions an anonymous demo account (UUID), grants 100,000 tokens, and unlocks the generator for 72 hours. Education remains public. Existing Google OAuth remains as an upgrade path to a full account. Phone verification stays server-side but is hidden from demo users’ UI. Referral is adapted to work with demo activations. Admin gains tools to generate/track QR activation tokens and manage demo users.

## 2) Objectives
- Zero-friction conference onboarding: Scan → Activate → Generate Omega prompt
- Preserve current admin dashboard and analytics; add QR token generation
- Keep GDPR/Privacy features intact (export/delete/audit)
- Hide phone verification for demo users; keep enforcement for non-demo users
- Adapt referral to demo accounts (optional ref capture on activation)
- Offer email collection after successful feedback submission
- Follow Ω-Aurora design guidelines (cosmic/aurora theme) with testable, accessible UI

## 3) UI/UX Design Guidelines (aligned with design_guidelines.md)
- Palette (per guidelines):
  - background: #0a0f1d (cosmic night)
  - primary: #1e3a8a (deep blue)
  - accent: #06d6a0 (quantum teal)
  - foreground: #e6f1ff; borders: #25365a; surfaces: #10172a / #0f1b33
  - Gradients: aurora_horizon/teal_breeze/polar_mist with coverage <20% viewport, never on reading blocks
- Typography: Inter (UI, headings), JetBrains Mono (code/prompt). Education pages set lang=cs
- Components: Use shadcn/ui from /frontend/src/components/ui only (Button, Tabs, Card, ScrollArea, Sonner, Dialog, Table, etc.)
- Navigation: Ω logo left; nav items: Education | Demo | Dashboard; keys/profile on right
- Accessibility: WCAG AA contrast, visible focus rings, keyboard navigation
- Testing: data-testid on all interactive/critical elements (e.g., demo-send-button)
- Motion: framer-motion micro-interactions; animate opacity/transform only; respect prefers-reduced-motion
- Data states: Explicit loading (skeleton), empty, and error states for chat, education loader, and admin tables

## 4) Implementation Steps (Phased)

Phase 0 – Foundations & Content
- Apply design tokens and global styles per design_guidelines.md
- Integrate EducationSelector with the provided educationTexts (Ω⁻⁹|Ω⁻⁴|Ω∞ × child/adult-nontech/adult-tech)
- Public route /education with two-pane layout (tabs + reader), max-w-prose reading width

Phase 1 – Backend: QR Demo Accounts
- Data models (Mongo, UUID IDs):
  - users: id, is_demo (bool), demo_expires_at (UTC), email (nullable), email_optin (bool), phone_verified, tokens_balance (int), referred_by (nullable), created_at (UTC)
  - demo_activation_tokens: id, token (short unique), created_by (admin id), max_activations (int, default unlimited or configured), activations_count (int), status (active|disabled|expired), created_at (UTC)
  - generated_prompts, token_transactions, audit_logs, settings (reuse existing)
- Endpoints (FastAPI, all prefixed /api):
  - POST /api/demo/activate: body { token } → validate token; create user { is_demo=true, tokens_balance=100000, demo_expires_at=now+72h }; issue JWT; increment token activations_count; return user + jwt
  - GET /api/auth/me: include is_demo, demo_expires_at, tokens_balance
  - Middleware/guard: On generator endpoints, if is_demo → ensure now < demo_expires_at; else 401 with reason "demo_expired". For non-demo: generator requires phone_verified or is_admin
  - POST /api/feedback: body { rating, comment, keywords } → store; returns ok
  - POST /api/email-optin: body { email } → attach to current user; validate minimal format
  - Referral (optional): activation reads ?ref=CODE → store on user.referred_by; record a token_transaction reward if configured in settings
- Logging/audit: log /demo/activate and generator usage in audit_logs

Phase 2 – Frontend: Activation & Demo Flow
- Route /demo/activate/:token → calls POST /api/demo/activate, stores JWT (Authorization header via axios interceptor), then redirect to /demo
- Demo page gating:
  - If authenticated demo and not expired → show ChatInterface (generator unlocked)
  - If not authenticated → show “Activate via QR” instructions and optional OAuth upgrade CTA
  - If demo expired → show expiration panel with upgrade path (Google OAuth) or request new QR
- ChatInterface updates:
  - Presets: Customer Support, Lead Qualification, Content Planning, Market Research
  - 3-stage flow: Clarifying Questions → Optimization Suggestions → Final Omega Prompt (Markdown)
  - Actions: Generate Agent, Copy Markdown, Clear; Success toast via Sonner
  - After feedback submission success, open Email Opt-in dialog
- Education remains public (no auth), accessible from nav

Phase 3 – Admin Enhancements
- Admin Dashboard: Add “QR Tokens” tab
  - Generate tokens: fields { label, max_activations?, notes }
  - List tokens: token, activations_count, status, created_at; actions: disable, export QR (PNG/SVG) and CSV of links
  - Token link format: {FRONTEND_URL}/demo/activate/{token}
  - Optionally batch-generate N tokens
- Users management: show is_demo, demo_expires_at, tokens_balance; actions: ban/unban, adjust tokens
- Settings: referral reward for demo activations; toggle Google OAuth upgrade CTA visibility

Phase 4 – Security, Policies, Compliance
- JWT claims: { sub, is_demo, is_admin, demo_expires_at }
- Enforce Authorization header (Safari-compatible) via axios interceptor
- GDPR endpoints kept: export, delete; ensure demo users are deletable
- CORS unchanged; bind FastAPI to 0.0.0.0:8001; all routes under /api
- Rate limits (basic) on /api/demo/activate and /api/generate to mitigate abuse at conferences

Phase 5 – Testing & QA
- Unit tests for activation expiry math (timezone-aware UTC)
- E2E happy path: QR scan → activation → chat 3-stage → feedback → email opt-in
- E2E expired demo guard; non-demo generator blocked (unless phone_verified or admin)
- Admin token generation, QR export, token disable
- Frontend lint/bundle check; visual review against design guidelines

Phase 6 – Deployment & Ops
- No .env changes in code; ensure production env has required vars already
- Deploy preview, validate flows at https://quantum-codex-1.preview.emergentagent.com
- Monitor logs; verify mobile Safari demo activation → generator usage

## 5) Technical Details
- UUID usage for all new IDs; timezone-aware datetimes with timezone.utc
- Collections: users, demo_activation_tokens, generated_prompts, token_transactions, audit_logs, settings (existing + additions)
- Core API contracts (JSON):
  - POST /api/demo/activate → { token } ⇒ { user: {id,is_demo,demo_expires_at,tokens_balance}, jwt }
  - GET /api/auth/me → { id, is_admin, is_demo, demo_expires_at, tokens_balance, phone_verified }
  - POST /api/feedback → { rating:int, comment:string, keywords:string[] }
  - POST /api/email-optin → { email }
  - Admin: POST /api/admin/qr-tokens, GET /api/admin/qr-tokens, PUT /api/admin/qr-tokens/{id} (disable)
- Generator policy:
  - Demo users: generator unlocked until expiry; token usage decremented per request
  - Non-demo users: generator locked unless phone_verified=true or is_admin=true
- Referral for demo:
  - If ?ref=CODE present at activation → set user.referred_by; optional reward via settings.referral_reward
- Storage & security:
  - Store JWT in localStorage; send via Authorization header; backend also supports httpOnly cookie if present
  - Audit every activation and admin changes

## 6) Next Actions
- Confirm admin UX for QR token generation (single vs batch, export formats)
- Confirm whether demo_activation_tokens have max_activations or unlimited per code
- Approve 72h expiry and 100k token default as constants in settings
- Approve post-feedback email opt-in UX copy and fields
- Approve referral rules for demo activations
- After approval: implement Phases 0–2 first, then Phase 3 admin, then testing

## 7) Success Criteria
- Conference visitor can scan QR and within 10 seconds be generating an Omega prompt (≤2 clicks)
- Demo accounts expire exactly 72h after activation; generator blocked with clear messaging post-expiry
- Education readable and beautiful under Ω-Aurora guidelines (contrast, spacing, tokens)
- Admin can generate/export QR tokens and see activations in dashboard
- GDPR flows operational (export/delete)
- No hardcoded URLs or secrets; all /api routes functional via REACT_APP_BACKEND_URL
- UI adheres to data-testid policy and passes basic E2E checks
