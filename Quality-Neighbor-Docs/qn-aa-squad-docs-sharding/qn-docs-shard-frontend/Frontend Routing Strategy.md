---
type: Page
title: Frontend Routing Strategy
description: null
icon: null
createdAt: '2025-07-17T06:59:11.403Z'
creationDate: 2025-07-17 01:59
modificationDate: 2025-07-17 01:59
tags: []
coverImage: null
---

### Sharding Front-End Specific Documentation: Frontend Routing Strategy

**7.** `docs/front-end-routing-strategy.md`

# Frontend Routing Strategy

This document details how navigation and routing are handled in the Quality Neighbor frontend application. It defines the main routes, their associated components, and the mechanisms for route protection based on authentication and authorization.

## Routing Library

The routing library used for Quality Neighbor will be **Next.js App Router**. This leverages convention-based routing integrated directly with React components for pages and layouts, supporting server components and advanced data fetching.

### Route Definitions

The main routes of the application and the primary component/page rendered for each are defined below. The structure aligns with the `src/frontend/app/` directory.

| Path Pattern                     | Component/Page (`src/frontend/app/...`)   | Protection                              | Notes                                                                                     |
| :------------------------------- | :---------------------------------------- | :-------------------------------------- | :---------------------------------------------------------------------------------------- |
| `/`                              | `page.tsx`                                | `Public`                                | Public landing page.                                                                      |
| `/login`                         | `(auth)/login/page.tsx`                   | `Public` (redirect if auth)             | Login page. Redirects to `/dashboard` if already authenticated.                           |
| `/register`                      | `(auth)/register/page.tsx`                | `Public` (redirect if auth)             | Registration page.                                                                        |
| `/dashboard`                     | `(main)/dashboard/page.tsx`               | `Authenticated`                         | Main user dashboard for both residents and business owners.                               |
| `/residents/listings`            | `(main)/listings/page.tsx`                | `Authenticated`                         | Page for Browse service/tool/skill listings.                                              |
| `/residents/listings/:listingId` | `(main)/listings/[listingId]/page.tsx`    | `Authenticated`                         | Dynamic route for viewing details of a single listing. Parameter: `listingId` (string).   |
| `/businesses`                    | `(main)/businesses/page.tsx`              | `Public` (directory)                    | Public directory of local businesses.                                                     |
| `/businesses/:businessId`        | `(main)/businesses/[businessId]/page.tsx` | `Public`                                | Dynamic route for viewing details of a single business. Parameter: `businessId` (string). |
| `/businesses/dashboard`          | `(main)/businesses/dashboard/page.tsx`    | `Authenticated`, `Role:[BusinessOwner]` | Dashboard for business owners to manage ads.                                              |
| `/internal/dashboard`            | `(main)/internal/dashboard/page.tsx`      | `Authenticated`, `Role:[Internal]`      | Dashboard for internal Quality Neighbor team.                                             |
| `/privacy-policy`                | `privacy-policy/page.tsx`                 | `Public`                                | Static page for Privacy Policy.                                                           |
| `/terms-of-service`              | `terms-of-service/page.tsx`               | `Public`                                | Static page for Terms of Service.                                                         |

Export to Sheets

### Route Guards / Protection

Routes will be protected based on authentication status and user roles.

- **Authentication Guard:** Routes are protected by middleware or layout components that check the user's authentication status.

    - **Mechanism:** Middleware in `middleware.ts` will check the presence and validity of the JWT token. For pages, `layout.tsx` files within `(auth)` and `(main)` route groups will handle redirect logic.

    - **Logic:** Uses authentication state from the `sessionSlice` (or equivalent global state).

    - **Redirect:** Unauthenticated users attempting to access protected routes MUST be redirected to `/login`.

- **Authorization Guard (Role-Based Protection):** Specific routes or UI elements will be protected based on user roles (`Resident`, `BusinessOwner`, `Internal`).

    - **Mechanism:** Implemented within `layout.tsx` files or page components, checking the `role` property of the `currentUser` from the `sessionSlice`.

    - **Redirect/Fallback:** Unauthorized users (authenticated but lacking permissions) MUST be shown a "Forbidden" page or redirected to a safe, allowed page (e.g., back to `/dashboard`).

