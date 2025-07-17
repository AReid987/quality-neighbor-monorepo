---
type: Page
title: Frontend State Management In-Depth
description: null
icon: null
createdAt: '2025-07-17T06:57:11.769Z'
creationDate: 2025-07-17 01:57
modificationDate: 2025-07-17 01:58
tags: []
coverImage: null
---

### Sharding Front-End Specific Documentation: Frontend State Management

**5.** `docs/front-end-state-management.md`

# Frontend State Management In-Depth

This document expands on the state management strategy for the Quality Neighbor frontend application. It details the chosen solution, conventions for organizing the global state, and specifications for selectors and actions/thunks.

## Chosen Solution

The state management solution for the Quality Neighbor frontend will be **Redux Toolkit**. This choice provides a robust, scalable, and predictable state container, leveraging best practices for Redux development with simplified API for common tasks.

## Decision Guide for State Location

- **Global State (Redux Toolkit):** Data shared across many unrelated components; data persisting across routes; complex state logic managed via reducers/thunks. MUST be used for session data, user preferences, application-wide notifications, and core application data (e.g., user profiles, business listings) that needs to be accessed by multiple features.

- **React Context API:** State primarily passed down a specific component subtree (e.g., theme, form context). Simpler state, fewer updates compared to global state. MUST be used for localized state not suitable for prop drilling but not needed globally.

- **Local Component State (**`useState`**,** `useReducer`**):** UI-specific state, not needed outside the component or its direct children (e.g., form input values, dropdown open/close status). MUST be the default choice unless criteria for Context or Global State are met.

### Store Structure / Slices

Each major feature requiring global state will have its own Redux slice, typically located within `src/frontend/store/slices/` or co-located in `src/frontend/features/[featureName]/store.ts` if the state is primarily consumed by that feature.

- **Core Slice Example:** `sessionSlice` **(in** `src/frontend/store/slices/sessionSlice.ts`**)**:

    - **Purpose:** Manages user session, authentication status, and basic user profile info accessible globally.

    - **State Shape (Interface/Type):**

        TypeScript

        ```typescript
        interface SessionState {
          currentUser: { id: string; name: string; email: string; roles: string[]; } | null;
          isAuthenticated: boolean;
          token: string | null;
          status: "idle" | "loading" | "succeeded" | "failed"; // For auth process
          error: string | null;
        }
        ```

    - **Key Reducers/Actions (within** `createSlice`**):** `setCurrentUser`, `clearSession`, `setAuthStatus`, `setAuthError`.

    - **Async Thunks (if any):** `loginUserThunk`, `fetchUserProfileThunk`, `logoutUserThunk`.

    - **Selectors (memoized with** `createSelector`**):** `selectCurrentUser`, `selectIsAuthenticated`, `selectAuthToken`.

- **Feature Slice Template (e.g.,** `listingsSlice` **in** `src/frontend/store/slices/listingsSlice.ts`**):**

    - **Purpose:** To manage the state related to service/tool/skill listings (e.g., list of listings, loading status, filters).

    - **State Shape (Interface/Type):**

        TypeScript

        ```typescript
        interface ListingsState {
          items: ServiceListing[]; // Array of listings
          status: "idle" | "loading" | "succeeded" | "failed";
          error: string | null;
          filters: { category: string | null; type: "Offer" | "Request" | null; };
        }
        ```

    - **Key Reducers/Actions (within** `createSlice`**):** `setListings`, `addListing`, `updateListingFilters`.

    - **Async Thunks (if any, defined using** `createAsyncThunk`**):** `fetchListingsThunk`, `createListingThunk`.

    - **Selectors (memoized with** `createSelector`**):** `selectListings`, `selectListingsStatus`, `selectListingsFilters`.

    - **Export:** All actions and selectors MUST be exported.

### Key Selectors

All selectors deriving data or combining multiple state pieces MUST use `createSelector` from Reselect (or equivalent for other state libraries) for memoization.

- `selectCurrentUser` (from `sessionSlice`): Returns the `currentUser` object.

- `selectIsAuthenticated` (from `sessionSlice`): Returns `isAuthenticated` boolean.

- `selectAuthToken` (from `sessionSlice`): Returns the `token` from `sessionSlice`.

### Key Actions / Reducers / Thunks

Each thunk MUST clearly define its purpose, parameters, API calls made (referencing the API Interaction Layer), and how it updates the state on pending, fulfilled, and rejected states.

- **Core Action/Thunk Example:** `loginUserThunk(credentials: AuthCredentials)` **(in** `sessionSlice.ts`**)**:

    - **Purpose:** Handles user login by calling the auth API and updating the `sessionSlice`.

    - **Parameters:** `credentials: { email: string; password: string }`.

    - **Dispatch Flow (using Redux Toolkit** `createAsyncThunk`**):**

        1. On `pending`: Dispatches `sessionSlice.actions.setAuthStatus('loading')`.

        2. Calls `authService.login(credentials)` (from `src/frontend/services/authService.ts`).

        3. On `fulfilled` (success): Dispatches `sessionSlice.actions.setCurrentUser(response.data.user)`, `sessionSlice.actions.setToken(response.data.token)`, `sessionSlice.actions.setAuthStatus('succeeded')`.

        4. On `rejected` (error): Dispatches `sessionSlice.actions.setAuthError(error.message)`, `sessionSlice.actions.setAuthStatus('failed')`.

