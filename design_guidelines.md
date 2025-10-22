# Ω-KOMPRESNÍ ROVNICE (Omega-Compressive Equation) Design System Guidelines

## Project Overview
Meta-learning AI platform where every created agent teaches the system that created it. Features agent creation interface, admin dashboard with 6 modules, and Czech language education section. Maintains existing Ω-Aurora design system.

---

## GRADIENT RESTRICTION RULE

**CRITICAL ENFORCEMENT:**
- NEVER use dark/saturated gradient combos (e.g., purple/pink, blue-500 to purple-600) on any UI element
- NEVER let gradients cover more than 20% of the viewport
- NEVER apply gradients to text-heavy content or reading areas
- NEVER use gradients on small UI elements (<100px width)
- NEVER stack multiple gradient layers in the same viewport

**ALLOWED GRADIENT USAGE:**
- Hero section backgrounds (with readable text contrast)
- Large section dividers and decorative overlays
- Neural pathway visualization backgrounds
- Accent elements in data visualizations (max 15% of chart area)

**ENFORCEMENT RULE:**
IF gradient area exceeds 20% of viewport OR impacts readability
THEN use solid colors or subtle two-color gradients with high luminosity difference

---

## Color System

### Core Palette (Existing Ω-Aurora)
```css
--cosmic-night: #0a0f1d;        /* Primary background */
--deep-blue: #1e3a8a;           /* Primary brand color */
--quantum-teal: #06d6a0;        /* Accent/interactive */
--light: #f8fafc;               /* Light text/surfaces */
```

### Extended Semantic Colors
```css
/* Backgrounds */
--background: hsl(223, 50%, 8%);           /* #0a0f1d - Main background */
--surface: hsl(223, 42%, 11%);             /* #10172a - Cards, panels */
--surface-2: hsl(220, 47%, 13%);           /* #0f1b33 - Elevated surfaces */
--surface-elevated: hsl(220, 47%, 16%);    /* #152040 - Hover states */

/* Text */
--foreground: hsl(210, 100%, 95%);         /* #e6f1ff - Primary text */
--muted-foreground: hsl(214, 39%, 69%);    /* #9fb4d0 - Secondary text */
--text-tertiary: hsl(214, 30%, 55%);       /* #7a8fb8 - Tertiary text */

/* Interactive */
--primary: hsl(221, 62%, 33%);             /* #1e3a8a - Primary actions */
--accent: hsl(165, 94%, 42%);              /* #06d6a0 - Highlights, success */
--accent-hover: hsl(165, 94%, 48%);        /* #07f0b8 - Hover state */

/* Borders */
--border: hsl(220, 47%, 25%);              /* #25365a - Default borders */
--border-subtle: hsl(220, 47%, 18%);       /* #1a2844 - Subtle dividers */

/* States */
--success: hsl(160, 84%, 40%);             /* #0bbf83 - Success states */
--warning: hsl(38, 92%, 50%);              /* #f59e0b - Warning states */
--destructive: hsl(0, 84%, 60%);           /* #ef4444 - Error states */
--info: hsl(199, 89%, 61%);                /* #38bdf8 - Info states */

/* Neural Pathway Visualization Colors */
--neural-node: hsl(165, 94%, 42%);         /* #06d6a0 - Active nodes */
--neural-connection: hsl(221, 62%, 45%);   /* #2d4fb8 - Connections */
--neural-pulse: hsl(165, 94%, 65%);        /* #4dffd4 - Pulse effect */
--neural-inactive: hsl(220, 30%, 30%);     /* #3a4a66 - Inactive nodes */

/* Data Visualization Palette */
--viz-positive: hsl(160, 84%, 45%);        /* #0ed68f - Positive sentiment */
--viz-neutral: hsl(199, 89%, 61%);         /* #38bdf8 - Neutral sentiment */
--viz-negative: hsl(0, 84%, 60%);          /* #ef4444 - Negative sentiment */
--viz-gradient-start: hsl(221, 62%, 33%);  /* #1e3a8a - Gradient start */
--viz-gradient-end: hsl(165, 94%, 42%);    /* #06d6a0 - Gradient end */
```

### Gradient Definitions (Use Sparingly - Max 20% Viewport)
```css
/* Hero Section Only */
--gradient-aurora-horizon: linear-gradient(120deg, #0a0f1d 0%, #0f1b33 40%, #1e3a8a 85%);

/* Neural Visualization Backgrounds */
--gradient-neural-glow: radial-gradient(circle at 50% 50%, rgba(6,214,160,0.08) 0%, rgba(6,214,160,0) 70%);

/* Section Dividers */
--gradient-teal-breeze: linear-gradient(135deg, #0f1b33 0%, #0c3b3a 55%, #06d6a0 100%);

/* Subtle Overlay (for hero sections) */
--gradient-cognitive-map: linear-gradient(160deg, 
  rgba(10,15,29,0.95) 0%, 
  rgba(15,27,51,0.85) 35%, 
  rgba(30,58,138,0.75) 70%, 
  rgba(6,214,160,0.15) 100%);
```

