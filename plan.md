# Ω-Aurora Codex – QR Demo Accounts Transformation Plan

**Version:** 2.2  
**Last Updated:** 2025-01-22 08:47 UTC  
**Status:** Phase 0 COMPLETED ✅ | Phase 1 Ready to Start 🚀

---

## 1) Executive Summary

We are transforming the Ω-Aurora Codex from OAuth-first access to a **QR → instant demo account** flow for frictionless conference onboarding. Scanning a QR code opens a special activation URL that provisions an anonymous demo account (UUID-based), grants 100,000 tokens, and unlocks the Omega prompt generator for 72 hours.

**Key Features:**
- **Education section**: Public access (no authentication) with Czech philosophical content ✅ COMPLETED
- **Demo accounts**: 72h expiry, 100k tokens, instant activation via QR
- **Upgrade path**: After successful feedback, demo users can upgrade to full Google OAuth accounts
- **Admin tools**: QR token generation, user management, analytics
- **Compliance**: Full GDPR support (export/delete/audit)
- **Hidden features**: Phone verification kept server-side but hidden from demo UI

---

## 2) Current Status

### ✅ Phase 0 – Foundations & Content (COMPLETED)

**Completed Tasks:**
- ✅ Applied Ω-Aurora design tokens to global CSS and Tailwind config
  - Cosmic night background (#0a0f1d), quantum teal accent (#06d6a0), deep blue primary (#1e3a8a)
  - Inter typography, JetBrains Mono for code
  - Aurora gradient overlays (<20% viewport coverage)
  - Noise texture for depth (opacity: 0.03)
- ✅ Created OmegaLogo component (SVG with neural pathways, teal gradient, glow filter)
- ✅ Built EducationSelector component with Czech content
  - 3 documents: Ω⁻⁹ (Primordial), Ω⁻⁴ (Matrices), Ω∞ (Framework)
  - 3 perspectives per document: Child, Adult Non-Tech, Adult Tech
  - Two-pane layout: left sidebar (tabs + pills), right reader (max-w-prose)
  - Framer-motion animations with 220ms transitions
- ✅ Created public /education route (accessible without authentication)
- ✅ Set lang="cs" on education page for Czech language accessibility
- ✅ Added noise texture and aurora gradient to hero section
- ✅ Updated Navigation component with Ω logo and Education/Demo/Dashboard links
  - Responsive mobile menu with Sheet component
  - Active state indicators
  - User status display (demo badge, email)
- ✅ Verified frontend builds successfully without errors
- ✅ **Fixed Czech text encoding issue**:
  - Replaced educationTexts.js with proper UTF-8 encoded file
  - Fixed JavaScript syntax error (line 839: backtick issue)
  - Added missing exports (documentNames, perspectives)
- ✅ **Installed packages**:
  - framer-motion (animations)
  - react-markdown + remark-gfm (content rendering)
  - zustand (state management)

**Deliverables:**
- `/education` page fully functional at https://quantum-codex-1.preview.emergentagent.com/education
- Design system implemented per design_guidelines.md
- All shadcn/ui components integrated (Card, Tabs, Button, Badge, ScrollArea, Sheet)
- Framer-motion animations with reduced-motion support
- **Screenshot verified**: Czech text displays correctly with proper diacritics (ž, š, č, ř, etc.)

**Files Created/Modified:**
- `/app/frontend/src/index.css` - Complete design token system
- `/app/frontend/tailwind.config.js` - Extended Tailwind theme
- `/app/frontend/src/components/OmegaLogo.jsx` - Logo component
- `/app/frontend/src/components/EducationSelector.jsx` - Education UI
- `/app/frontend/src/pages/Education.jsx` - Education route
- `/app/frontend/src/components/Navigation.jsx` - Updated navigation
- `/app/frontend/src/hooks/useAuth.js` - Auth state management with Zustand
- `/app/frontend/src/data/educationTexts.js` - Czech content (UTF-8 encoded)

---

### 🚀 Phase 1 – Backend: QR Demo Accounts (READY TO START)

**Goal:** Implement QR activation system with 72h demo accounts and feedback collection

**Data Models (MongoDB, UUID IDs):**

```python
# users collection (updates to existing)
{
  "id": "uuid",
  "email": "string | null",
  "name": "string | null",
  "is_demo": "boolean",  # NEW: identifies demo accounts
  "demo_expires_at": "datetime | null",  # NEW: UTC, 72h from activation
  "is_admin": "boolean",
  "is_banned": "boolean",
  "phone_number": "string | null",
  "phone_verified": "boolean",  # Hidden from demo UI
  "referral_code": "string",
  "referred_by": "string | null",
  "omega_tokens_balance": "int",  # 100000 for demo accounts
  "created_at": "datetime",
  "google_id": "string | null"  # For OAuth upgrade
}

# demo_activation_tokens collection (NEW)
{
  "id": "uuid",
  "token": "string",  # Short unique code (8-12 chars, e.g., "OMEGA-2025-ABC")
  "label": "string",  # Admin label (e.g., "Prague Conference 2025")
  "created_by": "uuid",  # Admin user ID
  "max_activations": "int | null",  # null = unlimited
  "activations_count": "int",
  "status": "active | disabled | expired",
  "created_at": "datetime",
  "notes": "string | null"
}

# feedback collection (NEW)
{
  "id": "uuid",
  "user_id": "uuid",
  "rating": "int",  # 1-5 stars
  "comment": "string",
  "keywords": "array[string]",
  "created_at": "datetime"
}
```

**API Endpoints (FastAPI, all /api prefix):**

**Tasks:**
- [ ] **POST /api/demo/activate**
  - Body: `{ token: string, ref?: string }`
  - Validates token exists and status=active
  - Checks max_activations if set
  - Creates user: `{ is_demo: true, tokens_balance: 100000, demo_expires_at: now+72h }`
  - If ref provided: sets user.referred_by (referral tracking)
  - Increments token.activations_count
  - Issues JWT with claims: `{ sub, is_demo, demo_expires_at, exp }`
  - Returns: `{ user, jwt }`
  - Logs activation in audit_logs with IP address

- [ ] **GET /api/auth/me** (update existing)
  - Add fields: is_demo, demo_expires_at, tokens_balance
  - Returns full user object with demo status

- [ ] **POST /api/feedback** (new)
  - Body: `{ rating: int, comment: string, keywords: string[] }`
  - Requires auth (demo or full account)
  - Stores feedback with user_id and timestamp
  - Returns: `{ success: true }`
  - Triggers upgrade offer in frontend

- [ ] **POST /api/auth/google/upgrade** (new)
  - For demo users who want to upgrade after feedback
  - Body: `{ session_id }` from Emergent Auth
  - Links Google account to existing demo user
  - Sets is_demo=false, clears demo_expires_at
  - Preserves tokens_balance and generated prompts history
  - Returns updated user + new JWT

- [ ] **Middleware: Demo expiry guard**
  - On /api/generate/* endpoints:
    - If is_demo && now > demo_expires_at → 401 "demo_expired"
    - If !is_demo && !phone_verified && !is_admin → 403 "phone_verification_required"
  - On all authenticated endpoints: check JWT expiry and demo expiry

- [ ] **Admin QR Token Management:**
  - POST /api/admin/qr-tokens: `{ label, max_activations?, notes }` → generates token
  - GET /api/admin/qr-tokens: lists all tokens with stats (activations_count, status)
  - PUT /api/admin/qr-tokens/{id}: `{ status }` → disable/enable token
  - GET /api/admin/qr-tokens/{id}/export: returns QR code PNG + activation link

**Security:**
- Rate limiting: 10 activations per IP per hour on /api/demo/activate
- JWT stored in localStorage, sent via Authorization header (Safari-compatible)
- All datetimes use timezone.utc (Python: datetime.now(timezone.utc))
- UUID generation: uuid.uuid4() → str()

---

### 📋 Phase 2 – Frontend: Activation & Demo Flow (NOT STARTED)

**Goal:** Implement QR activation flow and demo chat interface with feedback collection

**Routes:**

**1. /demo/activate/:token (NEW)**
- [ ] Extract token from URL params
- [ ] Check for ?ref=CODE query param (referral tracking)
- [ ] Call POST /api/demo/activate with token and ref
- [ ] Store JWT in localStorage
- [ ] Redirect to /demo on success
- [ ] Show loading state during activation (skeleton + spinner)
- [ ] Error handling:
  - Invalid token → "This activation link is invalid"
  - Expired token → "This activation link has expired"
  - Max activations reached → "This activation link has been fully used"
  - Network error → "Connection failed. Please try again."

**2. /demo (UPDATE EXISTING)**

**Gating Logic:**
```javascript
if (!authenticated) {
  // Show: "Scan QR to Activate" panel with demo benefits
  return <DemoActivationPrompt />;
}

if (user.is_demo && now < user.demo_expires_at) {
  // Show: ChatInterface (generator unlocked)
  return <ChatInterface />;
}

if (user.is_demo && now >= user.demo_expires_at) {
  // Show: Expiration panel with Google OAuth upgrade CTA
  return <DemoExpiredPanel />;
}

if (!user.is_demo && !user.phone_verified && !user.is_admin) {
  // Show: Generator locked, phone verification prompt
  return <PhoneVerificationPrompt />;
}

if (user.is_admin) {
  // Show: ChatInterface (generator unlocked, bypass all checks)
  return <ChatInterface />;
}
```

**ChatInterface Component:**
- [ ] **Presets selector**: Customer Support, Lead Qualification, Content Planning, Market Research
- [ ] **3-stage generation flow**:
  1. **Clarifying Questions** (AI asks user about their needs)
  2. **Optimization Suggestions** (AI refines understanding)
  3. **Final Omega Prompt** (Markdown output, copy-paste ready)
- [ ] **Actions**:
  - Generate Agent button (primary CTA)
  - Copy Markdown button (copies final prompt to clipboard)
  - Clear conversation button (resets chat)
- [ ] **Message bubbles**:
  - User messages: right-aligned, bg-surface-2, rounded-br-sm
  - Assistant messages: left-aligned, transparent with border, rounded-bl-sm
- [ ] **Markdown rendering**: react-markdown with remark-gfm
- [ ] **Code blocks**: JetBrains Mono font, syntax highlighting
- [ ] **Token balance display**: Header shows remaining tokens with countdown
- [ ] **After successful generation** → Show feedback dialog

**Feedback Dialog:**
- [ ] **5-star rating component** (lucide-react Star icons)
- [ ] **Comment textarea** (optional, placeholder: "What did you think of the Omega prompt?")
- [ ] **Keywords input** (multi-select or comma-separated tags)
- [ ] **Submit button** → POST /api/feedback
- [ ] **On success** → Close feedback dialog, show Google OAuth upgrade dialog

**Google OAuth Upgrade Dialog:**
- [ ] **Headline**: "Save Your Progress & Get Updates"
- [ ] **Benefits list**:
  - ✓ Keep all your generated prompts
  - ✓ Receive future updates and improvements
  - ✓ No 72-hour expiry
  - ✓ Priority support
- [ ] **"Upgrade with Google" button** → Redirects to Emergent Auth flow
- [ ] **"Maybe Later" button** (dismissible, can be shown again)
- [ ] **After upgrade**: Redirect to /demo with success toast: "Account upgraded successfully!"

**Components Used:**
- Card, Textarea, Button, Tabs, Dialog, Badge, ScrollArea, Sonner (toasts)
- Lucide-react icons: Sparkles, Copy, Trash2, Star

**Data-testid Requirements:**
- `demo-activate-loading`
- `demo-chat-interface`
- `demo-preset-customer-support`, `demo-preset-lead-qualification`, etc.
- `demo-send-button`
- `demo-message-0`, `demo-message-1`, etc.
- `demo-copy-markdown-button`
- `demo-feedback-dialog`
- `demo-rating-1`, `demo-rating-2`, ..., `demo-rating-5`
- `demo-upgrade-dialog`
- `demo-upgrade-google-button`

---

### 🔧 Phase 3 – Admin: QR Token Generation (NOT STARTED)

**Goal:** Add QR token management to admin dashboard

**Admin Dashboard Updates:**

**1. QR Tokens Tab (NEW)**
- [ ] Add "QR Tokens" tab to admin navigation (between Users and Settings)
- [ ] Page layout:
  - **Header**: "Generate Token" button + "Batch Generate" button
  - **Table**: token, label, activations_count/max_activations, status, created_at, actions
  - **Actions per row**: Copy Link, Export QR (PNG), Disable/Enable, View Stats

**2. Generate Token Dialog:**
- [ ] **Fields**:
  - Label (required): Text input, e.g., "Prague Conference 2025"
  - Max Activations (optional): Number input or "Unlimited" checkbox
  - Notes (optional): Textarea for internal notes
- [ ] **Generate button** → POST /api/admin/qr-tokens
- [ ] **Success state**: Shows generated token and activation link
- [ ] **Download QR code button** → Calls /api/admin/qr-tokens/{id}/export
- [ ] **Copy link button** → Copies activation URL to clipboard with toast confirmation

**3. Batch Generate Dialog:**
- [ ] **Input**: Number of tokens (1-100)
- [ ] **Auto-labeling**: "Batch {timestamp} - {n}"
- [ ] **Generate button** → Creates N tokens via API
- [ ] **Downloads CSV** with columns: token, activation_link, label, created_at

**4. Users Management Updates:**
- [ ] **Add columns**:
  - is_demo badge (teal badge with "Demo" text)
  - demo_expires_at (formatted as "Expires in X hours" or "Expired")
  - tokens_balance (formatted with commas, e.g., "100,000")
- [ ] **Filter dropdown**: All | Demo Accounts | Full Accounts | Expired Demos
- [ ] **Actions**: Existing ban/unban + new "Adjust Tokens" action

**5. Settings Updates:**
- [ ] **Referral section**:
  - Toggle: "Enable referral rewards for demo activations"
  - Input: Token reward amount (default: 10,000)
- [ ] **Demo defaults section** (display only):
  - Expiry: 72 hours
  - Initial tokens: 100,000
  - (Note: "Contact support to change these values")

**Components Used:**
- Table, Dialog, Input, Button, Badge, Switch, Tabs, AlertDialog, Sonner

**Data-testid Requirements:**
- `admin-qr-tokens-tab`
- `admin-generate-token-button`
- `admin-batch-generate-button`
- `admin-token-row-{id}`
- `admin-copy-link-{id}`
- `admin-export-qr-{id}`
- `admin-disable-token-{id}`
- `admin-users-filter-demo`

---

### 🔒 Phase 4 – Security, Policies, Compliance (NOT STARTED)

**Goal:** Ensure security, GDPR compliance, and production readiness

**Tasks:**

**1. JWT & Authentication:**
- [ ] JWT claims structure: `{ sub: user_id, is_demo: bool, is_admin: bool, demo_expires_at: str, exp: int }`
- [ ] Axios interceptor: Auto-attach Authorization header from localStorage (already exists in /app/frontend/src/lib/axios.js)
- [ ] 401 handler: Clear JWT, redirect to /demo with "Session expired" message
- [ ] Token refresh: Implement refresh token flow (optional, for full accounts)

**2. Rate Limiting:**
- [ ] /api/demo/activate: 10 activations per IP per hour
- [ ] /api/generate/*: 20 requests per user per hour (demo), 100 per hour (full account)
- [ ] /api/feedback: 5 submissions per user per day
- [ ] Use Redis or in-memory store for rate limit tracking

**3. GDPR Compliance:**
- [ ] **GET /api/gdpr/export**: Include demo status, feedback, generated prompts, activation history
- [ ] **DELETE /api/gdpr/delete**: Soft-delete user, anonymize feedback (keep rating, remove comment/keywords)
- [ ] **Audit logs**: Log all demo activations with IP, user agent, token used, ref code
- [ ] **Data retention**: Auto-delete expired demo accounts after 30 days (background job)

**4. Environment Variables Check:**
- [ ] MONGO_URL: MongoDB connection string ✅ Already configured
- [ ] JWT_SECRET: Strong random secret (32+ chars)
- [ ] EMERGENT_LLM_KEY: For AI generation
- [ ] EMERGENT_AUTH_API_URL: For Google OAuth
- [ ] FRONTEND_URL: For CORS and redirect URLs
- [ ] REACT_APP_BACKEND_URL: Frontend env var ✅ Already configured
- [ ] No hardcoded values in code (verify with grep)

**5. CORS Configuration:**
- [ ] Ensure REACT_APP_BACKEND_URL whitelisted
- [ ] Allow credentials: true
- [ ] Specific origins (no wildcard in production)

**6. Logging & Monitoring:**
- [ ] Log demo activations: IP, token, ref, timestamp
- [ ] Log generator usage: user_id, prompt_name, tokens_consumed
- [ ] Log admin actions: QR token generation, user bans, token adjustments
- [ ] Set up alerts for unusual activity (e.g., >100 activations/hour)

---

### 🧪 Phase 5 – Testing & QA (NOT STARTED)

**Goal:** Comprehensive testing before deployment

**Backend Tests:**
- [ ] **Demo activation**:
  - Valid token → Success (user created, JWT issued)
  - Invalid token → 404 error
  - Expired token (status=expired) → 400 error
  - Max activations reached → 400 error
  - Referral code tracking (?ref=CODE)
- [ ] **Demo expiry**:
  - 72h calculation correct (timezone-aware UTC)
  - Generator blocked after expiry
  - Expiry check on every /api/generate/* request
- [ ] **Generator guards**:
  - Demo expired → 401 "demo_expired"
  - Non-demo without phone → 403 "phone_verification_required"
  - Admin bypass → Always allowed
- [ ] **Feedback submission**: Stored correctly with user_id
- [ ] **Google OAuth upgrade**: Demo → full account conversion, data preserved

**Frontend Tests:**
- [ ] **/demo/activate/:token flow**:
  - Loading state displays
  - Success → Redirect to /demo
  - Error states display correctly
- [ ] **ChatInterface**:
  - 3-stage generation works
  - Markdown renders correctly
  - Copy button copies to clipboard
  - Token balance updates after generation
- [ ] **Feedback → Upgrade flow**:
  - Feedback dialog opens after generation
  - Submit → Success toast
  - Upgrade dialog opens
  - "Maybe Later" dismisses dialog
- [ ] **Expiry panel**: Displays when demo expires
- [ ] **Admin QR token generation**: Token created, QR exported
- [ ] **Education page**: Czech text displays correctly ✅ VERIFIED

**E2E Happy Path:**
1. Admin generates QR token in admin dashboard
2. User scans QR → Opens /demo/activate/ABC123
3. Account created, redirected to /demo
4. User selects "Customer Support" preset
5. User completes 3-stage generation
6. User submits 5-star feedback
7. Upgrade dialog appears
8. User clicks "Upgrade with Google"
9. OAuth flow completes → Full account with preserved data

**Cross-browser Testing:**
- [ ] **Desktop**: Chrome, Firefox, Safari
- [ ] **Mobile**: Safari (iOS), Chrome (Android)
- [ ] Verify QR scanning works on mobile devices

**Accessibility Testing:**
- [ ] **Keyboard navigation**: Tab through all interactive elements
- [ ] **Screen reader**: ARIA labels on icons, dialogs announced properly
- [ ] **Focus visible**: 2px ring on all focusable elements (CSS: focus-visible) ✅ Implemented in index.css
- [ ] **Contrast**: WCAG AA (4.5:1) verified with axe DevTools
- [ ] **Lang attribute**: lang="cs" on education pages ✅ Implemented

---

### 🚀 Phase 6 – Deployment & Ops (NOT STARTED)

**Goal:** Deploy to preview and production

**Pre-deployment Checklist:**
- [ ] Run `yarn build` in /app/frontend (no errors) ✅ Currently building successfully
- [ ] Run `ruff check /app/backend` (no linting errors)
- [ ] Verify .env files (no hardcoded secrets in code)
- [ ] Check supervisor config (backend on 0.0.0.0:8001, frontend on 3000) ✅ Already configured
- [ ] Test demo activation flow locally
- [ ] Test admin QR token generation locally

**Preview Deployment:**
- [ ] Deploy to preview: https://quantum-codex-1.preview.emergentagent.com ✅ Already deployed
- [ ] **Smoke tests**:
  - Education page loads (public, no auth) ✅ VERIFIED
  - Demo activation with test token
  - Generator 3-stage flow
  - Feedback submission
  - Admin login and QR token generation
- [ ] Monitor logs: `tail -f /var/log/supervisor/*.log`
- [ ] Verify mobile Safari compatibility (critical for QR scanning)

**Production Deployment:**
- [ ] Deploy to omega-aurora.info (after preview validation)
- [ ] Update CORS for production domain
- [ ] Configure production SMS provider (for phone verification, hidden UI)
- [ ] Set up monitoring/alerts:
  - Demo activation rate spikes (>100/hour)
  - Error rate on /api/demo/activate (>5%)
  - Demo expiry rate without upgrade (>80%)

**Post-Deployment Monitoring:**
- [ ] Check activation logs for first 24 hours
- [ ] Verify QR codes work from printed materials
- [ ] Monitor user feedback ratings
- [ ] Track Google OAuth upgrade conversion rate

---

## 3) Technical Specifications

### API Contracts

**POST /api/demo/activate**
```json
Request:
{
  "token": "OMEGA-2025-ABC",
  "ref": "OMEGA-456"  // optional
}

Response (200 OK):
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "is_demo": true,
    "demo_expires_at": "2025-01-25T14:30:00Z",
    "tokens_balance": 100000,
    "created_at": "2025-01-22T14:30:00Z"
  },
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Errors:
- 404: Token not found
- 400: Token expired or max activations reached
- 429: Too many activation attempts (rate limit)
```

**POST /api/feedback**
```json
Request:
{
  "rating": 5,
  "comment": "Amazing tool for business consulting!",
  "keywords": ["business", "consulting", "ai", "prompts"]
}

Response (200 OK):
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

**POST /api/auth/google/upgrade**
```json
Request:
{
  "session_id": "emergent_session_xyz123"
}

Response (200 OK):
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "is_demo": false,
    "email": "user@example.com",
    "name": "John Doe",
    "tokens_balance": 95000,  // preserved from demo
    "google_id": "google_oauth_id_123"
  },
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**POST /api/admin/qr-tokens**
```json
Request:
{
  "label": "Prague AI Conference 2025",
  "max_activations": 50,
  "notes": "Main hall booth, distribute on Day 1"
}

Response (201 Created):
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "token": "OMEGA-2025-PRG",
  "label": "Prague AI Conference 2025",
  "activation_link": "https://omega-aurora.info/demo/activate/OMEGA-2025-PRG",
  "qr_code_url": "/api/admin/qr-tokens/660e8400-e29b-41d4-a716-446655440000/export",
  "max_activations": 50,
  "activations_count": 0,
  "status": "active",
  "created_at": "2025-01-22T10:00:00Z"
}
```

