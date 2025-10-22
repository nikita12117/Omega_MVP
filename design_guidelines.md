{
  "meta": {
    "product": "Ω-Aurora Codex",
    "version": "MVP-GDL-1.0",
    "timeline": "conference-ready",
    "audience": ["business consultants", "entrepreneurs", "non-technical professionals"],
    "routes": ["/education", "/demo", "/dashboard"],
    "brand_attributes": ["professional", "innovative", "cosmic", "trustworthy", "precise"]
  },
  "design_personality": {
    "theme": "Cosmic/Aurora with neural pathway motifs",
    "tone": "calm confidence, analytical, slightly ethereal",
    "do_not_use": ["purple/pink saturated gradients", "center-aligned app container", "universal transition: all"],
    "language": "Primary UI copy in English, education content in Czech; set <html lang=\"cs\"> on education pages for correct hyphenation/screen readers"
  },
  "color_system": {
    "source_palette": {
      "cosmic_night": "#0a0f1d",
      "deep_blue": "#1e3a8a",
      "quantum_teal": "#06d6a0",
      "light": "#f8fafc"
    },
    "semantic": {
      "background": "#0a0f1d",
      "foreground": "#e6f1ff",
      "surface": "#10172a",
      "surface_elevated": "#0f1b33",
      "border": "#25365a",
      "primary": "#1e3a8a",
      "primary_foreground": "#e6f1ff",
      "accent": "#06d6a0",
      "accent_foreground": "#06241e",
      "muted": "#112039",
      "muted_foreground": "#9fb4d0",
      "success": "#0bbf83",
      "warning": "#f59e0b",
      "danger": "#ef4444",
      "info": "#38bdf8"
    },
    "states": {
      "focus_ring": "rgba(6, 214, 160, 0.6)",
      "hover": "rgba(6, 214, 160, 0.12)",
      "press": "rgba(6, 214, 160, 0.18)"
    },
    "gradients": {
      "rules": {
        "max_viewport_coverage": "20%",
        "no_dark_saturated_pairs": true,
        "only_on": ["hero section backgrounds", "section separators", "decorative overlays"],
        "never_on": ["text-heavy reading blocks", "small ui elements <100px", "footer backgrounds"]
      },
      "tokens": {
        "aurora_horizon": "linear-gradient(120deg, #0a0f1d 0%, #0f1b33 40%, #1e3a8a 85%)",
        "teal_breeze": "linear-gradient(135deg, #0f1b33 0%, #0c3b3a 55%, #06d6a0 100%)",
        "polar_mist": "radial-gradient(60% 60% at 20% 10%, rgba(6,214,160,0.12) 0%, rgba(6,214,160,0) 60%), radial-gradient(40% 40% at 80% 30%, rgba(30,58,138,0.18) 0%, rgba(30,58,138,0) 60%)"
      }
    },
    "css_custom_properties": {
      ":root": {
        "--bg": "#0a0f1d",
        "--fg": "#e6f1ff",
        "--surface": "#10172a",
        "--surface-2": "#0f1b33",
        "--border": "#25365a",
        "--primary": "#1e3a8a",
        "--primary-fg": "#e6f1ff",
        "--accent": "#06d6a0",
        "--accent-fg": "#06241e",
        "--muted": "#112039",
        "--muted-fg": "#9fb4d0",
        "--success": "#0bbf83",
        "--warning": "#f59e0b",
        "--danger": "#ef4444",
        "--info": "#38bdf8",
        "--radius": "10px",
        "--shadow-1": "0 10px 30px -12px rgba(6,214,160,0.18)",
        "--ring": "0 0 0 3px rgba(6,214,160,0.45)",
        "--btn-radius": "10px",
        "--btn-shadow": "0 12px 24px -12px rgba(30,58,138,0.35)",
        "--btn-motion": "170ms cubic-bezier(0.22,1,0.36,1)",
        "--noise-opacity": "0.03"
      }
    }
  },
  "typography": {
    "primary": "Inter",
    "code": "JetBrains Mono",
    "fallbacks": ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto"],
    "html_lang": {"education_pages": "cs"},
    "scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl tracking-tight",
      "h2": "text-base md:text-lg font-medium text-[color:var(--muted-fg)]",
      "h3": "text-lg md:text-xl font-semibold",
      "body": "text-base md:text-base leading-7",
      "small": "text-sm leading-6",
      "mono": "font-mono text-sm md:text-base"
    },
    "usage": {
      "display": "Inter 700/800 for hero titles",
      "sections": "Inter 600 for section titles",
      "reading": "Inter 400/500 at 18–20px on desktop; 16–18px mobile",
      "code": "JetBrains Mono for prompts, inline code, message meta"
    }
  },
  "layout": {
    "principles": ["mobile-first", "wide breathing space (1.5x–2x spacing)", "content-left alignment"],
    "grid": {
      "container": "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
      "columns": {
        "default": 12,
        "gutter": 24
      }
    },
    "sections": {
      "header": "sticky top-0 z-50 bg-[color:var(--bg)]/85 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--bg)]/70 border-b border-[color:var(--border)]",
      "hero": "relative overflow-hidden aurora-overlay",
      "content_card": "bg-[color:var(--surface)] border border-[color:var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-1)]"
    },
    "spacing": {
      "scale": [4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64],
      "section_padding": "py-12 md:py-16 lg:py-20"
    }
  },
  "navigation": {
    "topbar": {
      "components": ["navigation-menu", "dropdown-menu", "button", "sheet (mobile)", "command"],
      "pattern": "Left: Ω logo + product; Middle: primary nav (Education, Demo, Dashboard); Right: theme/keys + profile",
      "classes": "flex items-center justify-between h-14 px-4"
    },
    "breadcrumbs": {
      "use": "education detail, dashboard subpages",
      "component": "breadcrumb"
    }
  },
  "components": {
    "buttons": {
      "style": "Professional/Corporate",
      "variants": {
        "primary": "bg-[color:var(--primary)] text-[color:var(--primary-fg)] hover:bg-[#2447a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[color:var(--accent)] disabled:opacity-50 disabled:pointer-events-none shadow-[var(--btn-shadow)]",
        "secondary": "bg-[color:var(--surface)] text-[color:var(--fg)] border border-[color:var(--border)] hover:border-[color:var(--accent)]/40",
        "ghost": "text-[color:var(--fg)] hover:bg-[color:var(--muted)]/40"
      },
      "sizes": {
        "sm": "h-9 px-3 rounded-[var(--btn-radius)]",
        "md": "h-10 px-4 rounded-[var(--btn-radius)]",
        "lg": "h-12 px-5 rounded-[var(--btn-radius)]"
      }
    },
    "education_selector": {
      "goal": "Select among Ω⁻⁹, Ω⁻⁴, Ω∞ and perspectives (Child, Adult Non-Tech, Adult Tech) in Czech with clear readability",
      "layout": "Two-pane on desktop: left list, right reader; stacked on mobile",
      "uses": ["tabs", "accordion", "card", "scroll-area", "badge"],
      "interaction": "Selecting a document reveals three perspective pills; use Tabs to switch body copy. Smooth fade between panes",
      "testids": ["education-doc-tab-omega-9", "education-perspective-child-button", "education-content-pane"]
    },
    "chat_interface": {
      "goal": "Conversational yet professional consultant chat, Markdown output, preset patterns",
      "uses": ["card", "textarea", "button", "tabs", "dropdown-menu", "badge", "separator", "scroll-area", "tooltip", "sonner"],
      "layout": "Header: Preset selector + Generate Agent button. Body: Scrollable messages with left/right alignment. Footer: textarea with send",
      "message_bubble_classes": {
        "user": "ml-auto bg-[color:var(--surface-2)] border border-[color:var(--border)] rounded-2xl rounded-br-sm p-3",
        "assistant": "mr-auto bg-transparent border border-[color:var(--border)] rounded-2xl rounded-bl-sm p-3"
      },
      "markdown": {
        "code_block": "rounded-md bg-[#0d1222] border border-[color:var(--border)] p-3 overflow-auto text-[13px] font-mono",
        "heading": "text-[color:var(--fg)] font-semibold",
        "link": "text-[color:var(--accent)] underline-offset-2 hover:underline"
      },
      "testids": ["demo-preset-select", "demo-send-button", "demo-message-list", "demo-markdown-output"]
    },
    "api_keys_dashboard": {
      "goal": "Manage Emergent LLM key + custom keys",
      "uses": ["table", "dialog", "input", "button", "dropdown-menu", "alert-dialog", "switch", "toast (sonner)", "tabs"],
      "layout": "Table of keys (name, provider, last used, status). Actions: reveal/copy, rotate, revoke",
      "testids": ["dashboard-add-key-button", "dashboard-key-row", "dashboard-rotate-key-action"]
    },
    "omega_logo": {
      "type": "SVG with neural path strokes, teal accent",
      "animation": "stroke-dasharray draw on mount (reduced motion aware)",
      "usage": "Top-left brand lockup and favicon"
    }
  },
  "component_path": {
    "base": "./components/ui/",
    "map": {
      "button": "./components/ui/button",
      "tabs": "./components/ui/tabs",
      "card": "./components/ui/card",
      "scroll-area": "./components/ui/scroll-area",
      "badge": "./components/ui/badge",
      "dropdown-menu": "./components/ui/dropdown-menu",
      "separator": "./components/ui/separator",
      "tooltip": "./components/ui/tooltip",
      "textarea": "./components/ui/textarea",
      "input": "./components/ui/input",
      "dialog": "./components/ui/dialog",
      "alert-dialog": "./components/ui/alert-dialog",
      "table": "./components/ui/table",
      "switch": "./components/ui/switch",
      "sheet": "./components/ui/sheet",
      "navigation-menu": "./components/ui/navigation-menu",
      "command": "./components/ui/command",
      "accordion": "./components/ui/accordion",
      "sonner": "./components/ui/sonner"
    }
  },
  "micro_interactions_and_motion": {
    "library": "framer-motion",
    "principles": [
      "no transition: all; use explicit properties (opacity, color, box-shadow)",
      "0.18s–0.28s duration for most UI, ease-out",
      "parallax on hero decorative layers only, not content",
      "respect prefers-reduced-motion"
    ],
    "patterns": {
      "fade_in_up": {"initial": {"opacity": 0, "y": 8}, "animate": {"opacity": 1, "y": 0}, "transition": {"duration": 0.22}},
      "list_stagger": {"container": {"staggerChildren": 0.06}},
      "neural_overlay": "Canvas or CSS radial gradients with slow 30s opacity drift (<=20% viewport)"
    },
    "js_scaffolds": {
      "motion_container_js": "import { motion } from 'framer-motion'\nexport const FadeIn = ({children, ...props}) => (\n  <motion.div initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} transition={{duration:0.22}} {...props}>{children}</motion.div>\n)"
    }
  },
  "data_testid_policy": {
    "rule": "All interactive and key informational elements MUST include data-testid in kebab-case describing role, not style.",
    "examples": [
      "data-testid=\"demo-send-button\"",
      "data-testid=\"education-perspective-child-button\"",
      "data-testid=\"dashboard-add-key-button\"",
      "data-testid=\"markdown-copy-to-clipboard-button\""
    ]
  },
  "accessibility": {
    "contrast": "Meet WCAG AA. Foreground on surfaces ≥ 4.5:1",
    "focus": "Visible 2px ring using --ring, no outline removal",
    "keyboard": "All dialogs, menus navigable via keyboard; Esc closes",
    "language_attr": "Set lang=cs on education content pages",
    "reduced_motion": "Fallback to instant state changes"
  },
  "images_and_motifs": {
    "usage": "Subtle aurora overlays and neural line textures as decoration only. Keep content areas solid.",
    "image_urls": [
      {
        "url": "https://images.unsplash.com/photo-1651084077618-e39a16e29546?crop=entropy&cs=srgb&fm=jpg&q=85",
        "category": "hero-background",
        "description": "Blue/teal aurora sweep for landing hero (<=20% viewport coverage)"
      },
      {
        "url": "https://images.unsplash.com/photo-1677575054140-8bb3d32ab89a?crop=entropy&cs=srgb&fm=jpg&q=85",
        "category": "section-divider",
        "description": "Vertical teal-blue light strands for section transition background"
      },
      {
        "url": "https://images.pexels.com/photos/12775176/pexels-photo-12775176.jpeg",
        "category": "dashboard-accent",
        "description": "Soft teal texture used as blurred overlay behind KPI widget"
      }
    ]
  },
  "patterns": {
    "education": {
      "skeleton": [
        "Header with tabs: Ω⁻⁹ | Ω⁻⁴ | Ω∞",
        "Within each tab, perspective tabs: Child | Adult Non‑Tech | Adult Tech",
        "Right reading pane in a Card with max-w-prose, 70–80ch line length",
        "Left list collapses on mobile into a top Tabs bar"
      ],
      "tailwind": {
        "container": "grid grid-cols-1 lg:grid-cols-12 gap-6",
        "left": "lg:col-span-4 space-y-3",
        "right": "lg:col-span-8 space-y-6"
      },
      "components": ["tabs", "card", "scroll-area", "badge", "separator"],
      "empty_state": "Use skeleton + muted copy when content loading"
    },
    "demo_chat": {
      "skeleton": [
        "Top: Preset selector (Customer Support, Lead Qualification, Content Planning, Market Research) as Tabs",
        "Middle: Scroll-area with message bubbles; Markdown rendering; copy buttons",
        "Bottom: Composer with Textarea + Send; Shift+Enter newline"
      ],
      "actions": ["Generate Agent", "Copy Markdown", "Clear"],
      "tailwind": {
        "wrapper": "flex flex-col h-[calc(100vh-4rem)]",
        "message_list": "flex-1 overflow-y-auto px-3 py-4 space-y-3",
        "composer": "border-t border-[color:var(--border)] p-3"
      }
    },
    "dashboard": {
      "skeleton": [
        "Tabs: Keys | Usage | Settings",
        "Keys table with actions per row",
        "Dialogs for add/rotate/revoke"
      ],
      "table_columns": ["Name", "Provider", "Last Used", "Status", "Actions"]
    }
  },
  "code_scaffolds_js": {
    "omega_logo_component": "export const OmegaLogo = (props) => (\n  <svg width=\"28\" height=\"28\" viewBox=\"0 0 28 28\" aria-label=\"Omega Aurora Codex logo\" {...props}>\n    <defs>\n      <linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\">\n        <stop offset=\"0%\" stopColor=\"#06d6a0\"/>\n        <stop offset=\"100%\" stopColor=\"#1e3a8a\"/>\n      </linearGradient>\n    </defs>\n    <path d=\"M4 9c0-4 3.2-7 10-7s10 3 10 7c0 3.1-1.9 5.4-4.9 6.4 2.5 1.1 4.1 3.1 4.1 6.6h-3.6c0-3.2-1.8-5-5.6-5s-5.6 1.8-5.6 5H5.2c0-3.5 1.6-5.5 4.1-6.6C5.9 14.4 4 12.1 4 9z\" fill=\"none\" stroke=\"url(#g)\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\"/>\n    <circle cx=\"8\" cy=\"8\" r=\"1\" fill=\"#06d6a0\"/>\n    <circle cx=\"20\" cy=\"8\" r=\"1\" fill=\"#06d6a0\"/>\n  </svg>\n)\n",
    "education_selector": "import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'\nimport { Card } from './components/ui/card'\nimport { ScrollArea } from './components/ui/scroll-area'\nimport { Badge } from './components/ui/badge'\n\nexport const EducationSelector = () => {\n  const docs = ['Ω⁻⁹','Ω⁻⁴','Ω∞']\n  const perspectives = ['Child','Adult Non-Tech','Adult Tech']\n  return (\n    <div className=\"grid grid-cols-1 lg:grid-cols-12 gap-6\">\n      <div className=\"lg:col-span-4\">\n        <Tabs defaultValue=\"Ω⁻⁹\" className=\"w-full\">\n          <TabsList className=\"grid grid-cols-3\">\n            {docs.map(d => (\n              <TabsTrigger key={d} value={d} data-testid={\`education-doc-tab-${d}\`}>{d}</TabsTrigger>\n            ))}\n          </TabsList>\n          {docs.map(d => (\n            <TabsContent key={d} value={d}>\n              <div className=\"mt-3 flex flex-wrap gap-2\">\n                {perspectives.map(p => (\n                  <button key={p} className=\"px-3 h-9 rounded-[var(--radius)] border border-[color:var(--border)] hover:bg-[color:var(--muted)]/40\" data-testid={\`education-perspective-${p.toLowerCase().replace(/\\s/g,'-')}-button\`}>{p}</button>\n                ))}\n              </div>\n            </TabsContent>\n          ))}\n        </Tabs>\n      </div>\n      <Card className=\"lg:col-span-8 p-5 max-w-prose bg-[color:var(--surface)] border border-[color:var(--border)]\" data-testid=\"education-content-pane\">\n        <ScrollArea className=\"h-[65vh]\">\n          <article className=\"prose prose-invert\">\n            {/* Czech content goes here */}\n          </article>\n        </ScrollArea>\n      </Card>\n    </div>\n  )\n}\n",
    "chat_interface": "import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs'\nimport { Card } from './components/ui/card'\nimport { Textarea } from './components/ui/textarea'\nimport { Button } from './components/ui/button'\nimport { ScrollArea } from './components/ui/scroll-area'\nimport { useState } from 'react'\n\nexport const DemoChat = () => {\n  const presets = ['Customer Support','Lead Qualification','Content Planning','Market Research']\n  const [messages, setMessages] = useState([])\n  return (\n    <Card className=\"flex flex-col h-[calc(100vh-4rem)] bg-[color:var(--surface)] border border-[color:var(--border)]\">\n      <div className=\"p-3 border-b border-[color:var(--border)]\">\n        <Tabs defaultValue={presets[0]}>\n          <TabsList className=\"flex flex-wrap gap-2\" data-testid=\"demo-preset-select\">\n            {presets.map(p => (<TabsTrigger key={p} value={p}>{p}</TabsTrigger>))}\n          </TabsList>\n        </Tabs>\n      </div>\n      <ScrollArea className=\"flex-1 px-3 py-4 space-y-3\" data-testid=\"demo-message-list\">\n        {messages.map((m,i)=> (\n          <div key={i} className={m.role==='user'? 'ml-auto bg-[color:var(--surface-2)] border border-[color:var(--border)] rounded-2xl rounded-br-sm p-3 max-w-[70%]':'mr-auto border border-[color:var(--border)] rounded-2xl rounded-bl-sm p-3 max-w-[70%]'}>\n            <div className=\"text-sm text-[color:var(--muted-fg)] mb-1\">{m.role}</div>\n            <div className=\"whitespace-pre-wrap\">{m.content}</div>\n          </div>\n        ))}\n      </ScrollArea>\n      <div className=\"p-3 border-t border-[color:var(--border)] flex gap-2 items-end\">\n        <Textarea placeholder=\"Type your question…\" className=\"min-h-[56px]\" />\n        <Button className=\"h-12\" data-testid=\"demo-send-button\">Send</Button>\n      </div>\n    </Card>\n  )\n}\n",
    "api_keys_page": "import { Button } from './components/ui/button'\nimport { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog'\nimport { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'\nimport { Input } from './components/ui/input'\nimport { useState } from 'react'\n\nexport default function ApiKeysPage(){\n  const [open, setOpen] = useState(false)\n  const rows = []\n  return (\n    <div className=\"space-y-4\">\n      <div className=\"flex justify-between\">\n        <h1 className=\"text-2xl font-semibold\">API Keys</h1>\n        <Button onClick={()=>setOpen(true)} data-testid=\"dashboard-add-key-button\">Add key</Button>\n      </div>\n      <div className=\"rounded-[var(--radius)] border border-[color:var(--border)]\">\n        <Table>\n          <TableHeader>\n            <TableRow>\n              {['Name','Provider','Last Used','Status','Actions'].map(h=> (<TableHead key={h}>{h}</TableHead>))}\n            </TableRow>\n          </TableHeader>\n          <TableBody>\n            {rows.length===0 ? (\n              <TableRow><TableCell colSpan=\"5\" className=\"text-center text-[color:var(--muted-fg)]\">No keys yet</TableCell></TableRow>\n            ) : null}\n          </TableBody>\n        </Table>\n      </div>\n      <Dialog open={open} onOpenChange={setOpen}>\n        <DialogContent>\n          <DialogHeader><DialogTitle>Add API Key</DialogTitle></DialogHeader>\n          <div className=\"space-y-3\">\n            <Input placeholder=\"Name\"/>\n            <Input placeholder=\"Key\"/>\n            <div className=\"flex justify-end\"><Button onClick={()=>setOpen(false)}>Save</Button></div>\n          </div>\n        </DialogContent>\n      </Dialog>\n    </div>\n  )\n}\n"
  },
  "states": {
    "button": {
      "hover": "bg-[color:var(--primary)]/90",
      "focus": "ring-2 ring-[color:var(--accent)]",
      "disabled": "opacity-50 cursor-not-allowed"
    },
    "input": {
      "focus": "ring-2 ring-[color:var(--accent)] border-transparent",
      "error": "border-[color:var(--danger)] text-[color:var(--fg)]"
    }
  },
  "installation": {
    "packages": [
      "npm i framer-motion",
      "npm i react-markdown remark-gfm rehype-raw",
      "npm i react-syntax-highlighter"
    ],
    "notes": [
      "Use ./components/ui/sonner for toasts",
      "Prefer CSS radial overlays and subtle canvas lines for neural motifs; if using R3F, keep GPU usage minimal"
    ]
  },
  "testing": {
    "policy": "Every interactive element and key info must include data-testid. Use stable, role-based names.",
    "examples": [
      "<Button data-testid=\"login-form-submit-button\">Sign in</Button>",
      "<div data-testid=\"user-balance-text\">$1,250</div>",
      "<input data-testid=\"api-key-input\" />"
    ]
  },
  "instructions_to_main_agent": [
    "Apply color tokens via Tailwind inline styles using [color:var(--token)] where provided.",
    "Use shadcn components strictly from ./components/ui/ paths in this repo.",
    "Do not center-align the app container; use left-aligned content with generous spacing.",
    "Keep gradients to decorative layers only and below 20% of viewport.",
    "Ensure all interactive elements have data-testid attributes.",
    "For education pages, set lang=cs and use max-w-prose for reading comfort.",
    "No transition: all. Only animate specific properties.",
    "Adopt mobile-first breakpoints; test on 360px width devices."
  ],
  "appendix_general_ui_ux_guidelines": "- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals."
}
