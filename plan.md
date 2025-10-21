# Ω-Aurora-Codex-MVP — Comprehensive Implementation Plan

## 1) Executive Summary
Ω-Aurora-Codex is a polished, conference-ready educational and AI demo application built on FastAPI (Python) + React + MongoDB. The MVP delivers:
- Education explorer at /education with 3 documents (Ω⁻⁹ Primordial Logic, Ω⁻⁴ Matrices, Ω∞ Framework) × 3 perspectives (Child 10, Adult Non-Tech, Adult Tech) — 9 total text blocks (provided).
- Demo at /demo with a Business-Consultant-style chat that guides users through Clarifying Questions → Optimization Suggestions → Full Omega Prompt, rendered as copy-friendly Markdown.
- Design system: Ω-Aurora theme — cosmic_night, deep_blue, quantum_teal, light; Inter + JetBrains Mono; Shadcn/UI; glass-morphism; motion and micro-interactions; strict accessibility and testing hooks via data-testid.

The MVP prioritizes polish and quality while keeping integration pragmatic. OpenAI (via Emergent LLM key) will power the demo’s prompt generation, with a graceful mocked fallback when keys are absent.

## 2) Objectives
- Implement a premium, accessible UI that reflects the Ω-Aurora brand and follows the shared design guidelines.
- Build /education with fluid, no-reload transitions, selectors, and dynamic content.
- Build /demo with chat composer, message stream, and Omega prompt Markdown output + copy.
- Integrate OpenAI (Emergent LLM key) in backend /api/generate for the 3-stage flow; provide safe mocked responses if keys are not available.
- Ensure performance, accessibility, testability (data-testid everywhere), and production logging.

## 3) UI/UX Design Guidelines (Applied)
- Color tokens (from design guidelines):
  - Primary background: #0a0f1d (cosmic_night)
  - Secondary accents: #1e3a8a (deep_blue)
  - Accent/active: #06d6a0 (quantum_teal)
  - Foreground/light: #f8fafc
- Typography: Inter (UI/body), JetBrains Mono (code/tech). Load via index.html link.
- Components: Use Shadcn/UI exclusively (ToggleGroup, ScrollArea, Card, Button, Textarea, NavigationMenu, Sonner).
- Motion: framer-motion for page/section transitions; transition only transform/opacity/colors (no transition: all).
- Background effects: restrained neural links (react-tsparticles) and subtle aurora overlays; gradients < 20% viewport and never behind long-form text.
- Accessibility: AA contrast on dark backgrounds, keyboard focus rings, no center-aligned global layout, semantic landmarks, and data-testid for all interactives and key content.
- Icons: lucide-react only; no emoji icons.
- Toasts: Sonner, themed to quantum_teal, limited concurrency.

## 4) Implementation Steps (Phased)

### Phase 1 — Scaffold, Theming, Navigation (Status: In Progress)
- Add Inter + JetBrains Mono in public/index.html.
- Inject design tokens/custom properties into src/index.css (root/dark scope) per guidelines.
- Create brand/LogoOmega and layout/TopNav components; add sticky nav with routes to /education and /demo.
- Set up route skeletons (React Router) for /education and /demo.

### Phase 2 — Education Experience (Ω Knowledge Explorer)
- Create Education page with split layout: left control rail (document & perspective toggles) and right content area.
- Import provided 9-block education data into src/lib/education-texts.js.
- Implement EducationSelector (doc + perspective) using ToggleGroup; wire to state; render dynamic content in ScrollArea.
- Add micro-interactions (fade/slide on content change), skeleton/empty/error states, and strict data-testid coverage.

### Phase 3 — Demo (Consultant Chat → Omega Prompt)
- Implement ChatInterface with message list (ScrollArea), composer (Textarea + Send button), and toasts on copy/send errors.
- Build right-hand panel that renders generated Omega prompt as Markdown with copy-to-clipboard.
- Provide Quick-Start pattern chips (CustomerSupport, LeadQualification, ContentPlanning, MarketResearch) to prefill chat input.

### Phase 4 — Backend API: /api/generate (OpenAI integration)
- Define Pydantic models: ChatMessage, GenerateRequest, OmegaStages (clarifying, optimization, final_prompt), GenerateResponse.
- Implement /api/generate POST to:
  1) Derive clarifying questions
  2) Produce optimization suggestions
  3) Synthesize Full Omega Prompt (structured Markdown)