### Generator Access Policy

| User Type | Phone Verified | Demo Status | Generator Access |
|-----------|---------------|-------------|------------------|
| Demo (not expired) | N/A | Active | ✅ Unlocked |
| Demo (expired) | N/A | Expired | ❌ Blocked → Upgrade prompt |
| Full account | ❌ No | N/A | ❌ Blocked → Phone verify prompt |
| Full account | ✅ Yes | N/A | ✅ Unlocked |
| Admin | N/A | N/A | ✅ Unlocked (bypass all checks) |

### Referral System for Demo Accounts

**Activation URL Format:**
```
https://omega-aurora.info/demo/activate/OMEGA-2025-ABC?ref=OMEGA-456
```

**Backend Logic:**
1. Extract `ref` parameter from activation request
2. Look up referrer by referral_code
3. Store `referred_by` on new demo user
4. If referral rewards enabled in settings:
   - Credit referrer with configured token amount (default: 10,000)
   - Create token_transaction record
5. Track referral stats in admin dashboard

---

## 4) Success Criteria

### User Experience
- [ ] Conference visitor scans QR → generating Omega prompt in **<10 seconds** (≤2 clicks)
- [ ] Demo accounts expire **exactly 72 hours** after activation (UTC timezone-aware)
- [ ] Generator locked with **clear, friendly messaging** after expiry
- [ ] Feedback → Google OAuth upgrade flow is **intuitive and non-intrusive**
- [x] Education section is **readable and beautiful** (Czech text, proper spacing, contrast) ✅ VERIFIED

