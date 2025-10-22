# Ω-Aurora Codex – QR Demo Accounts Transformation Plan (Updated)

## 1) Executive Summary
We will pivot from OAuth-first access to a frictionless QR → special link → instant demo account flow while preserving all admin and compliance capabilities. Scanning a conference QR opens a special activation URL that provisions an anonymous demo account (UUID), grants 100,000 tokens, and unlocks the generator for 72 hours. Education remains public. After successful feedback submission, demo users are offered Google OAuth upgrade to convert to full accounts with future update notifications. Phone verification stays server-side but is hidden from demo users' UI. Referral is adapted to work with demo activations. Admin gains tools to generate/track QR activation tokens and manage demo users.

## 2) Objectives
- Zero-friction conference onboarding: Scan → Activate → Generate Omega prompt
- Preserve current admin dashboard and analytics; add QR token generation
- Keep GDPR/Privacy features intact (export/delete/audit)
- Hide phone verification for demo users; keep enforcement for non-demo users
- Adapt referral to demo accounts (optional ref capture on activation)
- **Offer Google OAuth upgrade after successful feedback submission** (not email opt-in)
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

## 4) Implementation Phases

### Phase 0 – Foundations & Content (Status: Not Started)
**Goal:** Apply Ω-Aurora design system and create public education section

**Tasks:**
- [ ] Apply design tokens from design_guidelines.md to global CSS/Tailwind config
- [ ] Create OmegaLogo component (SVG with neural pathways, teal accent)
- [ ] Build EducationSelector component with Czech content from educationTexts.js
  - 3 documents: Ω⁻⁹ (Primordial), Ω⁻⁴ (Matrices), Ω∞ (Framework)
  - 3 perspectives per doc: Child, Adult Non-Tech, Adult Tech
  - Two-pane layout: left tabs/pills, right reading pane (max-w-prose)
- [ ] Create /education route (public, no auth required)
- [ ] Set lang="cs" on education page for Czech content
- [ ] Add noise texture overlay and subtle aurora gradient to hero section (<20% viewport)

**Components Used:** Tabs, Card, ScrollArea, Badge, Separator, Button

---

### Phase 1 – Backend: QR Demo Accounts (Status: Not Started)
**Goal:** Implement QR activation system with 72h demo accounts

**Data Models (MongoDB, UUID IDs):**

```python
# users collection
{
  "id": "uuid",
  "email": "string | null",
  "name": "string | null", 
  "is_demo": "boolean",
  "demo_expires_at": "datetime | null",  # UTC, 72h from activation
  "is_admin": "boolean",
  "is_banned": "boolean",
  "phone_number": "string | null",
  "phone_verified": "boolean",
  "referral_code": "string",
  "referred_by": "string | null",
  "omega_tokens_balance": "int",  # 100000 for demo accounts
  "created_at": "datetime",
  "google_id": "string | null"  # For OAuth upgrade
}

# demo_activation_tokens collection
{
  "id": "uuid",
  "token": "string",  # Short unique code (8-12 chars)
  "label": "string",  # Admin label (e.g., "Prague Conference 2025")
  "created_by": "uuid",  # Admin user ID
  "max_activations": "int | null",  # null = unlimited
  "activations_count": "int",
  "status": "active | disabled | expired",
  "created_at": "datetime",
  "notes": "string | null"
}

# feedback collection (new)
{
  "id": "uuid",
  "user_id": "uuid",
  "rating": "int",  # 1-5
  "comment": "string",
  "keywords": "array[string]",
  "created_at": "datetime"
}
```

**API Endpoints (FastAPI, all /api prefix):**

**Tasks:**
- [ ] POST /api/demo/activate
  - Body: `{ token: string, ref?: string }`
  - Validates token exists and status=active
  - Checks max_activations if set
  - Creates user: `{ is_demo: true, tokens_balance: 100000, demo_expires_at: now+72h }`
  - If ref provided: sets user.referred_by (referral tracking)
  - Increments token.activations_count
  - Issues JWT with claims: `{ sub, is_demo, demo_expires_at }`
  - Returns: `{ user, jwt }`
  - Logs in audit_logs

