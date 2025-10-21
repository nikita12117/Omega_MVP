{
  "metadata": {
    "project": "Ω-Aurora-Codex (Omega Aurora Codex)",
    "audience": ["business consultants", "operators", "non-tech adults", "tech adults", "curious young learners (10+)"] ,
    "routes": ["/education", "/demo"],
    "brand_attributes": ["sophisticated", "futuristic", "intellectual", "trustworthy", "calm", "cosmic"]
  },
  "tokens": {
    "colors_hex": {
      "cosmic_night": "#0a0f1d",
      "deep_blue": "#1e3a8a",
      "quantum_teal": "#06d6a0",
      "light": "#f8fafc",
      "ink": "#cbd5e1",
      "muted_blue": "#0b1b3a",
      "grid_line": "#0f274f",
      "success": "#17cf97",
      "warning": "#f59e0b",
      "error": "#ef4444"
    },
    "css_custom_properties_dark": {
      ":root": {
        "--background": "219 47% 8.0%",                  
        "--foreground": "210 40% 98%",                  
        "--card": "219 47% 10%",
        "--card-foreground": "210 40% 98%",
        "--popover": "219 47% 10%",
        "--popover-foreground": "210 40% 98%",
        "--primary": "210 70% 96%",
        "--primary-foreground": "223 47% 10%",
        "--secondary": "224 56% 34%",                  
        "--secondary-foreground": "0 0% 100%",
        "--accent": "162 88% 43%",                      
        "--accent-foreground": "210 40% 98%",
        "--muted": "220 35% 16%",
        "--muted-foreground": "215 20% 70%",
        "--border": "220 35% 22%",
        "--input": "220 35% 22%",
        "--ring": "162 88% 43%",
        "--radius": "0.625rem",
        "--elevation-1": "0 10px 30px -10px rgba(6, 214, 160, 0.18)",
        "--glow-teal": "0 0 0 3px rgba(6,214,160,0.24)",
        "--noise-opacity": "0.03"
      }
    },
    "button_tokens": {
      "--btn-radius": "0.625rem",
      "--btn-shadow": "0 12px 24px -12px rgba(6,214,160,0.35)",
      "--btn-motion": "150ms cubic-bezier(0.22, 1, 0.36, 1)"
    },
    "spacing": {
      "section_y": "py-12 md:py-20 lg:py-28",
      "container": "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    },
    "shadows": {
      "soft": "0 10px 30px -15px rgba(0,0,0,0.45)",
      "inset_glass": "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04)"
    },
    "radii": {
      "sm": "0.375rem",
      "md": "0.625rem",
      "lg": "1rem"
    }
  },
  "typography": {
    "imports": [
      "<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap\" rel=\"stylesheet\">"
    ],
    "stacks": {
      "body": "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Arial, sans-serif",
      "code": "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace"
    },
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl tracking-tight font-semibold",
      "h2": "text-base md:text-lg font-medium text-slate-200",
      "body": "text-base md:text-base text-slate-200/90",
      "small": "text-sm text-slate-400"
    },
    "tone": "Calm, precise, intellectual. Headings restrained; rely on spacing and contrast, not size alone."
  },
  "layout_strategy": {
    "global": {
      "nav": "Sticky top nav with transparent backdrop + blur until scrolled; glassmorphic sheet on mobile.",
      "grid": "12-col responsive grid on lg (max-w-7xl), single-column on mobile with generous 24px gutters.",
      "background_layers": [
        "base: bg-[rgb(10,15,29)]",
        "subtle radial spotlights via before: absolute radial-gradient overlays",
        "noise overlay at ~3% opacity",
        "optional tsParticles links network (low density)"
      ]
    },
    "education_page": {
      "pattern": "Split-Screen Layout on lg: 4/12 left control rail, 8/12 right content universe; single-column on mobile.",
      "left_column": ["LogoΩ + title", "Document selector (3 buttons)", "Perspective toggle (3 pills)", "Context help/tooltip"],
      "right_column": ["Dynamic content area with ScrollArea; cognitive mapping transitions"],
      "microcopy": "Titles read like chapters; keep labels short."
    },
    "demo_page": {
      "pattern": "Professional consultant chat. Two-column on lg: 7/12 chat + input; 5/12 generated prompt panel. Single column stack on mobile.",
      "panels": ["Chat messages (auto-scroll)", "Message composer", "Markdown prompt output with copy"],
      "tone": "Formal, minimal, roomy."
    }
  },
  "components": {
    "logo_omega": {
      "description": "Ω glyph with neural pathway overlay. CSS glow + animated SVG path network (teal links).",
      "example": "// src/components/brand/LogoOmega.jsx\nimport React from 'react'\nexport const LogoOmega = ({ size = 28 }) => (\n  <div className=\"relative inline-flex items-center\" aria-label=\"Omega Aurora Codex logo\">\n    <span className=\"font-semibold tracking-tight text-slate-100\" style={{ fontSize: size }} data-testid=\"brand-omega-logo\">Ω</span>\n    <svg className=\"absolute -inset-1 pointer-events-none\" width=\"64\" height=\"64\" viewBox=\"0 0 64 64\" aria-hidden=\"true\">\n      <defs>\n        <radialGradient id=\"g\" cx=\"50%\" cy=\"50%\" r=\"50%\">\n          <stop offset=\"0%\" stopColor=\"#06d6a0\" stopOpacity=\"0.55\"/>\n          <stop offset=\"100%\" stopColor=\"#06d6a0\" stopOpacity=\"0\"/>\n        </radialGradient>\n      </defs>\n      <circle cx=\"32\" cy=\"32\" r=\"28\" fill=\"url(#g)\"/>\n      <g stroke=\"#06d6a0\" strokeOpacity=\"0.6\" strokeWidth=\"1\" fill=\"none\">\n        <path d=\"M10,40 C20,25 44,22 54,34\">\n          <animate attributeName=\"stroke-opacity\" dur=\"4s\" values=\"0.2;0.8;0.2\" repeatCount=\"indefinite\"/>\n        </path>\n        <path d=\"M8,28 C16,18 34,16 52,24\">\n          <animate attributeName=\"stroke-opacity\" dur=\"5s\" values=\"0.2;0.7;0.2\" repeatCount=\"indefinite\"/>\n        </path>\n      </g>\n    </svg>\n  </div>\n)\nexport default LogoOmega\n"
    },
    "navigation": {
      "use": "navigation-menu.jsx or menubar.jsx",
      "snippet": "// src/components/layout/TopNav.jsx\nimport React from 'react'\nimport { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '../ui/navigation-menu'\nimport LogoOmega from '../brand/LogoOmega'\nexport const TopNav = () => (\n  <div className=\"sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-cyan-950/5 border-b border-white/5\">\n    <nav className=\"max-w-7xl mx-auto flex items-center justify-between px-4 h-14\" role=\"navigation\">\n      <div className=\"flex items-center gap-3\">\n        <LogoOmega />\n        <span className=\"text-slate-200 text-sm\">Ω Aurora Codex</span>\n      </div>\n      <NavigationMenu>\n        <NavigationMenuList>\n          <NavigationMenuItem>\n            <NavigationMenuLink href=\"/education\" data-testid=\"nav-education-link\" className=\"text-slate-200 hover:text-white\">Education</NavigationMenuLink>\n          </NavigationMenuItem>\n          <NavigationMenuItem>\n            <NavigationMenuLink href=\"/demo\" data-testid=\"nav-demo-link\" className=\"text-slate-200 hover:text-white\">Demo</NavigationMenuLink>\n          </NavigationMenuItem>\n        </NavigationMenuList>\n      </NavigationMenu>\n    </nav>\n  </div>\n)\nexport default TopNav\n"
    },
    "document_selector": {
      "use": "button.jsx + toggle-group.jsx for segmented control",
      "states": ["default", "hover", "active", "disabled"],
      "classes": {
        "base": "px-3 py-2 rounded-md border border-white/10 text-slate-200 hover:border-white/20 hover:bg-white/5 data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-300 data-[state=on]:border-emerald-400/30"
      },
      "snippet": "// inside Education page left rail\nimport { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'\n<ToggleGroup type=\"single\" className=\"grid grid-cols-1 gap-2\" value={doc} onValueChange={setDoc}>\n  <ToggleGroupItem value=\"primordial\" data-testid=\"doc-primordial-toggle\" className=\"px-3 py-2 rounded-md border border-white/10 text-left\">Ω⁻⁹ Primordial Logic</ToggleGroupItem>\n  <ToggleGroupItem value=\"matrices\" data-testid=\"doc-matrices-toggle\" className=\"px-3 py-2 rounded-md border border-white/10 text-left\">Ω⁻⁴ Matrices</ToggleGroupItem>\n  <ToggleGroupItem value=\"framework\" data-testid=\"doc-framework-toggle\" className=\"px-3 py-2 rounded-md border border-white/10 text-left\">Ω∞ Framework</ToggleGroupItem>\n</ToggleGroup>"
    },
    "perspective_toggle": {
      "description": "3-way audience switch as segmented pills",
      "snippet": "<ToggleGroup type=\"single\" value={view} onValueChange={setView} className=\"inline-flex rounded-lg bg-white/5 p-1 border border-white/10\">\n  {['Child (10 yrs)','Adult Non-Tech','Adult Tech'].map((label, i) => (\n    <ToggleGroupItem key={i} value={['child','adult-nontech','adult-tech'][i]} data-testid=\"perspective-segment\" className=\"px-3 py-1.5 rounded-md data-[state=on]:bg-emerald-400/20 data-[state=on]:text-emerald-300 text-slate-200\">{label}</ToggleGroupItem>\n  ))}\n</ToggleGroup>"
    },
    "education_content_area": {
      "use": "card.jsx + scroll-area.jsx + tooltip.jsx",
      "notes": "Glassmorphic card floating on cosmic background. Dynamic copy fades/slides on doc or perspective change.",
      "snippet": "<div className=\"relative\">\n  <div className=\"absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-400/10 via-transparent to-cyan-400/10 pointer-events-none\" aria-hidden=\"true\"/>\n  <div className=\"relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[var(--elevation-1)]\">\n    <div className=\"p-6\">\n      <div className=\"text-slate-100 leading-relaxed space-y-4\" data-testid=\"education-dynamic-copy\">{content}\n      </div>\n    </div>\n  </div>\n</div>"
    },
    "chat_interface": {
      "use": "card.jsx, scroll-area.jsx, textarea.jsx, button.jsx, avatar.jsx, separator.jsx",
      "layout": "Messages ScrollArea (min-h-[50vh]) above; composer fixed at panel bottom on mobile.",
      "message_bubble_classes": {
        "user": "ml-auto max-w-[80%] bg-emerald-400/10 border border-emerald-300/20 text-emerald-100",
        "assistant": "mr-auto max-w-[80%] bg-white/5 border border-white/10 text-slate-100"
      },
      "composer_snippet": "<form onSubmit={onSend} className=\"flex gap-2 items-end\">\n  <textarea className=\"w-full min-h-[52px] max-h-40 rounded-md bg-white/5 border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 text-slate-100 placeholder:text-slate-400 px-3 py-2\" placeholder=\"Describe your use case...\" data-testid=\"demo-message-textarea\"/>\n  <button type=\"submit\" className=\"inline-flex items-center justify-center rounded-md bg-emerald-500/90 hover:bg-emerald-400 text-slate-900 font-medium px-4 h-10 shadow\" data-testid=\"demo-send-button\">Send</button>\n</form>"
    },
    "markdown_output": {
      "use": "card.jsx + scroll-area.jsx + copy button",
      "styles": "Prose-like spacing; code blocks monospace with subtle frame.",
      "snippet": "<div className=\"rounded-lg border border-white/10 bg-white/5 backdrop-blur p-4\">\n  <div className=\"flex items-center justify-between mb-2\">\n    <h3 className=\"text-sm text-slate-300\">Omega Agent Prompt</h3>\n    <button onClick={copy} className=\"text-emerald-300 hover:text-emerald-200\" data-testid=\"copy-prompt-button\">Copy</button>\n  </div>\n  <div className=\"markdown text-slate-100 leading-relaxed space-y-3\" data-testid=\"prompt-markdown\">{renderedMarkdown}</div>\n</div>"
    },
    "toast": {
      "use": "sonner.jsx",
      "guidance": "Use for copy confirmations and minor alerts; place <Toaster /> at root."
    }
  },
  "micro_interactions_and_motion": {
    "library": "framer-motion",
    "page_transitions": "Fade + slight upward translate (8px). Duration 240ms; easing cubic-bezier(0.22,1,0.36,1).",
    "hover_focus": [
      "Buttons: shadow-glow via ring-emerald on hover; focus-visible:ring-2 focus-visible:ring-emerald-400/50",
      "Document/Perspective toggles: subtle scale-105 on hover (transform only)"
    ],
    "snippets": {
      "fade_slide_in": "import { motion } from 'framer-motion'\nexport const FadeIn = ({ children }) => (\n  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: [0.22,1,0.36,1] }}>{children}</motion.div>\n)"
    }
  },
  "background_effects": {
    "neural_links_tsParticles": {
      "install": "npm i tsparticles react-tsparticles",
      "snippet": "// src/components/visuals/NeuralLinks.jsx\nimport React from 'react'\nimport Particles from 'react-tsparticles'\nexport const NeuralLinks = () => (\n  <Particles id=\"tsparticles\" data-testid=\"neural-links-bg\" options={{\n    fullScreen: { enable: false },\n    background: { color: 'transparent' },\n    fpsLimit: 30,\n    interactivity: { events: { onHover: { enable: false }, resize: true } },\n    particles: {\n      number: { value: 28, density: { enable: true, area: 900 } },\n      color: { value: '#06d6a0' },\n      links: { enable: true, color: '#1e3a8a', opacity: 0.35, width: 1 },\n      move: { enable: true, speed: 0.4 },\n      opacity: { value: 0.25 },\n      size: { value: { min: 1, max: 2 } }\n    },\n    detectRetina: true\n  }} />\n)\nexport default NeuralLinks\n"
    },
    "aurora_css_overlay": {
      "notes": "Keep under 20% viewport coverage; use only as section backdrop, not in content blocks.",
      "snippet": ".aurora-overlay::before{content:'';position:absolute;inset:-20%;background:radial-gradient(60% 60% at 20% 10%, rgba(6,214,160,0.12) 0%, rgba(6,214,160,0) 60%), radial-gradient(40% 40% at 80% 30%, rgba(30,58,138,0.18) 0%, rgba(30,58,138,0) 60%);filter: blur(32px);pointer-events:none;z-index:-1}"
    },
    "noise_overlay": {
      "snippet": ".noise{position:absolute;inset:0;background-image:url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'160\\'><filter id=\\'n\\'><feTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.65\\' numOctaves=\\'2\\' stitchTiles=\\'stitch\\'/></filter><rect width=\\'100%\\' height=\\'100%\\' filter=\\'url(#n)\\' opacity=\\'0.035\\' /></svg>');mix-blend-mode:overlay;pointer-events:none}"
    }
  },
  "buttons": {
    "variants": {
      "primary": "inline-flex items-center justify-center rounded-[var(--btn-radius)] bg-emerald-500 text-slate-900 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 px-4 h-10 font-medium shadow-[var(--btn-shadow)]",
      "secondary": "inline-flex items-center justify-center rounded-[var(--btn-radius)] bg-white/5 text-slate-100 border border-white/10 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 px-4 h-10",
      "ghost": "inline-flex items-center justify-center rounded-[var(--btn-radius)] text-emerald-300 hover:text-emerald-200 hover:bg-emerald-400/10 px-3 h-9"
    },
    "sizes": { "sm": "h-9 px-3", "md": "h-10 px-4", "lg": "h-12 px-5" },
    "wcag": "All buttons > 4.5:1 contrast on dark backgrounds; visible focus ring."
  },
  "pages_scaffolds": {
    "education.js": "// /src/pages/education.js\nimport React, { useState } from 'react'\nimport TopNav from '../components/layout/TopNav'\nimport { ToggleGroup, ToggleGroupItem } from '../components/ui/toggle-group'\nimport { ScrollArea } from '../components/ui/scroll-area'\nimport { Separator } from '../components/ui/separator'\nimport NeuralLinks from '../components/visuals/NeuralLinks'\n\nexport default function Education(){\n  const [doc, setDoc] = useState('primordial')\n  const [view, setView] = useState('child')\n  return (\n    <div className=\"min-h-screen bg-[rgb(10,15,29)] text-slate-100 relative\">\n      <TopNav/>\n      <div className=\"absolute inset-0 aurora-overlay\" aria-hidden=\"true\"/>\n      <div className=\"absolute inset-0 noise\" aria-hidden=\"true\"/>\n      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6\">\n        <aside className=\"lg:col-span-4 space-y-6\">\n          <div>\n            <h1 className=\"text-2xl font-semibold tracking-tight\">Ω Aurora Codex</h1>\n            <p className=\"text-slate-400 text-sm\">Explore the knowledge universe.</p>\n          </div>\n          <div>\n            <h2 className=\"text-sm text-slate-400 mb-2\">Documents</h2>\n            <ToggleGroup type=\"single\" value={doc} onValueChange={setDoc} className=\"grid gap-2\">\n              <ToggleGroupItem value=\"primordial\" data-testid=\"doc-primordial-toggle\" className=\"px-3 py-2 rounded-md border border-white/10 text-left hover:bg-white/5 data-[state=on]:bg-emerald-400/15\">Ω⁻⁹ Primordial Logic</ToggleGroupItem>\n              <ToggleGroupItem value=\"matrices\" data-testid=\"doc-matrices-toggle\" className=\"px-3 py-2 rounded-md border border-white/10 text-left hover:bg-white/5 data-[state=on]:bg-emerald-400/15\">Ω⁻⁴ Matrices</ToggleGroupItem>\n              <ToggleGroupItem value=\"framework\" data-testid=\"doc-framework-toggle\" className=\"px-3 py-2 rounded-md border border-white/10 text-left hover:bg-white/5 data-[state=on]:bg-emerald-400/15\">Ω∞ Framework</ToggleGroupItem>\n            </ToggleGroup>\n          </div>\n          <div>\n            <h2 className=\"text-sm text-slate-400 mb-2\">Perspective</h2>\n            <ToggleGroup type=\"single\" value={view} onValueChange={setView} className=\"inline-flex rounded-lg bg-white/5 p-1 border border-white/10\">\n              <ToggleGroupItem value=\"child\" data-testid=\"perspective-child\" className=\"px-3 py-1.5 rounded-md data-[state=on]:bg-emerald-400/20\">Child (10 yrs)</ToggleGroupItem>\n              <ToggleGroupItem value=\"adult-nontech\" data-testid=\"perspective-adult-nontech\" className=\"px-3 py-1.5 rounded-md data-[state=on]:bg-emerald-400/20\">Adult Non-Tech</ToggleGroupItem>\n              <ToggleGroupItem value=\"adult-tech\" data-testid=\"perspective-adult-tech\" className=\"px-3 py-1.5 rounded-md data-[state=on]:bg-emerald-400/20\">Adult Tech</ToggleGroupItem>\n            </ToggleGroup>\n          </div>\n        </aside>\n        <main className=\"lg:col-span-8 relative\">\n          <div className=\"absolute inset-0\"><NeuralLinks/></div>\n          <div className=\"relative rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 min-h-[60vh]\">\n            <ScrollArea className=\"h-[60vh]\">\n              <article className=\"space-y-4 leading-relaxed text-slate-100\" data-testid=\"education-dynamic-copy\">\n                {/* Render content based on doc + view */}\n              </article>\n            </ScrollArea>\n          </div>\n        </main>\n      </div>\n    </div>\n  )\n}\n",
    "demo.js": "// /src/pages/demo.js\nimport React from 'react'\nimport TopNav from '../components/layout/TopNav'\nimport { ScrollArea } from '../components/ui/scroll-area'\n\nexport default function Demo(){\n  return (\n    <div className=\"min-h-screen bg-[rgb(10,15,29)] text-slate-100 relative\">\n      <TopNav/>\n      <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6\">\n        <section className=\"lg:col-span-7 space-y-4\">\n          <div className=\"rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4\">\n            <ScrollArea className=\"h-[55vh]\">\n              <div className=\"space-y-3\" data-testid=\"demo-messages\">{/* message bubbles here */}</div>\n            </ScrollArea>\n          </div>\n          <form className=\"flex gap-2 items-end\" data-testid=\"demo-composer\">{/* composer from components.chat_interface */}</form>\n        </section>\n        <aside className=\"lg:col-span-5 space-y-3\">\n          <div className=\"rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4\">\n            <div className=\"flex items-center justify-between mb-2\">\n              <h3 className=\"text-sm text-slate-300\">Omega Agent Prompt</h3>\n              <button className=\"text-emerald-300 hover:text-emerald-200\" data-testid=\"copy-prompt-button\">Copy</button>\n            </div>\n            <ScrollArea className=\"h-[55vh]\">\n              <div className=\"markdown space-y-3\" data-testid=\"prompt-markdown\">{/* markdown here */}</div>\n            </ScrollArea>\n          </div>\n        </aside>\n      </div>\n    </div>\n  )\n}\n"
  },
  "markdown_and_code": {
    "install": "npm i react-markdown remark-gfm",
    "usage": "import ReactMarkdown from 'react-markdown'\nimport remarkGfm from 'remark-gfm'\n<ReactMarkdown remarkPlugins={[remarkGfm]} className=\"prose prose-invert max-w-none prose-pre:bg-transparent prose-code:text-emerald-300\" components={{ code: ({node, inline, className, children, ...props}) => (\n  <code className=\"bg-white/5 border border-white/10 px-1.5 py-0.5 rounded\" {...props}>{children}</code>\n) }}>\n  {markdown}\n</ReactMarkdown>"
  },
  "accessibility_and_testing": {
    "rules": [
      "All interactive elements must have data-testid using kebab-case reflecting role.",
      "Focus states via ring utilities; no outline removal without replacement.",
      "Color contrast minimum AA.",
      "Support prefers-reduced-motion: reduce animation distance and disable particle movement."
    ],
    "data_testid_examples": [
      "nav-education-link", "nav-demo-link", "doc-primordial-toggle", "doc-matrices-toggle", "doc-framework-toggle", "perspective-child", "demo-send-button", "copy-prompt-button", "education-dynamic-copy", "prompt-markdown"
    ]
  },
  "libraries": {
    "primary": ["shadcn/ui primitives (already in src/components/ui)", "sonner for toasts (src/components/ui/sonner.jsx)", "TailwindCSS"],
    "additional": [
      {"name": "framer-motion", "install": "npm i framer-motion", "use": "route and section transitions"},
      {"name": "react-markdown + remark-gfm", "install": "npm i react-markdown remark-gfm", "use": "render clean markdown output"},
      {"name": "react-tsparticles", "install": "npm i tsparticles react-tsparticles", "use": "neural links background (low density)"}
    ]
  },
  "image_urls": [
    {"url": "https://images.unsplash.com/photo-1655435600406-6968a32a3a34?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Teal cosmic water-like texture", "category": "hero/section backdrop"},
    {"url": "https://images.unsplash.com/photo-1615096962549-f35ac603bf31?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Marine blue gradient haze", "category": "education background overlay"},
    {"url": "https://images.unsplash.com/photo-1563518839049-f44a5e423f12?crop=entropy&cs=srgb&fm=jpg&q=85", "description": "Blurry blue vertical aurora lines", "category": "demo sidebar texture"},
    {"url": "https://images.pexels.com/photos/7130463/pexels-photo-7130463.jpeg", "description": "Soft teal gradient bokeh", "category": "branding/empty states"},
    {"url": "https://images.pexels.com/photos/30210737/pexels-photo-30210737.jpeg", "description": "Crystalline teal surface detail", "category": "decorative divider"},
    {"url": "https://images.pexels.com/photos/7130469/pexels-photo-7130469.jpeg", "description": "Pastel teal-lilac wash (low saturation)", "category": "footer band (<=20% view)"}
  ],
  "component_path": {
    "button": "./components/ui/button",
    "card": "./components/ui/card",
    "toggle_group": "./components/ui/toggle-group",
    "tabs": "./components/ui/tabs",
    "scroll_area": "./components/ui/scroll-area",
    "textarea": "./components/ui/textarea",
    "avatar": "./components/ui/avatar",
    "separator": "./components/ui/separator",
    "navigation_menu": "./components/ui/navigation-menu",
    "tooltip": "./components/ui/tooltip",
    "sonner": "./components/ui/sonner",
    "calendar": "./components/ui/calendar"
  },
  "inspirations": [
    {"title": "Aurora Gradient Generator", "url": "https://auroragradient.com"},
    {"title": "Dribbble – Aurora UI", "url": "https://dribbble.com/tags/aurora-ui"},
    {"title": "Shadcn Aurora Shader", "url": "https://www.shadcn.io/shaders/aurora"},
    {"title": "Aceternity Aurora Background", "url": "https://ui.aceternity.com/components/aurora-background"},
    {"title": "Shadcn Chatbot Blocks", "url": "https://www.shadcn.io/blocks/ai-chatbot"}
  ],
  "instructions_to_main_agent": {
    "setup_steps": [
      "Ensure global fonts in index.html using provided <link> for Inter and JetBrains Mono.",
      "Adopt tokens.css: copy css_custom_properties_dark into src/index.css within @layer base .dark scope if using dark mode globally.",
      "Implement TopNav and place on both routes.",
      "Add NeuralLinks background to education content area only. Respect prefers-reduced-motion.",
      "Use ToggleGroup for document and perspective; attach onValueChange handlers.",
      "Render markdown in demo using react-markdown + remark-gfm.",
      "Use Sonner toasts for copy confirmations.",
      "Add data-testid attributes as specified across all interactive elements.",
      "Follow gradient restriction rule: keep aurora overlay decorative, <=20% viewport coverage."
    ],
    "do_nots": [
      "Do not center the entire .App container text.",
      "Do not apply transition: all; only per-property (e.g., colors, shadow).",
      "Avoid purple/pink saturated gradients anywhere in UI.",
      "Do not put gradients behind long-form text blocks."
    ]
  },
  "general_ui_ux_design_guidelines": "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
}