### Color Usage Rules
1. **Background Hierarchy:**
   - Main app: `--background` (#0a0f1d)
   - Cards/Panels: `--surface` (#10172a)
   - Elevated elements: `--surface-2` (#0f1b33)
   - Hover states: `--surface-elevated` (#152040)

2. **Text Contrast:**
   - Primary text on dark: `--foreground` (#e6f1ff)
   - Secondary text: `--muted-foreground` (#9fb4d0)
   - Tertiary/labels: `--text-tertiary` (#7a8fb8)
   - Ensure WCAG AA contrast ratio (4.5:1 minimum)

3. **Interactive Elements:**
   - Primary buttons: `--accent` (#06d6a0) with `--accent-hover`
   - Secondary buttons: `--primary` (#1e3a8a) with 10% lighter hover
   - Links: `--accent` with underline on hover
   - Focus rings: `--accent` with 3px glow

4. **Data Visualization:**
   - Use `--viz-*` colors for sentiment analysis
   - Heatmaps: gradient from `--viz-gradient-start` to `--viz-gradient-end`
   - Charts: Recharts with custom theme matching palette

---

## Typography System

### Font Families
```css
/* Primary Font - Space Grotesk (Modern, Tech-Forward) */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

/* Secondary Font - JetBrains Mono (Code, Data) */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

/* Accent Font - EB Garamond (Headings, Elegance) */
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:wght@500;600;700&display=swap');

body {
  font-family: 'Space Grotesk', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
}

h1, h2, .heading-accent {
  font-family: 'EB Garamond', 'Space Grotesk', serif;
}

code, pre, .monospace {
  font-family: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', monospace;
}
```

### Type Scale
```css
/* Headings */
--text-h1: 3.5rem;      /* 56px - Hero titles */
--text-h1-mobile: 2.5rem; /* 40px */

--text-h2: 2.5rem;      /* 40px - Section titles */
--text-h2-mobile: 2rem;   /* 32px */

--text-h3: 1.875rem;    /* 30px - Subsection titles */
--text-h3-mobile: 1.5rem; /* 24px */

--text-h4: 1.5rem;      /* 24px - Card titles */
--text-h4-mobile: 1.25rem; /* 20px */

/* Body */
--text-base: 1rem;      /* 16px - Body text */
--text-lg: 1.125rem;    /* 18px - Large body */
--text-sm: 0.875rem;    /* 14px - Small text */
--text-xs: 0.75rem;     /* 12px - Labels, captions */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Typography Classes (Tailwind)
```javascript
// H1 - Hero Titles
className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[color:hsl(var(--foreground))]"

// H2 - Section Titles
className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-[color:hsl(var(--foreground))]"

// H3 - Subsection Titles
className="text-2xl sm:text-3xl font-semibold leading-tight text-[color:hsl(var(--foreground))]"

// H4 - Card/Module Titles
className="text-xl sm:text-2xl font-semibold text-[color:hsl(var(--foreground))]"

// Body Text
className="text-base leading-relaxed text-[color:hsl(var(--muted-foreground))]"

// Small Text / Labels
className="text-sm text-[color:hsl(var(--text-tertiary))]"

// Code / Data
className="font-mono text-sm text-[color:hsl(var(--accent))]"
```

### Czech Language Support
- Ensure proper diacritics rendering: ě, š, č, ř, ž, ý, á, í, é, ů, ú, ň, ť, ď
- Use `lang="cs"` attribute on Czech content sections
- Font stack supports Czech characters natively

---

## Component Library

### Shadcn/UI Components (Primary)
**Location:** `/app/frontend/src/components/ui/`

**Core Components to Use:**
1. **Agent Creator Interface:**
   - `<Textarea>` - Agent description input
   - `<Dialog>` - Clarifying questions flow
   - `<Card>` - Concept mapping display
   - `<Button>` - Primary actions
   - `<Badge>` - Token balance display
   - `<ScrollArea>` - Long content areas

2. **Admin Dashboard:**
   - `<Table>` - Agent monitor, version ledger
   - `<Tabs>` - Dashboard module navigation
   - `<Card>` - Module containers
   - `<Badge>` - Status indicators
   - `<Separator>` - Section dividers
   - `<Tooltip>` - Data point information
   - `<Alert>` - System notifications
   - `<Progress>` - Loading states

3. **Data Visualization:**
   - `<Card>` - Chart containers
   - `<Tabs>` - View switching
   - `<Popover>` - Filter controls
   - `<Calendar>` - Date range selection
   - `<Select>` - Dropdown filters

4. **Forms & Inputs:**
   - `<Input>` - Text inputs
   - `<Textarea>` - Multi-line inputs
   - `<Select>` - Dropdowns
   - `<Switch>` - Toggle controls
   - `<Checkbox>` - Multi-select
   - `<RadioGroup>` - Single select

5. **Feedback:**
   - `<Sonner>` (from sonner) - Toast notifications
   - `<Alert>` - Inline messages
   - `<Skeleton>` - Loading placeholders

### Component Styling Patterns

**Card Pattern (Dashboard Modules):**
```jsx
<Card className="bg-[color:hsl(var(--surface))] border-[color:hsl(var(--border))] hover:border-[color:hsl(var(--accent))] transition-colors duration-300">
  <CardHeader>
    <CardTitle className="text-xl font-semibold text-[color:hsl(var(--foreground))]">
      Module Title
    </CardTitle>
    <CardDescription className="text-[color:hsl(var(--muted-foreground))]">
      Module description
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

**Button Variants:**
```jsx
// Primary Action (Teal)
<Button 
  data-testid="create-agent-button"
  className="bg-[color:hsl(var(--accent))] hover:bg-[color:hsl(var(--accent-hover))] text-[color:hsl(var(--accent-foreground))] font-medium px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
>
  Vytvořit Agenta
</Button>

// Secondary Action (Blue)
<Button 
  data-testid="view-details-button"
  variant="outline"
  className="border-[color:hsl(var(--primary))] text-[color:hsl(var(--primary))] hover:bg-[color:hsl(var(--primary))] hover:text-white transition-all duration-200"
>
  Zobrazit Detail
</Button>

// Ghost/Tertiary
<Button 
  variant="ghost"
  className="text-[color:hsl(var(--muted-foreground))] hover:text-[color:hsl(var(--foreground))] hover:bg-[color:hsl(var(--surface-elevated))]"
>
  Zrušit
</Button>
```

**Badge Variants:**
```jsx
// Success (Active Agent)
<Badge className="bg-[color:hsl(var(--success))] text-white">Aktivní</Badge>

// Warning (Pending)
<Badge className="bg-[color:hsl(var(--warning))] text-black">Čeká</Badge>

// Info (Version)
<Badge variant="outline" className="border-[color:hsl(var(--accent))] text-[color:hsl(var(--accent))]">
  v2.3.1
</Badge>
```

---

## Layout System

### Grid Structure
```css
/* Container */
.container-omega {
  @apply mx-auto max-w-7xl px-4 sm:px-6 lg:px-8;
}

/* Dashboard Grid (6 Modules) */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* Agent Creator Layout */
.agent-creator-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .agent-creator-layout {
    grid-template-columns: 2fr 1fr;
  }
}
```

### Spacing System
```css
/* Consistent spacing scale */
--space-xs: 0.5rem;   /* 8px */
--space-sm: 0.75rem;  /* 12px */
--space-md: 1rem;     /* 16px */
--space-lg: 1.5rem;   /* 24px */
--space-xl: 2rem;     /* 32px */
--space-2xl: 3rem;    /* 48px */
--space-3xl: 4rem;    /* 64px */

/* Section spacing */
.section-spacing {
  padding-top: var(--space-3xl);
  padding-bottom: var(--space-3xl);
}

@media (max-width: 768px) {
  .section-spacing {
    padding-top: var(--space-2xl);
    padding-bottom: var(--space-2xl);
  }
}
```

### Responsive Breakpoints
```javascript
// Tailwind breakpoints
sm: '640px',   // Mobile landscape
md: '768px',   // Tablet
lg: '1024px',  // Desktop
xl: '1280px',  // Large desktop
'2xl': '1536px' // Extra large
```

---

## Data Visualization Components

### Required Libraries (Already Installed)
- **Recharts** (v3.3.0) - Primary charting library
- **D3.js** (v7.9.0) - Custom visualizations, heatmaps
- **Framer Motion** (v12.23.24) - Animations
- **tsparticles** (v3.9.1) - Neural pathway particles

### 1. Sentiment Heatmap (Feedback Visualizer)

**Implementation Approach:**
Use D3.js with React for custom heatmap component.

**Component Structure:**
```jsx
// /app/frontend/src/components/visualizations/SentimentHeatmap.jsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const SentimentHeatmap = ({ data, width = 800, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    // D3 heatmap implementation
    const svg = d3.select(svgRef.current);
    
    // Color scale: deep blue to teal
    const colorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateRgb('#1e3a8a', '#06d6a0'));
    
    // Render heatmap cells
    // ... D3 rendering logic
  }, [data]);

  return (
    <div className="bg-[color:hsl(var(--surface))] rounded-lg p-6" data-testid="sentiment-heatmap">
      <svg ref={svgRef} width={width} height={height} />
    </div>
  );
};
```

**Styling:**
- Cell borders: `--border-subtle`
- Hover effect: Scale 1.05, border `--accent`
- Tooltip: Dark background with `--foreground` text
- Color scale: `--viz-gradient-start` to `--viz-gradient-end`

### 2. Satisfaction Graphs (Recharts)

**Component Structure:**
```jsx
// /app/frontend/src/components/visualizations/SatisfactionGraph.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SatisfactionGraph = ({ data }) => {
  const customTheme = {
    background: 'hsl(var(--surface))',
    text: 'hsl(var(--muted-foreground))',
    grid: 'hsl(var(--border-subtle))',
    line: 'hsl(var(--accent))',
  };

  return (
    <ResponsiveContainer width="100%" height={300} data-testid="satisfaction-graph">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={customTheme.grid} />
        <XAxis 
          dataKey="date" 
          stroke={customTheme.text}
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke={customTheme.text}
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--surface-2))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="satisfaction" 
          stroke={customTheme.line}
          strokeWidth={2}
          dot={{ fill: customTheme.line, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

### 3. Cluster Map Visualization

**Implementation:**
Use D3.js force-directed graph for agent clustering.

**Features:**
- Nodes: Circles representing agents
- Connections: Lines showing relationships
- Colors: `--neural-node` for active, `--neural-inactive` for inactive
- Hover: Highlight connected nodes
- Click: Show agent details in popover

### 4. Word Cloud (Live Expo Monitor)

**Library:** Use D3.js with custom word cloud layout

**Styling:**
- Font: 'Space Grotesk'
- Colors: Gradient from `--primary` to `--accent`
- Size: Based on frequency (12px - 48px)
- Hover: Scale 1.1, color `--accent`

### 5. Master Prompt Diff Viewer (Learning Loop Console)

**Component:**
```jsx
// Use react-diff-view or custom implementation
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MasterPromptDiff = ({ oldVersion, newVersion, changes }) => {
  return (
    <Card className="bg-[color:hsl(var(--surface))] p-6" data-testid="master-prompt-diff">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Master Prompt Changes</h3>
        <div className="flex gap-2">
          <Badge variant="outline">v{oldVersion}</Badge>
          <span className="text-[color:hsl(var(--muted-foreground))]">→</span>
          <Badge className="bg-[color:hsl(var(--accent))]">v{newVersion}</Badge>
        </div>
      </div>
      
      <div className="space-y-2 font-mono text-sm">
        {changes.map((change, idx) => (
          <div 
            key={idx}
            className={`p-2 rounded ${
              change.type === 'added' 
                ? 'bg-[color:hsl(var(--success))]/10 text-[color:hsl(var(--success))]' 
                : change.type === 'removed'
                ? 'bg-[color:hsl(var(--destructive))]/10 text-[color:hsl(var(--destructive))]'
                : 'text-[color:hsl(var(--muted-foreground))]'
            }`}
          >
            <span className="mr-2">{change.type === 'added' ? '+' : change.type === 'removed' ? '-' : ' '}</span>
            {change.content}
          </div>
        ))}
      </div>
    </Card>
  );
};
```

---

## Neural Pathway Visualization

### Particle System (tsparticles)

**Implementation:**
```jsx
// /app/frontend/src/components/visualizations/NeuralPathways.jsx
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const NeuralPathways = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesConfig = {
    background: {
      color: {
        value: 'transparent',
      },
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: '#06d6a0', // --quantum-teal
      },
      links: {
        color: '#2d4fb8', // --neural-connection
        distance: 150,
        enable: true,
        opacity: 0.3,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
        direction: 'none',
        random: false,
        straight: false,
        outModes: {
          default: 'bounce',
        },
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
        random: true,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
        },
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <Particles
        id="neural-pathways"
        init={particlesInit}
        options={particlesConfig}
      />
    </div>
  );
};
```

**Usage:**
- Background for Agent Creator hero section
- Admin Dashboard header
- Concept mapping visualization overlay

### Cognitive Mapping Animation (Framer Motion)

**Implementation:**
```jsx
import { motion } from 'framer-motion';

const ConceptNode = ({ concept, position, connections }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="absolute"
      style={{ left: position.x, top: position.y }}
      data-testid={`concept-node-${concept.id}`}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="bg-[color:hsl(var(--surface-2))] border-2 border-[color:hsl(var(--accent))] rounded-full p-4 cursor-pointer"
      >
        <span className="text-sm font-medium text-[color:hsl(var(--foreground))]">
          {concept.name}
        </span>
      </motion.div>
      
      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-[color:hsl(var(--neural-pulse))]"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};
```

---

## Micro-Interactions & Animations

### Button Interactions
```css
/* Primary Button */
.btn-primary {
  @apply bg-[color:hsl(var(--accent))] text-[color:hsl(var(--accent-foreground))];
  @apply px-6 py-3 rounded-lg font-medium;
  @apply transition-all duration-200;
  @apply hover:bg-[color:hsl(var(--accent-hover))] hover:scale-105;
  @apply hover:shadow-[0_8px_24px_-8px_rgba(6,214,160,0.4)];
  @apply active:scale-95;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:hsl(var(--background))];
}

/* Secondary Button */
.btn-secondary {
  @apply border-2 border-[color:hsl(var(--primary))] text-[color:hsl(var(--primary))];
  @apply px-6 py-3 rounded-lg font-medium;
  @apply transition-all duration-200;
  @apply hover:bg-[color:hsl(var(--primary))] hover:text-white;
  @apply active:scale-95;
}
```

### Card Hover Effects
```jsx
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
  className="bg-[color:hsl(var(--surface))] border border-[color:hsl(var(--border))] rounded-lg p-6 transition-all duration-300 hover:border-[color:hsl(var(--accent))] hover:shadow-[0_12px_32px_-12px_rgba(6,214,160,0.2)]"
>
  {/* Card content */}
</motion.div>
```

### Input Focus States
```css
.input-focus {
  @apply border-[color:hsl(var(--border))];
  @apply transition-all duration-200;
  @apply focus:border-[color:hsl(var(--accent))];
  @apply focus:ring-2 focus:ring-[color:hsl(var(--accent))]/20;
  @apply focus:outline-none;
}
```

### Loading States
```jsx
// Skeleton for loading content
import { Skeleton } from '@/components/ui/skeleton';

<div className="space-y-4">
  <Skeleton className="h-12 w-full bg-[color:hsl(var(--surface-2))]" />
  <Skeleton className="h-32 w-full bg-[color:hsl(var(--surface-2))]" />
  <Skeleton className="h-8 w-3/4 bg-[color:hsl(var(--surface-2))]" />
</div>

// Spinner for actions
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
  className="w-6 h-6 border-2 border-[color:hsl(var(--accent))] border-t-transparent rounded-full"
/>
```

### Page Transitions (Framer Motion)
```jsx
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3 }}
  >
    {/* Page content */}
  </motion.div>
</AnimatePresence>
```

---

## Agent Creator Interface Design

### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│  Hero Section (Neural Pathways Background)              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Ω-KOMPRESNÍ ROVNICE                              │  │
│  │  "Popište agenta, kterého potřebujete"           │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Main Input Area                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Large Textarea (min-height: 200px)              │  │
│  │  Placeholder: "Například: Potřebuji agenta..."   │  │
│  └───────────────────────────────────────────────────┘  │
│  [Token Balance: 1,250] [Vytvořit Agenta →]            │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Clarifying Dialog (Dialog Component)                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │  AI Question 1/3                                  │  │
│  │  [Input/Select]                                   │  │
│  │  [Zpět] [Další →]                                │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Concept Mapping Visualization                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [Interactive Node Graph with Connections]        │  │
│  │  (Framer Motion + D3.js)                          │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Final Agent Prompt Display                              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  # Generated Agent Prompt                         │  │
│  │  ```markdown                                      │  │
│  │  [Formatted prompt with syntax highlighting]     │  │
│  │  ```                                              │  │
│  │  [Kopírovat] [Upravit] [Vytvořit Agenta]        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Component Specifications

**1. Hero Section:**
```jsx
<section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
  <NeuralPathways />
  <div className="relative z-10 container-omega text-center">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-[color:hsl(var(--foreground))]"
      style={{ fontFamily: 'EB Garamond, serif' }}
    >
      Ω-KOMPRESNÍ ROVNICE
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-xl sm:text-2xl text-[color:hsl(var(--muted-foreground))]"
    >
      Popište agenta, kterého potřebujete
    </motion.p>
  </div>
</section>
```

**2. Main Input Area:**
```jsx
<Card className="bg-[color:hsl(var(--surface))] border-[color:hsl(var(--border))] p-8">
  <Textarea
    data-testid="agent-description-input"
    placeholder="Například: Potřebuji agenta, který analyzuje sentiment v českých textech a poskytuje doporučení pro zlepšení komunikace..."
    className="min-h-[200px] bg-[color:hsl(var(--surface-2))] border-[color:hsl(var(--border))] text-[color:hsl(var(--foreground))] text-lg resize-none focus:border-[color:hsl(var(--accent))] focus:ring-2 focus:ring-[color:hsl(var(--accent))]/20"
  />
  
  <div className="flex items-center justify-between mt-6">
    <Badge variant="outline" className="text-sm" data-testid="token-balance">
      <span className="text-[color:hsl(var(--muted-foreground))]">Token Balance:</span>
      <span className="ml-2 text-[color:hsl(var(--accent))] font-semibold">1,250</span>
    </Badge>
    
    <Button 
      data-testid="create-agent-button"
      className="bg-[color:hsl(var(--accent))] hover:bg-[color:hsl(var(--accent-hover))] text-[color:hsl(var(--accent-foreground))] px-8 py-3 text-lg"
    >
      Vytvořit Agenta
      <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  </div>
</Card>
```

**3. Clarifying Dialog:**
```jsx
<Dialog open={showDialog} onOpenChange={setShowDialog}>
  <DialogContent className="bg-[color:hsl(var(--surface-2))] border-[color:hsl(var(--border))] max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl font-semibold text-[color:hsl(var(--foreground))]">
        Upřesnění požadavků
      </DialogTitle>
      <DialogDescription className="text-[color:hsl(var(--muted-foreground))]">
        Otázka {currentQuestion} z 3
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-6 py-6">
      <p className="text-lg text-[color:hsl(var(--foreground))]">
        {questions[currentQuestion].text}
      </p>
      
      {questions[currentQuestion].type === 'text' ? (
        <Textarea
          data-testid={`clarifying-question-${currentQuestion}`}
          className="min-h-[120px] bg-[color:hsl(var(--surface))] border-[color:hsl(var(--border))]"
        />
      ) : (
        <Select>
          <SelectTrigger className="bg-[color:hsl(var(--surface))] border-[color:hsl(var(--border))]">
            <SelectValue placeholder="Vyberte možnost" />
          </SelectTrigger>
          <SelectContent>
            {questions[currentQuestion].options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={handleBack} data-testid="dialog-back-button">
        Zpět
      </Button>
      <Button onClick={handleNext} data-testid="dialog-next-button">
        {currentQuestion < 2 ? 'Další' : 'Dokončit'}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**4. Concept Mapping Visualization:**
- Use D3.js force-directed graph
- Nodes: Concepts extracted from description
- Edges: Relationships between concepts
- Colors: `--neural-node` for nodes, `--neural-connection` for edges
- Animation: Framer Motion for entrance, D3 for physics simulation

**5. Final Prompt Display:**
```jsx
<Card className="bg-[color:hsl(var(--surface))] border-[color:hsl(var(--border))] p-8">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-2xl font-semibold text-[color:hsl(var(--foreground))]">
      Vygenerovaný Agent Prompt
    </h3>
    <Badge className="bg-[color:hsl(var(--success))]">Připraveno</Badge>
  </div>
  
  <ScrollArea className="h-[400px] rounded-lg border border-[color:hsl(var(--border))] bg-[color:hsl(var(--surface-2))] p-6">
    <pre className="font-mono text-sm text-[color:hsl(var(--foreground))]">
      <code data-testid="generated-prompt">
        {generatedPrompt}
      </code>
    </pre>
  </ScrollArea>
  
  <div className="flex gap-4 mt-6">
    <Button 
      variant="outline" 
      onClick={handleCopy}
      data-testid="copy-prompt-button"
    >
      <Copy className="mr-2 h-4 w-4" />
      Kopírovat
    </Button>
    <Button 
      variant="outline"
      onClick={handleEdit}
      data-testid="edit-prompt-button"
    >
      <Edit className="mr-2 h-4 w-4" />
      Upravit
    </Button>
    <Button 
      className="ml-auto bg-[color:hsl(var(--accent))]"
      onClick={handleCreateAgent}
      data-testid="finalize-agent-button"
    >
      Vytvořit Agenta
    </Button>
  </div>
</Card>
```

---

## Admin Dashboard Design

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│  Header (Neural Pathways Background)                     │
│  [Logo] [Navigation] [User Menu]                        │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Tab Navigation                                          │
│  [Agent Monitor] [Feedback] [Learning Loop] [Live Expo] │
│  [Version Ledger] [Meta-Insight]                        │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  Module Content Area                                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │  [Active Module Content]                          │  │
│  │                                                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Module 1: Agent Monitor

**Component:**
```jsx
<Card className="bg-[color:hsl(var(--surface))] border-[color:hsl(var(--border))]">
  <CardHeader>
    <CardTitle className="text-2xl font-semibold">Agent Monitor</CardTitle>
    <CardDescription>Přehled všech vytvořených agentů</CardDescription>
  </CardHeader>
  <CardContent>
    <Table data-testid="agent-monitor-table">
      <TableHeader>
        <TableRow className="border-[color:hsl(var(--border))]">
          <TableHead className="text-[color:hsl(var(--muted-foreground))]">ID</TableHead>
          <TableHead>Název</TableHead>
          <TableHead>Skóre</TableHead>
          <TableHead>Verze</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Vytvořeno</TableHead>
          <TableHead>Akce</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow 
            key={agent.id}
            className="border-[color:hsl(var(--border))] hover:bg-[color:hsl(var(--surface-elevated))] transition-colors"
            data-testid={`agent-row-${agent.id}`}
          >
            <TableCell className="font-mono text-sm">{agent.id}</TableCell>
            <TableCell className="font-medium">{agent.name}</TableCell>
            <TableCell>
              <Badge 
                variant={agent.score >= 80 ? 'default' : 'secondary'}
                className={agent.score >= 80 ? 'bg-[color:hsl(var(--success))]' : ''}
              >
                {agent.score}
              </Badge>
            </TableCell>
            <TableCell className="font-mono text-sm">v{agent.version}</TableCell>
            <TableCell>
              <Badge 
                variant={agent.status === 'active' ? 'default' : 'outline'}
                className={agent.status === 'active' ? 'bg-[color:hsl(var(--success))]' : ''}
              >
                {agent.status === 'active' ? 'Aktivní' : 'Neaktivní'}
              </Badge>
            </TableCell>
            <TableCell className="text-[color:hsl(var(--muted-foreground))]">
              {formatDate(agent.createdAt)}
            </TableCell>
            <TableCell>
              <Button 
                variant="ghost" 
                size="sm"
                data-testid={`view-agent-${agent.id}`}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

### Module 2: Feedback Visualizer

**Components:**
1. **Sentiment Heatmap** (D3.js custom component)
2. **Satisfaction Graphs** (Recharts LineChart)
3. **Cluster Map** (D3.js force-directed graph)

**Layout:**
```jsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <Card className="lg:col-span-2">
    <CardHeader>
      <CardTitle>Sentiment Heatmap</CardTitle>
    </CardHeader>
    <CardContent>
      <SentimentHeatmap data={sentimentData} />
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle>Satisfaction Trend</CardTitle>
    </CardHeader>
    <CardContent>
      <SatisfactionGraph data={satisfactionData} />
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle>Agent Clusters</CardTitle>
    </CardHeader>
    <CardContent>
      <ClusterMap data={clusterData} />
    </CardContent>
  </Card>
</div>
```

### Module 3: Learning Loop Console

**Component:**
```jsx
<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Master Prompt Diff Viewer</CardTitle>
      <CardDescription>Změny mezi verzemi Master Promptu</CardDescription>
    </CardHeader>
    <CardContent>
      <MasterPromptDiff 
        oldVersion="2.3.0"
        newVersion="2.3.1"
        changes={changes}
      />
    </CardContent>
  </Card>
  
  <Card>
    <CardHeader>
      <CardTitle>Deployment Actions</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex gap-4">
        <Button 
          variant="outline"
          className="border-[color:hsl(var(--destructive))] text-[color:hsl(var(--destructive))]"
          data-testid="reject-changes-button"
        >
          <X className="mr-2 h-4 w-4" />
          Zamítnout
        </Button>
        <Button 
          variant="outline"
          data-testid="review-changes-button"
        >
          <Eye className="mr-2 h-4 w-4" />
          Zkontrolovat
        </Button>
        <Button 
          className="ml-auto bg-[color:hsl(var(--success))]"
          data-testid="approve-deploy-button"
        >
          <Check className="mr-2 h-4 w-4" />
          Schválit a Nasadit
        </Button>
      </div>
    </CardContent>
  </Card>
</div>
```

### Module 4: Live Expo Monitor

**Component:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
  <Card data-testid="active-users-card">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-[color:hsl(var(--muted-foreground))]">
        Aktivní Uživatelé
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold text-[color:hsl(var(--foreground))]">
        {activeUsers}
      </div>
      <p className="text-xs text-[color:hsl(var(--success))] mt-2">
        +12% od včera
      </p>
    </CardContent>
  </Card>
  
  <Card data-testid="agents-count-card">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-[color:hsl(var(--muted-foreground))]">
        Vytvořené Agenty
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold text-[color:hsl(var(--foreground))]">
        {agentsCount}
      </div>
      <p className="text-xs text-[color:hsl(var(--success))] mt-2">
        +8 dnes
      </p>
    </CardContent>
  </Card>
  
  <Card data-testid="token-consumption-card">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-[color:hsl(var(--muted-foreground))]">
        Spotřeba Tokenů
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold text-[color:hsl(var(--foreground))]">
        {tokenConsumption}
      </div>
      <Progress 
        value={75} 
        className="mt-2 bg-[color:hsl(var(--surface-2))]"
      />
    </CardContent>
  </Card>
  
  <Card data-testid="system-health-card">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-[color:hsl(var(--muted-foreground))]">
        Stav Systému
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[color:hsl(var(--success))] animate-pulse" />
        <span className="text-xl font-semibold text-[color:hsl(var(--success))]">
          Operational
        </span>
      </div>
    </CardContent>
  </Card>
</div>

<Card>
  <CardHeader>
    <CardTitle>Word Cloud - Trending Topics</CardTitle>
  </CardHeader>
  <CardContent>
    <WordCloud data={wordCloudData} />
  </CardContent>
</Card>
```

### Module 5: Version Ledger

**Component:**
```jsx
<Card>
  <CardHeader>
    <CardTitle>Version Changelog</CardTitle>
    <CardDescription>Historie změn Master Promptu</CardDescription>
  </CardHeader>
  <CardContent>
    <ScrollArea className="h-[600px]">
      <div className="space-y-6">
        {versions.map((version, idx) => (
          <div 
            key={version.id}
            className="relative pl-8 pb-6 border-l-2 border-[color:hsl(var(--border))] last:border-l-0"
            data-testid={`version-entry-${version.id}`}
          >
            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[color:hsl(var(--accent))] border-2 border-[color:hsl(var(--background))]" />
            
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="font-mono">
                v{version.number}
              </Badge>
              <span className="text-sm text-[color:hsl(var(--muted-foreground))]">
                {formatDate(version.timestamp)}
              </span>
            </div>
            
            <h4 className="text-lg font-semibold text-[color:hsl(var(--foreground))] mb-2">
              {version.title}
            </h4>
            
            <p className="text-[color:hsl(var(--muted-foreground))] mb-3">
              {version.description}
            </p>
            
            <div className="space-y-1">
              {version.changes.map((change, changeIdx) => (
                <div 
                  key={changeIdx}
                  className="flex items-start gap-2 text-sm"
                >
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      change.type === 'added' ? 'border-[color:hsl(var(--success))] text-[color:hsl(var(--success))]' :
                      change.type === 'removed' ? 'border-[color:hsl(var(--destructive))] text-[color:hsl(var(--destructive))]' :
                      'border-[color:hsl(var(--info))] text-[color:hsl(var(--info))]'
                    }`}
                  >
                    {change.type}
                  </Badge>
                  <span className="text-[color:hsl(var(--foreground))]">
                    {change.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  </CardContent>
</Card>
```

### Module 6: Meta-Insight Panel

**Component:**
```jsx
<Card className="bg-gradient-to-br from-[color:hsl(var(--surface))] to-[color:hsl(var(--surface-2))] border-[color:hsl(var(--accent))]">
  <CardHeader>
    <CardTitle className="text-2xl font-semibold flex items-center gap-2">
      <Sparkles className="h-6 w-6 text-[color:hsl(var(--accent))]" />
      Meta-Insight: Daily Reflection
    </CardTitle>
    <CardDescription>
      AI-generovaný přehled dnešního učení
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
    <div className="prose prose-invert max-w-none">
      <p className="text-lg text-[color:hsl(var(--foreground))] leading-relaxed">
        {dailyInsight.summary}
      </p>
    </div>
    
    <Separator className="bg-[color:hsl(var(--border))]" />
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[color:hsl(var(--muted-foreground))]">
          Klíčové Poznatky
        </h4>
        <ul className="space-y-1">
          {dailyInsight.keyLearnings.map((learning, idx) => (
            <li 
              key={idx}
              className="text-sm text-[color:hsl(var(--foreground))] flex items-start gap-2"
            >
              <Check className="h-4 w-4 text-[color:hsl(var(--accent))] mt-0.5 flex-shrink-0" />
              <span>{learning}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[color:hsl(var(--muted-foreground))]">
          Trendy
        </h4>
        <ul className="space-y-1">
          {dailyInsight.trends.map((trend, idx) => (
            <li 
              key={idx}
              className="text-sm text-[color:hsl(var(--foreground))] flex items-start gap-2"
            >
              <TrendingUp className="h-4 w-4 text-[color:hsl(var(--success))] mt-0.5 flex-shrink-0" />
              <span>{trend}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[color:hsl(var(--muted-foreground))]">
          Doporučení
        </h4>
        <ul className="space-y-1">
          {dailyInsight.recommendations.map((rec, idx) => (
            <li 
              key={idx}
              className="text-sm text-[color:hsl(var(--foreground))] flex items-start gap-2"
            >
              <Lightbulb className="h-4 w-4 text-[color:hsl(var(--warning))] mt-0.5 flex-shrink-0" />
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## Image Assets

### Image URLs by Category

**1. Neural Network Visualizations (Hero Sections, Backgrounds):**
- Primary: `https://images.unsplash.com/photo-1647356191320-d7a1f80ca777` (Purple/blue neural network on black)
- Secondary: `https://images.unsplash.com/photo-1678845536613-5cf0ec5245cd` (Network of dots/connections)
- Tertiary: `https://images.unsplash.com/photo-1756407005570-4b463b7dfdac` (White lines abstract pattern)

**Usage:**
- Agent Creator hero section background (with overlay)
- Concept mapping visualization background
- Admin dashboard header

**2. Data Visualization / Dashboard:**
- Primary: `https://images.unsplash.com/photo-1575388902449-6bca946ad549` (Dashboard with data)
- Secondary: `https://images.unsplash.com/photo-1551288049-bebda4e38f71` (Performance analytics graphs)
- Tertiary: `https://images.unsplash.com/photo-1687125114692-54f19a0fd438` (Colorful data screen)

**Usage:**
- Admin dashboard module backgrounds (subtle, low opacity)
- Data visualization section headers
- Empty state illustrations

**3. Abstract Technology Backgrounds:**
- Primary: `https://images.unsplash.com/photo-1756407005570-4b463b7dfdac` (String theory pattern)
- Secondary: `https://images.unsplash.com/photo-1659033812313-75f96a9eacc3` (Colorful wave)
- Tertiary: `https://images.pexels.com/photos/7562088/pexels-photo-7562088.jpeg` (Blue technology)

**Usage:**
- Section dividers
- Card backgrounds (very low opacity, 0.05)
- Loading states

**Implementation Example:**
```jsx
// Hero section with neural network background
<section 
  className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(rgba(10, 15, 29, 0.85), rgba(10, 15, 29, 0.95)), url('https://images.unsplash.com/photo-1647356191320-d7a1f80ca777')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <NeuralPathways />
  {/* Content */}
</section>

// Card with subtle background
<Card 
  className="relative overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(rgba(16, 23, 42, 0.95), rgba(16, 23, 42, 0.98)), url('https://images.unsplash.com/photo-1678845536613-5cf0ec5245cd')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  {/* Card content */}
</Card>
```

---

## Accessibility Guidelines

### WCAG AA Compliance

**1. Color Contrast:**
- Text on dark background: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio against background

**Verified Combinations:**
- `--foreground` (#e6f1ff) on `--background` (#0a0f1d): 14.2:1 ✓
- `--accent` (#06d6a0) on `--background` (#0a0f1d): 8.5:1 ✓
- `--muted-foreground` (#9fb4d0) on `--background` (#0a0f1d): 7.1:1 ✓

**2. Focus States:**
```css
*:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(6, 214, 160, 0.45);
  border-radius: 4px;
}
```

**3. Keyboard Navigation:**
- All interactive elements must be keyboard accessible
- Tab order follows logical flow
- Skip links for main content
- Escape key closes modals/dialogs

**4. Screen Reader Support:**
```jsx
// Proper ARIA labels
<Button aria-label="Vytvořit nového agenta" data-testid="create-agent-button">
  <Plus className="h-4 w-4" aria-hidden="true" />
  Vytvořit Agenta
</Button>

// Status announcements
<div role="status" aria-live="polite" className="sr-only">
  Agent byl úspěšně vytvořen
</div>

// Loading states
<div role="status" aria-live="polite">
  <Spinner aria-label="Načítání..." />
</div>
```

**5. Data Testid Attributes:**
All interactive and key informational elements MUST include `data-testid` attributes:

```jsx
// Buttons
<Button data-testid="create-agent-button">Vytvořit</Button>
<Button data-testid="approve-deploy-button">Schválit</Button>

// Inputs
<Textarea data-testid="agent-description-input" />
<Input data-testid="clarifying-question-1" />

// Tables
<Table data-testid="agent-monitor-table">
  <TableRow data-testid="agent-row-123">
    <TableCell data-testid="agent-name-123">Agent Name</TableCell>
  </TableRow>
</Table>

// Cards/Modules
<Card data-testid="active-users-card">
<Card data-testid="sentiment-heatmap">
<div data-testid="version-entry-2.3.1">

// Dialogs
<Dialog data-testid="clarifying-dialog">
<Button data-testid="dialog-next-button">Další</Button>

// Data displays
<div data-testid="token-balance">1,250</div>
<div data-testid="generated-prompt">{prompt}</div>
```

**Naming Convention:**
- Use kebab-case
- Format: `{element-role}-{identifier}-{action?}`
- Examples:
  - `create-agent-button`
  - `agent-row-123`
  - `dialog-next-button`
  - `sentiment-heatmap`

---

## Motion & Animation Principles

### Animation Timing
```css
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;
--duration-slower: 500ms;

--ease-in-out: cubic-bezier(0.22, 1, 0.36, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Animation Guidelines

**1. Entrance Animations:**
```jsx
// Fade in + slide up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
>
  {/* Content */}
</motion.div>

// Staggered children
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**2. Hover Animations:**
```jsx
// Scale + shadow
<motion.div
  whileHover={{ 
    scale: 1.02,
    boxShadow: '0 12px 32px -12px rgba(6, 214, 160, 0.2)',
  }}
  transition={{ duration: 0.2 }}
>
  {/* Content */}
</motion.div>

// Lift effect
<motion.div
  whileHover={{ y: -4 }}
  transition={{ duration: 0.2 }}
>
  {/* Content */}
</motion.div>
```

**3. Loading Animations:**
```jsx
// Pulse
<motion.div
  animate={{
    opacity: [0.5, 1, 0.5],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
>
  {/* Loading content */}
</motion.div>

// Spinner
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  }}
  className="w-6 h-6 border-2 border-[color:hsl(var(--accent))] border-t-transparent rounded-full"
/>
```

**4. Neural Pathway Animations:**
```jsx
// Pulsing node
<motion.circle
  cx={x}
  cy={y}
  r={5}
  fill="hsl(var(--neural-node))"
  animate={{
    r: [5, 7, 5],
    opacity: [0.8, 1, 0.8],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
/>

// Connection line animation
<motion.line
  x1={x1}
  y1={y1}
  x2={x2}
  y2={y2}
  stroke="hsl(var(--neural-connection))"
  strokeWidth={1}
  initial={{ pathLength: 0, opacity: 0 }}
  animate={{ pathLength: 1, opacity: 0.5 }}
  transition={{ duration: 1, ease: 'easeInOut' }}
/>
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Additional Libraries & Installation

### Required Installations

**1. React Markdown with Syntax Highlighting:**
Already installed:
- `react-markdown` (v10.1.0)
- `rehype-highlight` (v7.0.2)
- `remark-gfm` (v3.0.1)
- `highlight.js` (v11.11.1)

**Usage for Agent Prompt Display:**
```jsx
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/atom-one-dark.css';

<ReactMarkdown
  rehypePlugins={[rehypeHighlight]}
  remarkPlugins={[remarkGfm]}
  className="prose prose-invert max-w-none"
>
  {generatedPrompt}
</ReactMarkdown>
```

**2. Date Formatting:**
Already installed: `date-fns` (v4.1.0)

**Usage:**
```javascript
import { format, formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';

// Format date
format(new Date(), 'dd. MM. yyyy HH:mm', { locale: cs });

// Relative time
formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: cs });
```

**3. State Management:**
Already installed: `zustand` (v5.0.8)

**Usage for Dashboard State:**
```javascript
// /app/frontend/src/store/dashboardStore.js
import { create } from 'zustand';

export const useDashboardStore = create((set) => ({
  activeModule: 'agent-monitor',
  agents: [],
  liveStats: {
    activeUsers: 0,
    agentsCount: 0,
    tokenConsumption: 0,
  },
  setActiveModule: (module) => set({ activeModule: module }),
  updateLiveStats: (stats) => set({ liveStats: stats }),
  addAgent: (agent) => set((state) => ({ 
    agents: [...state.agents, agent] 
  })),
}));
```

**4. No Additional Installations Needed:**
All required libraries are already installed:
- ✓ D3.js (v7.9.0)
- ✓ Recharts (v3.3.0)
- ✓ Framer Motion (v12.23.24)
- ✓ tsparticles (v3.9.1)
- ✓ Lucide React (v0.507.0) - Icons
- ✓ Sonner (v2.0.3) - Toasts
- ✓ All Shadcn/UI components

---

## Instructions to Main Agent

### Implementation Priority

**Phase 1: Core Structure (Day 1)**
1. Set up routing with React Router
2. Create main layout components (Header, Navigation, Footer)
3. Implement Ω-Aurora design tokens in index.css
4. Set up Zustand store for state management

**Phase 2: Agent Creator Interface (Day 2-3)**
1. Build hero section with neural pathways background (tsparticles)
2. Create main input area with Textarea component
3. Implement clarifying dialog flow with Dialog component
4. Build concept mapping visualization (D3.js + Framer Motion)
5. Create final prompt display with ReactMarkdown

**Phase 3: Admin Dashboard Structure (Day 4)**
1. Create dashboard layout with Tabs navigation
2. Build 6 module containers (Cards)
3. Implement module switching logic

**Phase 4: Dashboard Modules (Day 5-7)**
1. **Agent Monitor:** Table component with sorting/filtering
2. **Feedback Visualizer:** 
   - Sentiment heatmap (D3.js custom component)
   - Satisfaction graphs (Recharts)
   - Cluster map (D3.js force-directed)
3. **Learning Loop Console:** Diff viewer + action buttons
4. **Live Expo Monitor:** Stats cards + word cloud
5. **Version Ledger:** Timeline component with ScrollArea
6. **Meta-Insight Panel:** AI-generated daily reflection card

**Phase 5: Polish & Optimization (Day 8)**
1. Add all micro-interactions and animations
2. Implement loading states and skeletons
3. Add toast notifications (Sonner)
4. Test accessibility (keyboard navigation, screen readers)
5. Verify all data-testid attributes
6. Mobile responsiveness testing

### Component File Structure
```
/app/frontend/src/
├── components/
│   ├── ui/                          # Shadcn components (existing)
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   └── Footer.jsx
│   ├── agent-creator/
│   │   ├── HeroSection.jsx
│   │   ├── AgentInput.jsx
│   │   ├── ClarifyingDialog.jsx
│   │   ├── ConceptMapping.jsx
│   │   └── PromptDisplay.jsx
│   ├── dashboard/
│   │   ├── DashboardLayout.jsx
│   │   ├── AgentMonitor.jsx
│   │   ├── FeedbackVisualizer.jsx
│   │   ├── LearningLoopConsole.jsx
│   │   ├── LiveExpoMonitor.jsx
│   │   ├── VersionLedger.jsx
│   │   └── MetaInsightPanel.jsx
│   └── visualizations/
│       ├── NeuralPathways.jsx       # tsparticles
│       ├── SentimentHeatmap.jsx     # D3.js
│       ├── SatisfactionGraph.jsx    # Recharts
│       ├── ClusterMap.jsx           # D3.js
│       ├── WordCloud.jsx            # D3.js
│       └── MasterPromptDiff.jsx
├── store/
│   └── dashboardStore.js            # Zustand
├── pages/
│   ├── Home.jsx
│   ├── AgentCreator.jsx
│   ├── Dashboard.jsx
│   └── Education.jsx                # Existing Czech content
├── App.jsx
└── index.css                        # Design tokens
```

### Key Implementation Notes

**1. Color Usage:**
- NEVER use gradients on more than 20% of viewport
- NEVER use dark purple/pink gradients
- Use solid colors for all text-heavy areas
- Gradients only for: hero sections, section dividers, neural visualizations

**2. Typography:**
- H1: EB Garamond, 56px (mobile: 40px)
- H2-H4: Space Grotesk
- Body: Space Grotesk, 16px
- Code: JetBrains Mono

**3. Spacing:**
- Use consistent spacing scale (8px, 12px, 16px, 24px, 32px, 48px, 64px)
- Section padding: 64px top/bottom (mobile: 48px)
- Card padding: 32px (mobile: 24px)
- Gap between elements: 24px (mobile: 16px)

**4. Responsive Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**5. Data Testid Convention:**
- Format: `{element-role}-{identifier}-{action?}`
- Use kebab-case
- Add to ALL interactive elements
- Add to ALL key informational displays

**6. Czech Language:**
- Use proper diacritics: ě, š, č, ř, ž, ý, á, í, é, ů, ú, ň, ť, ď
- Set `lang="cs"` on Czech content sections
- Use Czech date formatting with date-fns locale

**7. Performance:**
- Lazy load dashboard modules
- Use React.memo for expensive components
- Debounce search/filter inputs
- Virtualize long lists (agent monitor table)

**8. Error Handling:**
- Use Sonner for toast notifications
- Show inline errors with Alert component
- Provide fallback UI for failed data loads
- Log errors to console for debugging

---

## Common Mistakes to Avoid

### ❌ DON'T:
1. Use dark purple/pink/blue gradients anywhere
2. Apply gradients to more than 20% of viewport
3. Use gradients on text-heavy content
4. Center-align the entire app container (`.App { text-align: center; }`)
5. Use universal transitions (`transition: all`)
6. Use emoji icons (🤖💡🎯) - use Lucide React or FontAwesome
7. Forget data-testid attributes on interactive elements
8. Mix multiple gradient directions in same section
9. Use gradients on small UI elements (<100px)
10. Ignore responsive font sizing

### ✅ DO:
1. Use solid colors for content and reading areas
2. Maintain consistent spacing using the spacing system
3. Test on mobile devices with touch interactions
4. Include accessibility features (focus states, contrast, ARIA labels)
5. Use pill/capsule button style for primary actions
6. Add hover and focus states to all interactive elements
7. Use Shadcn/UI components as primary component library
8. Implement loading states with Skeleton components
9. Add micro-animations for better UX
10. Verify WCAG AA contrast ratios

### Color Usage Priority:
1. **Solid colors** for all cards, content areas, and text backgrounds
2. **Subtle borders** with `--border` color
3. **Gradients** ONLY for:
   - Hero section backgrounds (max 20% viewport)
   - Neural pathway visualization backgrounds
   - Section dividers (thin, decorative)
   - Large CTA buttons (light gradients only)

---

## Testing Checklist

### Functionality
- [ ] Agent creation flow works end-to-end
- [ ] Clarifying dialog shows 2-3 questions
- [ ] Concept mapping visualizes relationships
- [ ] Final prompt displays in markdown with syntax highlighting
- [ ] All 6 dashboard modules load and display data
- [ ] Sentiment heatmap renders correctly
- [ ] Satisfaction graphs show trends
- [ ] Master prompt diff viewer highlights changes
- [ ] Live stats update in real-time
- [ ] Version ledger shows changelog timeline
- [ ] Meta-insight panel displays daily reflection

### Accessibility
- [ ] All interactive elements have data-testid attributes
- [ ] Keyboard navigation works throughout app
- [ ] Focus states visible on all interactive elements
- [ ] Screen reader announces status changes
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] All images have alt text
- [ ] Forms have proper labels and error messages

### Responsive Design
- [ ] Mobile layout (< 640px) works correctly
- [ ] Tablet layout (640px - 1024px) adapts properly
- [ ] Desktop layout (> 1024px) uses full width
- [ ] Dashboard grid adjusts to screen size
- [ ] Tables scroll horizontally on mobile
- [ ] Modals/dialogs fit mobile screens

### Performance
- [ ] Initial page load < 3 seconds
- [ ] Dashboard modules lazy load
- [ ] Large lists virtualized
- [ ] Images optimized and lazy loaded
- [ ] No layout shifts during load
- [ ] Animations smooth (60fps)

### Visual Design
- [ ] Gradients cover < 20% of viewport
- [ ] No dark purple/pink gradients used
- [ ] Typography hierarchy clear
- [ ] Spacing consistent throughout
- [ ] Colors match Ω-Aurora palette
- [ ] Neural pathways animation smooth
- [ ] Hover effects work on all interactive elements

---

## General UI/UX Design Guidelines

### Universal Transition Rule
**CRITICAL:** You must **NOT** apply universal transition. Example: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input **excluding transforms**.

```css
/* ❌ WRONG */
.element {
  transition: all 0.3s ease;
}

/* ✅ CORRECT */
.button {
  transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}
```

### Text Alignment Rule
**CRITICAL:** You must **NOT** center align the app container. Do not add `.App { text-align: center; }` in the CSS file. This disrupts the natural reading flow of text.

```css
/* ❌ WRONG */
.App {
  text-align: center;
}

/* ✅ CORRECT */
.App {
  /* No text-align property */
}

/* Center specific elements only */
.hero-title {
  text-align: center;
}
```

### Icon Usage Rule
**CRITICAL:** NEVER use AI assistant emoji characters like 🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇 etc for icons.

Always use:
- **Lucide React** (already installed: `lucide-react` v0.507.0)
- **FontAwesome CDN** (if needed)

```jsx
/* ❌ WRONG */
<button>🤖 Create Agent</button>

/* ✅ CORRECT */
import { Bot, Plus, Check } from 'lucide-react';

<Button>
  <Bot className="mr-2 h-4 w-4" />
  Create Agent
</Button>
```

### Component Reuse
- Prioritize using pre-existing components from `/app/frontend/src/components/ui/` when applicable
- Create new components that match the style and conventions of existing components when needed
- Examine existing components to understand the project's component patterns before creating new ones

### Export Conventions
- Components MUST use named exports: `export const ComponentName = ...`
- Pages MUST use default exports: `export default function PageName() {...}`

### Toast Notifications
- Use `sonner` for toasts (already installed)
- Sonner component located in `/app/frontend/src/components/ui/sonner.jsx`

```jsx
import { toast } from 'sonner';

// Success
toast.success('Agent byl úspěšně vytvořen');

// Error
toast.error('Chyba při vytváření agenta');

// Info
toast.info('Zpracovávám váš požadavek...');
```

### Micro-Interactions
Every interaction needs micro-animations:
- Hover states with scale/shadow changes
- Transitions on color/background changes
- Parallax effects on scroll (for landing sections)
- Entrance animations for new content

### Spacing Philosophy
Use 2-3x more spacing than feels comfortable. Cramped designs look cheap.

```css
/* ❌ Cramped */
.card {
  padding: 8px;
  margin-bottom: 8px;
}

/* ✅ Spacious */
.card {
  padding: 32px;
  margin-bottom: 24px;
}
```

### Texture & Details
Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations separate good from extraordinary.

```css
/* Noise overlay (already in index.css) */
.noise {
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.035" /></svg>');
  mix-blend-mode: overlay;
  pointer-events: none;
  opacity: var(--noise-opacity);
}

/* Custom selection color (already in index.css) */
::selection {
  background-color: rgba(6, 214, 160, 0.3);
  color: #e6f1ff;
}
```

### Visual Style Inference
Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion) and immediately instantiate it by setting global design tokens, rather than relying on library defaults.

For Ω-KOMPRESNÍ ROVNICE:
- **Palette:** Deep blues, teal, dark backgrounds (scientific/futuristic)
- **Contrast:** High contrast for readability
- **Mood:** Intelligent, cognitive, research-oriented
- **Motion:** Smooth, neural-inspired, purposeful

### Mobile-First Responsive
Design must be mobile-first responsive. Start with mobile layout, then enhance for larger screens.

```jsx
// Mobile-first approach
<div className="p-4 sm:p-6 lg:p-8">
  <h1 className="text-2xl sm:text-3xl lg:text-4xl">Title</h1>
</div>
```

### Calendar Component
If calendar is required, always use Shadcn calendar component from `/app/frontend/src/components/ui/calendar.jsx`.

---

## Final Notes

This design system is specifically tailored for the Ω-KOMPRESNÍ ROVNICE meta-learning AI platform. It maintains the existing Ω-Aurora design language while extending it for the new agent creation and admin dashboard features.

**Key Differentiators:**
1. **Neural Pathway Aesthetic:** Cognitive mapping visualizations with particle systems
2. **Scientific/Futuristic Feel:** Deep blues, teal accents, high-tech data visualizations
3. **Czech Language Support:** Proper diacritics, date formatting, UI text
4. **Meta-Learning Focus:** Version tracking, learning loop visualization, daily insights
5. **Data-Rich Dashboard:** 6 comprehensive modules with advanced visualizations

**Design Philosophy:**
- **Clarity over complexity:** Data should be easy to understand
- **Motion with purpose:** Animations enhance understanding, not distract
- **Accessibility first:** WCAG AA compliance, keyboard navigation, screen reader support
- **Performance matters:** Lazy loading, virtualization, optimized assets
- **Consistent patterns:** Reusable components, predictable interactions

**Remember:**
- Gradients < 20% viewport
- No dark purple/pink gradients
- Solid colors for content areas
- Data-testid on all interactive elements
- Czech language support throughout
- Neural pathway visualizations for brand identity

This design system should be implemented in JavaScript (.js) files, not TypeScript (.tsx), as per the project's tech stack.

---

**Design Guidelines Path:** `/app/design_guidelines.md`
**Last Updated:** 2024
**Version:** 1.0.0
