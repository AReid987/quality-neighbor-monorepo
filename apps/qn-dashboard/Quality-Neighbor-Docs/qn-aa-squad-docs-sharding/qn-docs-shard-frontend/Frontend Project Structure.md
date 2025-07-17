---
type: Page
title: Frontend Project Structure
description: null
icon: null
createdAt: '2025-07-17T06:46:50.291Z'
creationDate: 2025-07-17 01:46
modificationDate: 2025-07-17 01:47
tags: []
coverImage: null
---

### Sharding Front-End Specific Documentation: Frontend Project Structure

**2.** `docs/front-end-project-structure.md`

# Frontend Project Structure

This document details the specific folder structure and organization for the Quality Neighbor frontend application. It elaborates on the `src/frontend/` portion mentioned in the main Project Structure, adhering to a React/Next.js framework's conventions for modularity, maintainability, and scalability.

## Overall Frontend Philosophy & Patterns

The frontend will be built using **React with Next.js**, leveraging its App Router for structured routing and server-side rendering/static site generation capabilities. The architecture will favor **Atomic Design principles** and a clear separation of concerns, ensuring components are reusable and logic is testable. **State management** will follow the approach defined in the main Architecture Document (e.g., Redux Toolkit), with specific implementation details covered in `docs/front-end-state-management.md`. Styling will be managed via **Tailwind CSS and/or CSS Modules** for a utility-first approach and scoped styles.

## Detailed Frontend Directory Structure

```markdown
src/frontend/
├── app/                        # Next.js App Router: Defines pages, layouts, and routes. MUST contain route segments, layouts, and page components.
│   ├── (auth)/                 # Route group for authentication-related pages (login, register, forgot-password).
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/                 # Main application routes, grouped for layout purposes.
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Entry page component for dashboard.
│   │   ├── listings/
│   │   │   └── page.tsx        # Page for Browse listings.
│   │   │   └── [listingId]/    # Dynamic route for single listing details.
│   │   │       └── page.tsx
│   │   ├── businesses/
│   │   │   └── page.tsx        # Page for Browse local businesses.
│   │   │   └── [businessId]/   # Dynamic route for single business details.
│   │   │       └── page.tsx
│   │   └── layout.tsx          # Layout common to main application routes (e.g., sidebar, header).
│   ├── api/                    # Next.js API Routes. MUST contain backend handlers for client-side API calls if Next.js handles proxying/serverless functions.
│   ├── globals.css             # Global styles. MUST contain base styles, CSS variable definitions, Tailwind base/components/utilities.
│   └── layout.tsx              # Root layout for the entire application.
├── components/                 # Shared and Reusable UI Components.
│   ├── ui/                     # Base UI elements (Button, Input, Card). MUST contain only generic, reusable, presentational UI elements, often mapped from a design system. MUST NOT contain business logic.
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── layout/                 # Layout components (Header, Footer, Sidebar, Navigation). MUST contain components structuring page layouts, not specific page content.
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── common/                 # Components used across multiple features but not generic UI (e.g., Modals, Loaders, Alerts).
│       └── LoadingSpinner.tsx
├── features/                   # Feature-specific logic, hooks, non-global state, services, and components solely used by that feature.
│   ├── auth/                   # Authentication related components and hooks.
│   │   ├── components/         # Components used exclusively by the auth feature (e.g., LoginForm). MUST NOT be imported by other features.
│   │   ├── hooks/              # Custom React Hooks specific to the 'auth' feature (e.g., useAuth). Hooks reusable across features belong in `src/hooks/`.
│   │   └── services/           # Feature-specific API interactions or orchestrations for the 'auth' feature.
│   ├── listings/               # Components and logic related to service/tool/skill listings.
│   │   ├── components/
│   │   └── hooks/
│   ├── businesses/             # Components and logic related to business profiles and ads.
│   │   ├── components/
│   │   └── services/
│   └── internal-dashboard/     # Components and logic for the internal team dashboard.
│       ├── components/
│       └── hooks/
├── hooks/                      # Global/sharable custom React Hooks. MUST be generic and usable by multiple features/components.
│   └── useDebounce.ts
├── lib/ / utils/               # Utility functions, helpers, constants. MUST contain pure functions and constants, no side effects or framework-specific code unless clearly named (e.g., `react-helpers.ts`).
│   └── validators.ts
│   └── dateUtils.ts
├── services/                   # Global API service clients or SDK configurations. MUST define base API client instances and core data fetching/mutation services.
│   └── apiClient.ts            # Axios instance for backend communication.
│   └── authService.ts          # Core authentication service functions.
├── store/                      # Global state management setup (e.g., Redux store).
│   ├── index.ts                # Main store configuration and export.
│   ├── rootReducer.ts          # Root reducer if using Redux.
│   └── (slices)/               # Directory for global state slices (e.g., userSlice, uiSlice).
├── styles/                     # Global styles, theme configurations (if not using `globals.css` or similar, or for specific styling systems like SCSS partials).
│   └── variables.css
├── public/                     # Static assets (images, fonts, favicons).
│   └── images/
│   └── fonts/
└── types/                      # Global TypeScript type definitions/interfaces. MUST contain types shared across multiple features/modules.
    └── index.ts
    └── api.ts                  # API response/request types.
```

### Notes on Frontend Structure:

- **Feature-Based Organization**: The `app/` and `features/` directories promote a feature-based organization. Logic, components, and state related to a specific feature are co-located within its `features/[feature-name]` directory to improve modularity and reduce coupling.

- **Global vs. Local Components**: Components under `src/frontend/components/` are designed for global reusability across the application. Components nested within `features/` are typically exclusive to that feature.

- **Clear Boundaries**: Each directory has a mandatory purpose description to guide placement. AI Agents MUST adhere to this defined structure strictly. New files MUST be placed in the appropriate directory based on these descriptions.

- **Typescript Usage**: All components, hooks, services, and store slices will leverage TypeScript for strong type safety. Global types are centralized in `src/frontend/types/`.

---