### Admin Experience
- [ ] Admin can generate QR tokens (single or batch) in **<30 seconds**
- [ ] Admin can export QR codes as **PNG** and activation links as **CSV**
- [ ] Admin can disable tokens and see **real-time activation counts**
- [ ] Admin can filter users by **demo/full/expired status**

### Technical
- [ ] **No hardcoded URLs or secrets** in codebase
- [ ] All /api routes functional via **REACT_APP_BACKEND_URL** ✅ Already configured
- [ ] JWT Authorization header works in **Safari** (mobile + desktop)
- [ ] GDPR export/delete operational for **demo accounts**
- [ ] Audit logs capture **all demo activations** and admin actions

### Design
- [x] UI adheres to **Ω-Aurora design guidelines** (colors, typography, spacing) ✅ IMPLEMENTED
- [x] All interactive elements have **data-testid attributes** ✅ IMPLEMENTED
- [x] Gradients **<20% viewport coverage**, never on reading areas ✅ IMPLEMENTED
- [x] **WCAG AA contrast ratios** met (4.5:1 minimum) ✅ IMPLEMENTED
- [x] Smooth animations with **prefers-reduced-motion fallback** ✅ IMPLEMENTED

---

## 5) Rollback Plan

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

## 6) Post-Launch Monitoring