- Use integration_playbook_expert and Emergent LLM key (OpenAI) for text generation; include timeout, input size limits, and safety constraints. Provide MOCK mode if key is missing.

### Phase 5 — Polish & Visual Depth
- Add framer-motion transitions for page entry and content switch.
- Add NeuralLinks background to education content area (low density) + aurora/noise overlays (<=20% viewport).
- Enforce hover/focus/active/disabled states for all interactives.
- Add copy success toasts; ensure consistent spacing and card elevations.

### Phase 6 — Testing & Documentation
- Call testing_agent for end-to-end checks (routes, toggles, content rendering, API success/failure paths, copy button).
- Resolve all reported issues (high → low priority) before marking complete.
- Update README with features, scripts, and environment instructions.

## 5) Technical Details
- Frontend
  - Stack: React + React Router + Shadcn/UI + TailwindCSS + framer-motion + react-markdown + remark-gfm + Sonner.
  - Paths to add:
    - src/pages/Education.jsx, src/pages/Demo.jsx
    - src/components/brand/LogoOmega.jsx, src/components/layout/TopNav.jsx
    - src/components/visuals/NeuralLinks.jsx, src/components/EducationSelector.jsx, src/components/ChatInterface.jsx
    - src/lib/education-texts.js (local copy of uploaded content)
  - Data-testid: nav-education-link, nav-demo-link, doc-primordial-toggle, doc-matrices-toggle, doc-framework-toggle, perspective-child/adult-nontech/adult-tech, education-dynamic-copy, demo-message-textarea, demo-send-button, prompt-markdown, copy-prompt-button, pattern-chip-*
  - API base: process.env.REACT_APP_BACKEND_URL + "/api"

- Backend
  - FastAPI app bound via supervisor to 0.0.0.0:8001; keep /api prefix.
  - MongoDB via MONGO_URL; default DB name fallback if DB_NAME not present (implementation detail within server.py).
  - New route: POST /api/generate
    - Request: { messages: [{role: "user"|"assistant", content: string}], preloadedPattern?: string }
    - Response: { clarifying: string[], suggestions: string[], promptMarkdown: string } (plus requestId, timestamps)
  - OpenAI integration (Emergent LLM key)
    - Model: choose latest fast, cost-effective text model (e.g., GPT-4o-mini) — confirm via integration playbook.
    - Safety: Max tokens, temperature ~0.6; guardrails against PII/exploits; enforce timeouts.
    - Mock mode: Return deterministic staged output if key missing; clearly marked in response.

- Performance & Quality
  - Lazy-load particles; prefers-reduced-motion disables movement.
  - Avoid heavy gradients and large images; keep background effects sparse.
  - Logging: backend info logs for /api/generate timing and errors; no secrets in logs.
  - Accessibility: AA contrast and keyboard navigability; aria-labels on icons.

## 6) Next Actions
1. Add fonts to public/index.html and tokens to src/index.css (dark theme variables).
2. Create TopNav, LogoOmega, and wire React Router routes /education and /demo.
3. Add src/lib/education-texts.js (9 blocks) + EducationSelector + Education page content render.
4. Build Demo page panels: ChatInterface + Markdown output + copy with Sonner toast.
5. Backend: scaffold POST /api/generate with MOCK return (no keys) and contract above.
6. Integrate OpenAI via integration playbook + Emergent key; enable real generation; add error handling.
7. Run testing_agent; fix issues; iterate UI polish (spacing, states, motion).

## 7) Success Criteria
- Navigation & Theming
  - Sticky TopNav; routes /education and /demo work without reload; no console errors.
- Education
  - Users can switch 3 documents × 3 perspectives; content updates smoothly with animations; all elements have data-testid; layout responsive.
- Demo
  - Chat composer sends input; clarifying → suggestions → final Omega prompt flow returns; prompt renders as Markdown; copy button works with toast.
- Integration & Robustness
  - /api/generate works with OpenAI (Emergent key) and falls back to MOCK when missing; timeouts and input limits enforced.
- UX & A11y
  - Strict AA contrast; clear focus/hover/active states; gradients < 20% viewport; no gradient behind long-form text blocks.
- Quality
  - testing_agent passes critical tests (routing, content, API contract, copy); logs clean; preview URL renders consistently across desktop/mobile.
