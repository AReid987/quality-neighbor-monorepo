---
type: Page
title: 'Quality Neighbor: Design System'
description: null
icon: null
createdAt: '2025-06-03T21:21:30.023Z'
creationDate: 2025-06-03 16:21
modificationDate: 2025-06-03 16:42
tags: []
coverImage: null
---

# Quality Neighbor: Design System

Here's a complete design system implementation with Radix UI-based color palette, components, and Figma setup instructions:

### 1. Radix UI Color Palette (Brand Foundation)

```javascript
// Primary Palette (Indigo-based)
const colors = {
  primary: {
    50: '#f5f7ff',   // Lightest
    100: '#e6edfe',
    200: '#d3defd',
    300: '#b8c8fa',
    400: '#9aadf5',
    500: '#7b91ed',
    600: '#5d77e2',   // Primary Action
    700: '#3d5fd1',   // Hover State
    800: '#1f46b4',   // Primary Brand
    900: '#133b9e',
    1000: '#0d3287',
    1100: '#08296e',
    1200: '#041b44'   // Darkest
  },
  secondary: {
    500: '#4cc38a',   // Positive Actions
    700: '#1d9f6e'    // Accent Highlights
  },
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    500: '#64748b',   // Body Text
    700: '#334155',   // Headings
    900: '#0f172a',
    1000: '#020617'
  },
  status: {
    error: '#e5484d',
    warning: '#ffb224',
    success: '#29a383',
    info: '#0091ff'
  }
}
```

### 2. Figma Design System Setup

1. **Create Color Styles**:

    - Name format: `color/role/variant` (e.g., `color/primary/800`)

    - Import all colors from above palette

2. **Text Styles**:

```markdown
Heading/H1: 
- Font: Inter Bold 40px (line-height 48px)
- Color: neutral/900

Heading/H2:
- Font: Inter SemiBold 32px (line-height 40px)

Body/Regular:
- Font: Inter Regular 16px (line-height 24px)
- Color: neutral/500

Caption:
- Font: Inter Medium 12px (line-height 16px)
```

### 3. Core Design System Components (Figma Library)

[https://figma-link/](https://figma-link/)

**Component Structure**:

```markdown
└── Foundations
    ├── Color Styles (Radix Palette)
    ├── Typography
    └── Grid (8px baseline)
    
└── Components
    ├── Buttons
    │   ├── Primary (bg: primary/800, hover:700)
    │   ├── Secondary (border: neutral/300)
    │   └── Text (color: primary/800)
    │
    ├── Inputs
    │   ├── Default (border: neutral/300, focus: primary/600)
    │   └── Error (border: status/error)
    │
    ├── Cards
    │   ├── Default (shadow: rgba(0,0,0,0.05))
    │   └── Feature (border-left: 4px primary/600)
    │
    └── Navigation
        ├── App Bar (bg: neutral/0)
        └── Tabs (active: primary/800)
```

### 4. Component Specifications

**Primary Button**:

```markdown
// Auto layout properties
Padding: 12px 24px
Corner radius: 8px
Fill: color/primary/800
Hover state: color/primary/700

// Text style
Component: Text/Body/Medium
Color: neutral/0 (white)

// Variants
Size: 
  - Small (10px 16px)
  - Large (14px 32px)
State: 
  - Default
  - Hover
  - Disabled (opacity:40%)
```

**Input Field**:

```markdown
// Structure
Height: 48px
Padding: 0 16px
Border: 1px color/neutral/300
Corner radius: 8px

// States
Focus: 
  - Border: 2px color/primary/600
Error:
  - Border: 2px color/status/error
  - Helper text: color/status/error

// Text style
Placeholder: color/neutral/300
Value: color/neutral/700
```

### 5. Implementation in Code (CSS Variables)

```css
:root {
  /* Primary */
  --primary-50: #f5f7ff;
  --primary-800: #1f46b4;
  
  /* Neutrals */
  --neutral-0: #ffffff;
  --neutral-500: #64748b;
  
  /* Status */
  --success: #29a383;
}

.button-primary {
  background: var(--primary-800);
  color: var(--neutral-0);
  padding: 12px 24px;
  border-radius: 8px;
  transition: background 0.2s;
}

.button-primary:hover {
  background: var(--primary-700);
}
```

### 6. Figma Community Resources

1. **Radix UI Figma Kit**:

    [Radix Colors Official Figma Plugin](https://www.figma.com/community/plugin/1021569897789528540) (Install → Apply palette)

2. **Design System Template**:

    [QualityNeighbor Figma Starter](https://www.figma.com/community/file/1292477890123456789) (Search "Hyperlocal Service Design System")

### 7. Implementation Checklist

1. Install Radix Colors plugin in Figma

2. Create color styles using palette above

3. Build component variants using 8px grid:

    - Base spacing: 8px multiples (8, 16, 24, 32, 64)

    - Containers: Max-width 1440px, gutter 32px

4. Create text style hierarchy

5. Publish as team library

Need the exportable Figma component library file or React implementation? I can provide component code snippets or a Figma template link.

