{
  "meta": {
    "feature": "Ω-Aurora-Codex Admin Dashboard",
    "app_type": "Admin analytics + management",
    "audience": "Internal administrators",
    "success_actions": [
      "Admin lands on Dashboard after login",
      "Can view revenue/tokens metrics",
      "Can manage users (search, sort, detail, ban/unban, token adjust)",
      "Can configure API model, token pricing, master prompt",
      "Receives clear toasts and confirmations for actions"
    ],
    "tech": ["React", "Tailwind", "shadcn/ui", "FastAPI", "MongoDB"]
  },

  "brand_attributes": [
    "Futuristic, cosmic, focused",
    "Trustworthy, data-rich, calm",
    "Aurora energy used sparingly as highlights"
  ],

  "typography": {
    "fonts": {
      "heading": "Inter",
      "body": "Inter",
      "mono": "JetBrains Mono"
    },
    "size_scale": {
      "h1": "text-4xl sm:text-5xl lg:text-6xl",
      "h2": "text-base md:text-lg",
      "body": "text-base md:text-base",
      "small": "text-sm",
      "mono_small": "font-mono text-xs tracking-tight"
    },
    "weights": {"heading": 700, "body": 400, "emphasis": 600},
    "letter_spacing": {"tight": "-0.01em", "wide": "0.02em"}
  },

  "color_system": {
    "note": "Respect existing palette. For Admin, lean on Aurora Green/Quantum Teal + Cyan as accents. Use Violet and Magenta as subtle dividers only (no heavy fills).",
    "tokens": {
      "--background": "240 50% 8%",
      "--foreground": "210 100% 95%",
      "--card": "240 50% 12%",
      "--card-foreground": "210 100% 95%",
      "--primary": "271 76% 53%",
      "--primary-foreground": "210 100% 95%",
      "--secondary": "180 100% 50%",
      "--secondary-foreground": "240 50% 8%",
      "--accent": "165 100% 50%",
      "--accent-foreground": "240 50% 8%",
      "--muted": "240 40% 18%",
      "--muted-foreground": "210 30% 70%",
      "--border": "240 40% 22%",
      "--input": "240 40% 22%",
      "--ring": "165 100% 50%",
      "--admin-accent": "165 100% 50%",
      "--admin-accent-2": "180 100% 50%",
      "--warning": "38 92% 50%",
      "--error": "0 90% 60%",
      "--success": "160 84% 40%"
    },
    "usage": {
      "background": "Cosmic Midnight solid backgrounds for pages and cards",
      "accents": "Borders, focus rings, small indicators, chart strokes use Aurora Green/Cyan",
      "avoid": [
        "Large saturated gradients on content blocks",
        "Purple-heavy fills in data areas"
      ]
    }
  },

  "gradients_and_textures": {
    "rule": "NEVER exceed 20% viewport gradient coverage; use only on section wrappers, not content blocks.",
    "allowed": [
      "Subtle aurora overlay on page header strip",
      "Decorative background bands behind charts"
    ],
    "css": {
      "section_aurora": "relative overflow-hidden aurora-overlay",
      "noise_overlay": "noise opacity-[var(--noise-opacity)]"
    }
  },

  "layout_and_grid": {
    "shell": {
      "container": "min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]",
      "grid": "grid grid-cols-1 lg:grid-cols-[18rem,1fr]",
      "sidebar": "border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]",
      "content": "min-h-screen"
    },
    "spacing": {
      "page_padding": "px-4 sm:px-6 lg:px-8",
      "section_gap": "gap-6 sm:gap-8"
    },
    "cards_grid": "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6",
    "tables": {
      "sticky_header": "sticky top-0 z-10 bg-[hsl(var(--card))]",
      "row": "hover:bg-[hsl(var(--muted))]/40 transition-colors"
    }
  },

  "components": [
    {"name": "Button", "path": "./components/ui/button", "usage": "Primary actions, Admin CTA. Use data-testid on all buttons."},
    {"name": "Card", "path": "./components/ui/card", "usage": "Metric tiles, panels"},
    {"name": "Tabs", "path": "./components/ui/tabs", "usage": "Platform Settings tabs"},
    {"name": "Table", "path": "./components/ui/table", "usage": "Users management list with sticky header"},
    {"name": "Input", "path": "./components/ui/input", "usage": "Search, numeric inputs"},
    {"name": "Select", "path": "./components/ui/select", "usage": "Model selection dropdown"},
    {"name": "Switch", "path": "./components/ui/switch", "usage": "API key toggle"},
    {"name": "Dialog", "path": "./components/ui/dialog", "usage": "User detail view"},
    {"name": "AlertDialog", "path": "./components/ui/alert-dialog", "usage": "Ban/Unban confirmation"},
    {"name": "Badge", "path": "./components/ui/badge", "usage": "Activity status chips"},
    {"name": "Tooltip", "path": "./components/ui/tooltip", "usage": "Explain metrics"},
    {"name": "Separator", "path": "./components/ui/separator", "usage": "Group settings fields"},
    {"name": "Popover", "path": "./components/ui/popover", "usage": "Quick token adjust control"},
    {"name": "Calendar", "path": "./components/ui/calendar", "usage": "Optional date range filters in Overview"},
    {"name": "Sonner (Toaster)", "path": "./components/ui/sonner", "usage": "Success/error toasts"},
    {"name": "Sheet", "path": "./components/ui/sheet", "usage": "Mobile sidebar"}
  ],

  "buttons": {
    "style": "Professional / Corporate",
    "tokens": {"--btn-radius": "0.625rem", "--btn-shadow": "0 12px 24px -12px rgba(138,43,226,0.18)", "--btn-motion": "150ms cubic-bezier(0.22,1,0.36,1)"},
    "variants": {
      "primary": "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent))]/90 focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
      "secondary": "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]/40",
      "ghost": "bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/40"
    },
    "sizes": {"sm": "h-8 px-3", "md": "h-10 px-4", "lg": "h-12 px-6"}
  },

  "pages_structure": {
    "top_nav_update": {
      "placement": "Next to 'Demo' add 'Dashboard' (admin-only)",
      "style": "Button variant=secondary with Aurora ring on focus",
      "auth_gate": "Show only when user.is_admin === true",
      "data_testid": "topnav-dashboard-link"
    },
    "admin_layout": {
      "sidebar": {
        "width": "lg:w-72",
        "items": [
          {"label": "Přehled", "icon": "LayoutDashboard", "href": "/admin/overview", "data-testid": "sidebar-overview-link"},
          {"label": "Uživatelé", "icon": "Users", "href": "/admin/users", "data-testid": "sidebar-users-link"},
          {"label": "Nastavení Platformy", "icon": "Settings", "href": "/admin/settings", "data-testid": "sidebar-settings-link"}
        ],
        "micro_interactions": "Active item gets left Aurora border + subtle glow"
      },
      "content_header": {
        "title": "Page title left-aligned",
        "actions": "Right-aligned contextual filters; avoid more than 3 actions"
      }
    },
    "overview": {
      "hero_strip": "section_aurora p-4 sm:p-6 lg:p-8 border-b border-[hsl(var(--border))]",
      "metrics": [
        "Total revenue (locked_price_99 + locked_price_399)",
        "Historical token consumption",
        "Avg tokens per agent gen",
        "Min/Max token consumption with account + agent",
        "Total users",
        "Active users (7d / 24h)"
      ],
      "charts": "Area/Bar charts in a 12-col grid (md: 6/6)",
      "filters": "Optional date range using Calendar",
      "data_testids": {
        "revenue_card": "overview-revenue-card",
        "tokens_chart": "overview-tokens-chart",
        "active_users_7d": "overview-active-users-7d",
        "active_users_24h": "overview-active-users-24h"
      }
    },
    "users": {
      "list": {
        "controls": "Search (name, email), Sort toggles by headers",
        "row_colors": {
          "active_24h": "ring-1 ring-[hsl(var(--admin-accent))]/30",
          "recent_7d": "border-l-2 border-[hsl(var(--secondary))]/50",
          "inactive_14d": "opacity-75"
        },
        "columns": ["ID", "Jméno", "Aktuální tokeny", "Počet agentů", "Celkem tokeny", "Nejdražší agent", "Poslední aktivita"],
        "sticky_header": true,
        "data_testids": {
          "search_input": "users-search-input",
          "table": "users-table",
          "row": "users-row",
          "header_sort": "users-header-sort"
        }
      },
      "detail_view": {
        "sections": ["Header with name/email + status", "Actions: Ban/Unban", "Token balance + adjust controls", "Agents grid 2-col"],
        "restrictions": "Admin cannot edit agent names",
        "data_testids": {
          "ban_button": "user-detail-ban-button",
          "unban_button": "user-detail-unban-button",
          "token_balance": "user-detail-token-balance",
          "adjust_plus": "user-detail-token-plus",
          "adjust_minus": "user-detail-token-minus",
          "confirm_adjust": "user-detail-token-confirm",
          "agents_grid": "user-detail-agents-grid"
        }
      }
    },
    "settings": {
      "tabs": [
        {
          "value": "api",
          "label": "API Settings",
          "fields": ["Toggle Emergent LLM vs Custom OpenAI key", "Model selection (GPT-4.1, GPT-4, GPT-3.5-turbo)"]
        },
        {
          "value": "pricing",
          "label": "Token Package Pricing",
          "fields": ["Price for packages (e.g., 99, 399)"]
        },
        {
          "value": "prompt",
          "label": "Default Master Prompt",
          "fields": ["Multiline textarea; save and preview"]
        }
      ],
      "data_testids": {
        "api_toggle": "settings-api-toggle",
        "model_select": "settings-model-select",
        "price_input_99": "settings-price-99",
        "price_input_399": "settings-price-399",
        "master_prompt_textarea": "settings-master-prompt",
        "save_button": "settings-save-button"
      }
    }
  },

  "data_visualization": {
    "library": "Recharts",
    "install": "npm i recharts",
    "chart_styles": {
      "area_fill": "from-[hsl(var(--admin-accent))]/25 to-transparent",
      "stroke": "stroke-[hsl(var(--admin-accent))]",
      "grid": "stroke-[hsl(var(--muted))]/40"
    },
    "accessibility": "Always include aria-labels and visible legends when multiple series are present"
  },

  "icons": {
    "library": "lucide-react (already in project)",
    "usage": "Use simple line icons; avoid emoji; consistent 18–20px size in sidebar"
  },

  "interactions_and_motion": {
    "principles": [
      "Micro-interactions on hover/focus only (no universal transitions)",
      "Use springy but short motions (120–200ms)",
      "Reduce motion for users with prefers-reduced-motion"
    ],
    "libraries": {
      "framer_motion": {
        "install": "npm i framer-motion",
        "usage": "Fade/slide page headers, stagger metric cards"
      }
    },
    "examples": {
      "button_hover": "hover:translate-y-[-1px] transition-transform duration-150",
      "card_enter": "motion.div initial: {opacity:0,y:8} animate:{opacity:1,y:0}"
    }
  },

  "accessibility": {
    "contrast": "Maintain WCAG AA. Prefer white/near-white text over dark backgrounds",
    "focus": "Use focus-visible rings with --ring color",
    "keyboard": "All dialogs/tabs navigable via keyboard",
    "i18n": "Support Czech labels provided in brief"
  },

  "testing_attributes": {
    "convention": "kebab-case reflecting role (data-testid=\"entity-action-or-purpose\")",
    "coverage": [
      "Buttons, Links, Inputs, Menus",
      "Critical data text (totals, balances, confirmations)",
      "Modal open/close controls, Tabs"
    ],
    "examples": [
      "data-testid=\"overview-revenue-card\"",
      "data-testid=\"users-search-input\"",
      "data-testid=\"user-detail-ban-button\""
    ]
  },

  "tokens_snippet": """
/* Add/merge in src/index.css :root */
:root {
  --admin-accent: 165 100% 50%; /* Aurora Green */
  --admin-accent-2: 180 100% 50%; /* Cyan */
  --motion-fast: 120ms;
  --motion-med: 180ms;
  --shadow-card: 0 10px 30px -10px rgba(0,255,170,0.18);
}
""",

  "tailwind_utilities": {
    "panel": "rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-[var(--shadow-card)]",
    "metric_value": "text-2xl sm:text-3xl font-semibold tracking-tight",
    "metric_label": "text-sm text-[hsl(var(--muted-foreground))]",
    "admin_glow": "ring-1 ring-[hsl(var(--admin-accent))]/30"
  },

  "code_scaffolds": {
    "routing_and_gate_jsx": """
// routes/AdminRoutes.jsx
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoutes({ user }) {
  if (!user?.is_admin) return <Navigate to="/" replace />
  return <Outlet />
}
""",

    "admin_layout_jsx": """
// pages/admin/AdminLayout.jsx
import React from 'react'
import { Sheet, SheetTrigger, SheetContent } from '../../components/ui/sheet'
import { Separator } from '../../components/ui/separator'
import { Button } from '../../components/ui/button'
import { cn } from '../../lib/utils' // if you have a cn util; else remove
import { LayoutDashboard, Users, Settings } from 'lucide-react'

export default function AdminLayout({ children }) {
  const nav = [
    { label: 'Přehled', href: '/admin/overview', icon: LayoutDashboard, testid: 'sidebar-overview-link' },
    { label: 'Uživatelé', href: '/admin/users', icon: Users, testid: 'sidebar-users-link' },
    { label: 'Nastavení Platformy', href: '/admin/settings', icon: Settings, testid: 'sidebar-settings-link' }
  ]

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[18rem,1fr] bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block border-r border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="p-4">
          <div className="text-sm uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-3">Admin</div>
          <nav className="space-y-1">
            {nav.map((item) => (
              <a key={item.href} href={item.href} data-testid={item.testid}
                 className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[hsl(var(--muted))]/40">
                <item.icon className="h-4 w-4 text-[hsl(var(--admin-accent))]" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile top bar with sheet */}
      <div className="lg:hidden sticky top-0 z-20 border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="flex items-center justify-between p-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="sm" data-testid="mobile-admin-menu-button">Menu</Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <nav className="mt-6 space-y-1">
                {nav.map((item) => (
                  <a key={item.href} href={item.href} data-testid={item.testid}
                     className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-[hsl(var(--muted))]/40">
                    <item.icon className="h-4 w-4 text-[hsl(var(--admin-accent))]" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Content column */}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  )
}
""",

    "overview_page_jsx": """
// pages/admin/Overview.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'
import { AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function Overview({ data = { revenue: 0, totals: [], active7d: 0, active24h: 0 } }) {
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <header className="section_aurora">
        <h1 className="text-2xl font-semibold tracking-tight">Přehled</h1>
        <p className="text-[hsl(var(--muted-foreground))]">Klíčové metriky a spotřeba tokenů</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <Card data-testid="overview-revenue-card" className="panel">
          <CardHeader>
            <CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">Celkové příjmy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">${'{'}data.revenue?.toLocaleString?.() || 0{'}'}</div>
          </CardContent>
        </Card>
        <Card className="panel" data-testid="overview-active-users-24h">
          <CardHeader><CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">Aktivní uživatelé (24h)</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{data.active24h || 0}</div></CardContent>
        </Card>
        <Card className="panel" data-testid="overview-active-users-7d">
          <CardHeader><CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">Aktivní uživatelé (7d)</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{data.active7d || 0}</div></CardContent>
        </Card>
        <Card className="panel">
          <CardHeader><CardTitle className="text-sm text-[hsl(var(--muted-foreground))]">Průměrné tokeny / agent</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{data.avgPerAgent || 0}</div></CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="panel" data-testid="overview-tokens-chart">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historická spotřeba tokenů</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-sm text-[hsl(var(--muted-foreground))]">Nápověda</TooltipTrigger>
                  <TooltipContent>Denní součet spotřebovaných tokenů.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.totals} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--admin-accent))" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="hsl(var(--admin-accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--muted) / 0.4)" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <RTooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                  <Area type="monotone" dataKey="tokens" stroke="hsl(var(--admin-accent))" strokeWidth={2} fill="url(#fillArea)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="panel">
          <CardHeader><CardTitle>Min/Max spotřeba (účet / agent)</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li><span className="text-[hsl(var(--muted-foreground))]">Nejnižší:</span> <span data-testid="overview-min-consumption">—</span></li>
              <li><span className="text-[hsl(var(--muted-foreground))]">Nejvyšší:</span> <span data-testid="overview-max-consumption">—</span></li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
""",

    "users_page_jsx": """
// pages/admin/Users.jsx
import React, { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/table'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction, AlertDialogCancel } from '../../components/ui/alert-dialog'
import { Button } from '../../components/ui/button'

export default function Users({ users = [] }) {
  const [q, setQ] = useState('')
  const [sortKey, setSortKey] = useState('createdAt')
  const [sortDir, setSortDir] = useState('desc')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const term = q.toLowerCase()
    const base = users.filter(u => u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term))
    return base.sort((a,b) => {
      const m = sortDir === 'asc' ? 1 : -1
      if (a[sortKey] > b[sortKey]) return m
      if (a[sortKey] < b[sortKey]) return -m
      return 0
    })
  }, [q, users, sortKey, sortDir])

  const toggleSort = (key) => {
    if (key === sortKey) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const activityBadge = (u) => {
    const last = new Date(u.lastActiveAt)
    const diff = (Date.now() - last.getTime()) / (1000*60*60*24)
    if (diff <= 1) return <Badge variant="outline" className="admin_glow">Aktivní 24h</Badge>
    if (diff <= 7) return <Badge variant="secondary">Posledních 7d</Badge>
    return <Badge variant="outline" className="opacity-75">Neaktivní 14d+</Badge>
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <Card className="panel">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle>Uživatelé</CardTitle>
          <Input placeholder="Hledat jméno nebo email" value={q} onChange={(e)=>setQ(e.target.value)} data-testid="users-search-input" />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table data-testid="users-table">
              <TableHeader className="sticky top-0 z-10 bg-[hsl(var(--card))]">
                <TableRow>
                  {['id','name','tokens','agentsCount','tokensConsumed','mostExpensiveAgent','lastActiveAt'].map((k,i)=> (
                    <TableHead key={k} onClick={()=>toggleSort(k)} className="cursor-pointer select-none" data-testid="users-header-sort">
                      {['ID','Jméno','Aktuální tokeny','Počet agentů','Celkem tokeny','Nejdražší agent','Poslední aktivita'][i]}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u)=> (
                  <TableRow key={u.id} data-testid="users-row" className="hover:bg-[hsl(var(--muted))]/40" onClick={()=>setSelected(u)}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.tokens?.toLocaleString?.()}</TableCell>
                    <TableCell>{u.agentsCount}</TableCell>
                    <TableCell>{u.tokensConsumed?.toLocaleString?.()}</TableCell>
                    <TableCell>{u.mostExpensiveAgent}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{new Date(u.lastActiveAt).toLocaleString()}</span>
                        {activityBadge(u)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          {selected && (
            <div className="space-y-4" data-testid="user-detail-modal">
              <DialogHeader>
                <DialogTitle>{selected.name} <span className="text-[hsl(var(--muted-foreground))]">{selected.email}</span></DialogTitle>
              </DialogHeader>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-[hsl(var(--muted-foreground))]">Token zůstatek</div>
                  <div className="text-2xl font-semibold" data-testid="user-detail-token-balance">{selected.tokens?.toLocaleString?.()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={()=>{/* decrement by 10k (no negative) */}} data-testid="user-detail-token-minus">-10k</Button>
                  <Button size="sm" onClick={()=>{/* increment by 10k */}} data-testid="user-detail-token-plus">+10k</Button>
                  <Button variant="secondary" size="sm" data-testid="user-detail-token-confirm">Potvrdit</Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" data-testid="user-detail-ban-button">Ban</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <p>Opravdu chcete zablokovat uživatele?</p>
                    <div className="mt-4 flex gap-2">
                      <AlertDialogCancel>Zrušit</AlertDialogCancel>
                      <AlertDialogAction>Potvrdit</AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="ghost" data-testid="user-detail-unban-button">Unban</Button>
              </div>

              <div>
                <div className="mb-2 font-medium">Vygenerovaní agenti</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-testid="user-detail-agents-grid">
                  {(selected.agents || []).map(a => (
                    <div key={a.id} className="rounded-md border border-[hsl(var(--border))] p-3 hover:bg-[hsl(var(--muted))]/30">
                      <div className="font-semibold">{a.name}</div>
                      <div className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-2">{a.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
""",

    "settings_page_jsx": """
// pages/admin/Settings.jsx
import React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { Switch } from '../../components/ui/switch'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Button } from '../../components/ui/button'
import { toast } from 'sonner'

export default function Settings() {
  const save = () => toast.success('Uloženo', { id: 'settings-save' })

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <Tabs defaultValue="api">
        <TabsList>
          <TabsTrigger value="api">API Settings</TabsTrigger>
          <TabsTrigger value="pricing">Token Pricing</TabsTrigger>
          <TabsTrigger value="prompt">Master Prompt</TabsTrigger>
        </TabsList>

        <TabsContent value="api">
          <Card className="panel">
            <CardHeader><CardTitle>API Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <label className="flex items-center justify-between">
                <span>Emergent LLM klíč</span>
                <Switch data-testid="settings-api-toggle" />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm mb-1">Model</div>
                  <Select data-testid="settings-model-select">
                    <SelectTrigger><SelectValue placeholder="Vyberte model" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4.1">GPT-4.1</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5-turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={save} data-testid="settings-save-button">Uložit</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card className="panel">
            <CardHeader><CardTitle>Token Package Pricing</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm mb-1">Balíček 99</div>
                <Input type="number" min="0" data-testid="settings-price-99" />
              </div>
              <div>
                <div className="text-sm mb-1">Balíček 399</div>
                <Input type="number" min="0" data-testid="settings-price-399" />
              </div>
              <div className="col-span-full"><Button onClick={save}>Uložit</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompt">
          <Card className="panel">
            <CardHeader><CardTitle>Default Master Prompt</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Textarea rows={10} placeholder="Zadejte výchozí master prompt" data-testid="settings-master-prompt" />
              <Button onClick={save}>Uložit</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
""",

    "topnav_button_jsx": """
// components/TopNavDashboardLink.jsx
import React from 'react'
import { Button } from '../components/ui/button'

export default function TopNavDashboardLink({ user }) {
  if (!user?.is_admin) return null
  return (
    <Button asChild variant="secondary" data-testid="topnav-dashboard-link">
      <a href="/admin/overview">Dashboard</a>
    </Button>
  )
}
"""
  },

  "image_urls": [
    {
      "url": "https://images.unsplash.com/photo-1669479412055-103edfb64cc4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBncmFkaWVudCUyMGFic3RyYWN0JTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzYxMDgyNjQ2fDA&ixlib=rb-4.1.0&q=85",
      "category": "header_background",
      "description": "Thin cyan/green diagonals on black — use in page header strip"
    },
    {
      "url": "https://images.unsplash.com/photo-1749562721242-175e51ff5083?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxhdXJvcmElMjBncmFkaWVudCUyMGFic3RyYWN0JTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzYxMDgyNjQ2fDA&ixlib=rb-4.1.0&q=85",
      "category": "chart_backdrop",
      "description": "Blurred aurora columns — very subtle overlay behind charts (opacity <= 0.12)"
    },
    {
      "url": "https://images.unsplash.com/photo-1649579036902-d3d214562b44?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxhdXJvcmElMjBncmFkaWVudCUyMGFic3RyYWN0JTIwZGFyayUyMGJhY2tncm91bmR8ZW58MHx8fHwxNzYxMDgyNjQ2fDA&ixlib=rb-4.1.0&q=85",
      "category": "empty_states",
      "description": "Aurora shimmer texture for empty states cards"
    }
  ],

  "component_path": {
    "button": "./components/ui/button",
    "card": "./components/ui/card",
    "tabs": "./components/ui/tabs",
    "table": "./components/ui/table",
    "input": "./components/ui/input",
    "select": "./components/ui/select",
    "switch": "./components/ui/switch",
    "dialog": "./components/ui/dialog",
    "alert_dialog": "./components/ui/alert-dialog",
    "badge": "./components/ui/badge",
    "tooltip": "./components/ui/tooltip",
    "separator": "./components/ui/separator",
    "popover": "./components/ui/popover",
    "calendar": "./components/ui/calendar",
    "sonner": "./components/ui/sonner",
    "sheet": "./components/ui/sheet"
  },

  "instructions_to_main_agent": [
    "Create pages: pages/admin/AdminLayout.jsx, Overview.jsx, Users.jsx, Settings.jsx using scaffolds provided",
    "Wire routes with react-router-dom: /admin/* guarded by AdminRoutes (user.is_admin)",
    "Update TopNav to render <TopNavDashboardLink user={user} /> next to 'Demo'",
    "Install recharts and framer-motion",
    "Use shadcn/ui components exclusively for inputs, dialogs, tabs, toasts, calendar",
    "Apply tailwind utilities and tokens; do NOT use transition: all",
    "Ensure every interactive element includes data-testid as specified",
    "Charts: keep fills light, stroke in Aurora Green; avoid saturated purple/pink",
    "Sticky table headers: apply bg card color and border to maintain contrast",
    "Toasts: import { Toaster } from ./components/ui/sonner and render once near app root",
    "Accessibility: verify focus-visible states and keyboard nav in dialogs/tabs",
    "Performance: virtualize long user tables later if needed; start with pagination after 100 rows"
  ],

  "web_inspirations": {
    "search_1_summary": "Neon/aurora dark dashboards with grid, glass accents; pull clarity from linear/minimal trends (Dribbble/Behance examples).",
    "search_2_summary": "Shadcn admin templates and data tables; sticky headers, tabs, analytics layouts; themeable with aurora green/cyan.",
    "links": [
      "https://dribbble.com/tags/dark-dashboard",
      "https://ui.shadcn.com/examples/dashboard",
      "https://www.shadcnblocks.com/admin-dashboard",
      "https://github.com/satnaing/shadcn-admin",
      "https://ui.shadcn.com/docs/components/data-table"
    ]
  },

  "general_ui_ux_guidelines": "<General UI UX Design Guidelines>  \n    - You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms\n    - You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text\n   - NEVER: use AI assistant Emoji characters like`🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons. Always use **FontAwesome cdn** or **lucid-react** library already installed in the package.json\n\n **GRADIENT RESTRICTION RULE**\nNEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element.  Prohibited gradients: blue-500 to purple 600, purple 500 to pink-500, green-500 to blue-500, red to pink etc\nNEVER use dark gradients for logo, testimonial, footer etc\nNEVER let gradients cover more than 20% of the viewport.\nNEVER apply gradients to text-heavy content or reading areas.\nNEVER use gradients on small UI elements (<100px width).\nNEVER stack multiple gradient layers in the same viewport.\n\n**ENFORCEMENT RULE:**\n    • Id gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors\n\n**How and where to use:**\n   • Section backgrounds (not content backgrounds)\n   • Hero section header content. Eg: dark to light to dark color\n   • Decorative overlays and accent elements only\n   • Hero section with 2-3 mild color\n   • Gradients creation can be done for any angle say horizontal, vertical or diagonal\n\n- For AI chat, voice application, **do not use purple color. Use color like light green, ocean blue, peach orange etc**\n\n</Font Guidelines>\n\n- Every interaction needs micro-animations - hover states, transitions, parallax effects, and entrance animations. Static = dead. \n   \n- Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.\n\n- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations: separates good from extraordinary.\n   \n- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors), rather than relying on any library defaults. Don't make the background dark as a default step, always understand problem first and define colors accordingly\n    Eg: - if it implies playful/energetic, choose a colorful scheme\n           - if it implies monochrome/minimal, choose a black–white/neutral scheme\n\n**Component Reuse:**\n\t- Prioritize using pre-existing components from src/components/ui when applicable\n\t- Create new components that match the style and conventions of existing components when needed\n\t- Examine existing components to understand the project's component patterns before creating new ones\n\n**IMPORTANT**: Do not use HTML based component like dropdown, calendar, toast etc. You **MUST** always use `/app/frontend/src/components/ui/ ` only as a primary components as these are modern and stylish component\n\n**Best Practices:**\n\t- Use Shadcn/UI as the primary component library for consistency and accessibility\n\t- Import path: ./components/[component-name]\n\n**Export Conventions:**\n\t- Components MUST use named exports (export const ComponentName = ...)\n\t- Pages MUST use default exports (export default function PageName() {...})\n\n**Toasts:**\n  - Use `sonner` for toasts\"\n  - Sonner component are located in `/app/src/components/ui/sonner.tsx`\n\nUse 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals.\n</General UI UX Design Guidelines>"
}