**Metrics to Track:**
- Demo activation rate (per QR token)
- Generator usage by demo accounts
- Feedback submission rate
- Google OAuth upgrade conversion rate
- Demo account expiry and reactivation requests
- Token consumption patterns

**Alerts:**
- Spike in demo activations (>100/hour) → Potential abuse or viral spread
- High error rate on /api/demo/activate (>5%) → Token or backend issues
- Demo expiry rate >80% without upgrade → Improve upgrade CTA

---

## 7) Future Enhancements (Post-MVP)

**Not in current scope, documented for future:**
- Email notifications: 24h before demo expiry reminder
- Demo extension: Allow 1-time 24h extension via email opt-in
- Advanced referral analytics: Track conversion funnel per referrer
- Multi-language education: English translation of Ω documents
- Generator templates: Save and reuse custom presets
- Usage analytics dashboard for users: Show token consumption over time
- Payment integration: GoPay for token purchases (backend exists, needs UI)
- Webhook support: Notify external systems on demo activations

---

## 8) Next Immediate Actions

1. **Start Phase 1**: Implement backend QR activation system
   - Create demo_activation_tokens collection
   - Implement POST /api/demo/activate endpoint
   - Add is_demo and demo_expires_at fields to users collection
   - Implement demo expiry middleware

2. **Test Phase 1**: Verify activation flow works end-to-end
   - Create test QR token in database
   - Test activation via curl
   - Verify JWT claims include demo status