- [ ] GET /api/auth/me (update existing)
  - Add fields: is_demo, demo_expires_at, tokens_balance
  - Returns full user object

- [ ] POST /api/feedback (new)
  - Body: `{ rating: int, comment: string, keywords: string[] }`
  - Requires auth (demo or full account)
  - Stores feedback with user_id
  - Returns: `{ success: true }`

- [ ] POST /api/auth/google/upgrade (new)
  - For demo users who want to upgrade after feedback
  - Body: `{ session_id }` from Emergent Auth
  - Links Google account to existing demo user
  - Sets is_demo=false, clears demo_expires_at
  - Preserves tokens_balance and generated prompts history
  - Returns updated user + new JWT

- [ ] Middleware: Demo expiry guard
  - On /api/generate/* endpoints: if is_demo && now > demo_expires_at → 401 "demo_expired"
  - On /api/generate/* endpoints: if !is_demo && !phone_verified && !is_admin → 403 "phone_verification_required"

- [ ] Admin QR Token Management:
  - POST /api/admin/qr-tokens: `{ label, max_activations?, notes }` → generates token
  - GET /api/admin/qr-tokens: lists all tokens with stats
  - PUT /api/admin/qr-tokens/{id}: `{ status }` → disable/enable token
  - GET /api/admin/qr-tokens/{id}/export: returns QR code PNG + activation link

**Security:**
- Rate limiting: 10 activations per IP per hour on /api/demo/activate
- JWT stored in localStorage, sent via Authorization header
- All datetimes use timezone.utc

---

### Phase 2 – Frontend: Activation & Demo Flow (Status: Not Started)
**Goal:** Implement QR activation flow and demo chat interface

**Routes:**
- [ ] /demo/activate/:token (new)
  - Extracts token from URL
  - Checks for ?ref=CODE query param
  - Calls POST /api/demo/activate
  - Stores JWT in localStorage
  - Redirects to /demo
  - Shows loading state during activation
  - Error handling: invalid token, expired token, max activations reached

- [ ] /demo (update existing)
  - **Gating logic:**
    - Not authenticated → Show "Scan QR to activate" panel with demo benefits
    - Authenticated demo + not expired → Show ChatInterface (unlocked)
    - Authenticated demo + expired → Show expiration panel with Google OAuth upgrade CTA
    - Authenticated full account + no phone verification → Generator locked, show phone verify prompt
    - Authenticated admin → Generator unlocked (bypass all checks)

**ChatInterface Component:**
- [ ] Presets selector: Customer Support, Lead Qualification, Content Planning, Market Research
- [ ] 3-stage generation flow:
  1. Clarifying Questions (user answers)
  2. Optimization Suggestions (user refines)
  3. Final Omega Prompt (Markdown output)
- [ ] Actions: Generate Agent button, Copy Markdown, Clear conversation
- [ ] Message bubbles: user (right, surface-2), assistant (left, transparent border)
- [ ] Markdown rendering with syntax highlighting (JetBrains Mono for code blocks)
- [ ] Token balance display in header
- [ ] After successful generation → Show feedback dialog

**Feedback Dialog:**
- [ ] 5-star rating component
- [ ] Comment textarea
- [ ] Keywords multi-select or input
- [ ] Submit → POST /api/feedback
- [ ] On success → Show Google OAuth upgrade dialog

**Google OAuth Upgrade Dialog:**
- [ ] Headline: "Save Your Progress & Get Updates"
- [ ] Benefits: Keep prompts, future updates, no expiry
- [ ] "Upgrade with Google" button → Emergent Auth flow
- [ ] "Maybe Later" option (dismissible)
- [ ] After upgrade: redirect to /demo with success toast

**Components Used:** Card, Textarea, Button, Tabs, Dialog, Badge, ScrollArea, Sonner (toasts)

**Data-testid requirements:**
- demo-activate-loading
- demo-chat-interface
- demo-preset-{preset-name}
- demo-send-button
- demo-message-{index}
- demo-copy-markdown-button
- demo-feedback-dialog
- demo-rating-{1-5}
- demo-upgrade-dialog
- demo-upgrade-google-button

---

### Phase 3 – Admin: QR Token Generation (Status: Not Started)
**Goal:** Add QR token management to admin dashboard

**Admin Dashboard Updates:**
- [ ] Add "QR Tokens" tab to admin navigation
- [ ] QR Tokens page layout:
  - Header: "Generate Token" button + batch generate option
  - Table: token, label, activations_count/max_activations, status, created_at, actions
  - Actions per row: Copy link, Export QR (PNG), Disable/Enable, View stats

**Generate Token Dialog:**
- [ ] Fields:
  - Label (required): "Prague Conference 2025"
  - Max Activations (optional): number input or "Unlimited"
  - Notes (optional): textarea
- [ ] Generate button → POST /api/admin/qr-tokens
- [ ] Shows generated token and activation link
- [ ] Download QR code button (calls /api/admin/qr-tokens/{id}/export)

**Batch Generate:**
- [ ] Input: number of tokens (1-100)
- [ ] Generates N tokens with auto-labels "Batch {timestamp} - {n}"
- [ ] Downloads CSV with all activation links

**Users Management Updates:**
- [ ] Add columns: is_demo badge, demo_expires_at, tokens_balance
- [ ] Filter: All | Demo | Full Accounts | Expired Demos
- [ ] Actions: existing ban/unban + adjust tokens

**Settings Updates:**
- [ ] Referral section: Enable referral rewards for demo activations (toggle)
- [ ] Demo defaults: 72h expiry, 100k tokens (display only, not editable for now)

**Components Used:** Table, Dialog, Input, Button, Badge, Switch, Tabs, AlertDialog

**Data-testid requirements:**
- admin-qr-tokens-tab
- admin-generate-token-button
- admin-token-row-{id}
- admin-export-qr-{id}
- admin-disable-token-{id}

---

### Phase 4 – Security, Policies, Compliance (Status: Not Started)
**Goal:** Ensure security, GDPR compliance, and production readiness

**Tasks:**
- [ ] JWT claims structure: `{ sub: user_id, is_demo, is_admin, demo_expires_at, exp }`
- [ ] Axios interceptor: auto-attach Authorization header from localStorage
- [ ] 401 handler: clear JWT, redirect to /demo with "Session expired" message
- [ ] Rate limiting:
  - /api/demo/activate: 10 per IP per hour
  - /api/generate: 20 per user per hour (demo), 100 per user per hour (full account)
- [ ] GDPR endpoints (keep existing):
  - GET /api/gdpr/export: include demo status, feedback, generated prompts
  - DELETE /api/gdpr/delete: soft-delete user, anonymize feedback
- [ ] Audit logging:
  - Log demo activations with IP, token used, ref code
  - Log generator usage with prompt name, tokens consumed
  - Log admin QR token generation and disabling
- [ ] CORS: ensure REACT_APP_BACKEND_URL whitelisted
- [ ] Environment variables check:
  - MONGO_URL, JWT_SECRET, EMERGENT_LLM_KEY
  - EMERGENT_AUTH_API_URL, FRONTEND_URL
  - No hardcoded values in code

---

### Phase 5 – Testing & QA (Status: Not Started)
**Goal:** Comprehensive testing before deployment

**Backend Tests:**
- [ ] Demo activation: valid token, invalid token, expired token, max activations reached
- [ ] Demo expiry: 72h calculation, timezone-aware UTC
- [ ] Generator guards: demo expired, non-demo without phone, admin bypass
- [ ] Referral tracking: ?ref=CODE on activation
- [ ] Feedback submission and storage
- [ ] Google OAuth upgrade: demo → full account conversion

**Frontend Tests:**
- [ ] /demo/activate/:token flow with loading/error states
- [ ] ChatInterface: 3-stage generation, markdown rendering, copy button
- [ ] Feedback dialog → Google OAuth upgrade dialog flow
- [ ] Token balance updates after generation
- [ ] Expiry panel display when demo expires
- [ ] Admin QR token generation and export

**E2E Happy Path:**
1. Scan QR → /demo/activate/ABC123
2. Account created, redirected to /demo
3. Select preset, generate 3-stage Omega prompt
4. Submit feedback
5. Offered Google OAuth upgrade
6. Upgrade → full account with preserved data

**Cross-browser:**
- [ ] Desktop: Chrome, Firefox, Safari
- [ ] Mobile: Safari (iOS), Chrome (Android)

**Accessibility:**
- [ ] Keyboard navigation: Tab through all interactive elements
- [ ] Screen reader: ARIA labels on icons, dialogs announced
- [ ] Focus visible: 2px ring on all focusable elements
- [ ] Contrast: WCAG AA (4.5:1) verified with axe DevTools

---

### Phase 6 – Deployment & Ops (Status: Not Started)
**Goal:** Deploy to preview and production

**Pre-deployment:**
- [ ] Run frontend build: `yarn build` (no errors)
- [ ] Run backend lint: `ruff check backend/` (no errors)
- [ ] Verify .env files (no hardcoded secrets in code)
- [ ] Check supervisor config (backend on 8001, frontend on 3000)

**Deployment:**
- [ ] Deploy to preview: https://quantum-codex-1.preview.emergentagent.com
- [ ] Smoke test:
  - Education page loads (public)
  - Demo activation with test token
  - Generator 3-stage flow
  - Admin login and QR token generation
- [ ] Monitor logs: `tail -f /var/log/supervisor/*.log`
- [ ] Verify mobile Safari compatibility

**Production Deployment:**
- [ ] Deploy to omega-aurora.info (when preview validated)
- [ ] Update CORS if needed
- [ ] Configure production SMS provider (for phone verification, hidden UI)
- [ ] Set up monitoring/alerts for demo activation rate spikes

---

## 5) Technical Details

### Collections Schema
```javascript
// users
{
  id: UUID,
  email: string | null,
  name: string | null,
  is_demo: boolean,
  demo_expires_at: datetime | null,
  is_admin: boolean,
  is_banned: boolean,
  phone_number: string | null,
  phone_verified: boolean,
  referral_code: string,
  referred_by: string | null,
  omega_tokens_balance: int,
  created_at: datetime,
  google_id: string | null
}

// demo_activation_tokens
{
  id: UUID,
  token: string,
  label: string,
  created_by: UUID,
  max_activations: int | null,
  activations_count: int,
  status: 'active' | 'disabled' | 'expired',
  created_at: datetime,
  notes: string | null
}

// feedback
{
  id: UUID,
  user_id: UUID,
  rating: int,
  comment: string,
  keywords: string[],
  created_at: datetime
}

// generated_prompts (existing)
// token_transactions (existing)
// audit_logs (existing)
// settings (existing)
```

### API Contracts

**POST /api/demo/activate**
```json
Request: { "token": "ABC123XYZ", "ref": "OMEGA-456" }
Response: {
  "user": {
    "id": "uuid",
    "is_demo": true,
    "demo_expires_at": "2025-01-25T14:30:00Z",
    "tokens_balance": 100000
  },
  "jwt": "eyJ..."
}
```

**POST /api/feedback**
```json
Request: {
  "rating": 5,
  "comment": "Amazing tool!",
  "keywords": ["business", "consulting", "ai"]
}
Response: { "success": true }
```

**POST /api/auth/google/upgrade**
```json
Request: { "session_id": "emergent_session_xyz" }
Response: {
  "user": { "id": "uuid", "is_demo": false, "email": "user@example.com" },
  "jwt": "eyJ..."
}
```

**POST /api/admin/qr-tokens**
```json
Request: {
  "label": "Prague Conference 2025",
  "max_activations": 50,
  "notes": "Main hall booth"
}
Response: {
  "id": "uuid",
  "token": "ABC123XYZ",
  "activation_link": "https://omega-aurora.info/demo/activate/ABC123XYZ",
  "qr_code_url": "/api/admin/qr-tokens/{id}/export"
}
```

### Generator Policy
| User Type | Phone Verified | Generator Access |
|-----------|---------------|------------------|
| Demo (not expired) | N/A | ✅ Unlocked |
| Demo (expired) | N/A | ❌ Blocked (upgrade prompt) |
| Full account | ❌ No | ❌ Blocked (phone verify prompt) |
| Full account | ✅ Yes | ✅ Unlocked |
| Admin | N/A | ✅ Unlocked (bypass) |

### Referral for Demo Accounts
- Activation URL: `/demo/activate/ABC123?ref=OMEGA-456`
- Backend: stores `referred_by` on user creation
- Optional: reward referrer with tokens (configurable in admin settings)
- Tracking: admin dashboard shows referral stats per demo activation

---

## 6) Success Criteria

**User Experience:**
- [ ] Conference visitor scans QR → generating Omega prompt in <10 seconds (≤2 clicks after scan)
- [ ] Demo accounts expire exactly 72h after activation (UTC timezone-aware)
- [ ] Generator locked with clear messaging after expiry
- [ ] Feedback → Google OAuth upgrade flow is intuitive and non-intrusive
- [ ] Education section readable and beautiful (Czech text, proper spacing, contrast)

**Admin Experience:**
- [ ] Admin can generate QR tokens (single or batch) in <30 seconds
- [ ] Admin can export QR codes as PNG and activation links as CSV
- [ ] Admin can disable tokens and see real-time activation counts
- [ ] Admin can filter users by demo/full/expired status

**Technical:**
- [ ] No hardcoded URLs or secrets in codebase
- [ ] All /api routes functional via REACT_APP_BACKEND_URL
- [ ] JWT Authorization header works in Safari (mobile + desktop)
- [ ] GDPR export/delete operational for demo accounts
- [ ] Audit logs capture all demo activations and admin actions

**Design:**
- [ ] UI adheres to Ω-Aurora design guidelines (colors, typography, spacing)
- [ ] All interactive elements have data-testid attributes
- [ ] Gradients <20% viewport coverage, never on reading areas
- [ ] WCAG AA contrast ratios met
- [ ] Smooth animations with prefers-reduced-motion fallback

---

## 7) Current Status

**Completed:**
- ✅ Design guidelines created (design_guidelines.md)
- ✅ Education content prepared (educationTexts.js with Czech text)
- ✅ Existing infrastructure: FastAPI backend, React frontend, MongoDB, JWT auth

**In Progress:**
- None (awaiting approval to start implementation)

**Blocked:**
- None

**Next Immediate Actions:**
1. Start Phase 0: Apply design tokens and create OmegaLogo component
2. Build EducationSelector with Czech content
3. Create public /education route
4. Then move to Phase 1: Backend QR activation system

---

## 8) Rollback Plan

**If deployment fails:**
- Previous version available via Emergent platform version history
- No database migrations (only additive fields), safe to rollback
- Environment variables unchanged from previous deployment
- Contact Emergent support if critical issues arise

**Data safety:**
- All new collections (demo_activation_tokens, feedback) are additive
- Existing users/prompts/transactions unchanged
- Rollback will not affect existing user accounts

---

## 9) Post-Launch Monitoring

**Metrics to track:**
- Demo activation rate (per QR token)
- Generator usage by demo accounts
- Feedback submission rate
- Google OAuth upgrade conversion rate
- Demo account expiry and reactivation requests
- Token consumption patterns

**Alerts:**
- Spike in demo activations (>100/hour) → potential abuse
- High error rate on /api/demo/activate → token issues
- Demo expiry rate >80% without upgrade → improve upgrade CTA

---

## 10) Future Enhancements (Post-MVP)

**Not in current scope, but documented for future:**
- Email notifications: 24h before demo expiry reminder
- Demo extension: Allow 1-time 24h extension via email opt-in
- Advanced referral analytics: Track conversion funnel per referrer
- Multi-language education: English translation of Ω documents
- Generator templates: Save and reuse custom presets
- Usage analytics dashboard for users: Show token consumption over time
- Payment integration: GoPay for token purchases (backend exists, needs UI)

---

**Plan Version:** 2.0 (Updated for Google OAuth upgrade after feedback)  
**Last Updated:** 2025-01-22  
**Status:** Ready for Implementation