3. **Move to Phase 2**: Build frontend activation page
   - Create /demo/activate/:token route
   - Implement loading and error states
   - Test with Phase 1 backend

---

## 9) Known Issues & Resolutions

**Issue 1: Czech Text Encoding**
- **Problem**: educationTexts.js had character encoding issues (Å¾ instead of ž)
- **Root Cause**: File created with incorrect encoding during initial bulk write
- **Resolution**: Replaced file with properly UTF-8 encoded version from source ✅ FIXED
- **Verification**: Screenshot confirms Czech diacritics display correctly

**Issue 2: JavaScript Syntax Error**
- **Problem**: Line 839 had `:**` instead of `:` breaking template literal
- **Root Cause**: Typo in source file
- **Resolution**: Fixed via search_replace ✅ FIXED
- **Verification**: Frontend compiles without errors

**Issue 3: Missing Exports**
- **Problem**: EducationSelector couldn't import documentNames and perspectives
- **Root Cause**: Exports not included in educationTexts.js
- **Resolution**: Added exports for documentNames and perspectives ✅ FIXED
- **Verification**: Component renders correctly with document/perspective labels

---

**Plan Version:** 2.2  
**Last Updated:** 2025-01-22 08:47 UTC  
**Status:** Phase 0 COMPLETED ✅ | Phase 1 Ready to Start 🚀  
**Next Milestone:** Backend QR Demo Accounts Implementation
