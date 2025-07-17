---
type: Page
title: Frontend Component Guide
description: null
icon: null
createdAt: '2025-07-17T06:48:09.694Z'
creationDate: 2025-07-17 01:48
modificationDate: 2025-07-17 01:56
tags: []
coverImage: null
---

### Sharding Front-End Specific Documentation: Component Guide

**3.** `docs/front-end-component-guide.md`

# Frontend Component Guide

This document outlines the conventions and templates for defining and implementing UI components within the Quality Neighbor frontend application. It ensures consistency, reusability, and maintainability across the component library.

## Component Naming & Organization

- **Component Naming Convention:** `PascalCase` for both files and component names (e.g., `UserProfileCard.tsx`). All component files MUST follow this convention.

- **Organization:**

    - Globally reusable UI elements (e.g., Button, Input, Card) are located in `src/frontend/components/ui/`. These are typically presentational and mapped from a design system.

    - Layout components (e.g., Header, Footer, Sidebar) are in `src/frontend/components/layout/`.

    - Feature-specific components (used exclusively by a single feature) are co-located within their feature directory (e.g., `src/frontend/features/[feature-name]/components/`). These MUST NOT be imported by other features.

## Template for Component Specification

For each significant UI component identified from the UI/UX Specification and design files (Figma), the following details MUST be provided. The level of detail MUST be sufficient for an AI agent or human developer to implement it with minimal ambiguity.

#### Component: `{ComponentName}`

- **Purpose:** {Briefly describe what this component does and its role in the UI. MUST be clear and concise}.

- **Source File(s):** {e.g., `src/frontend/components/user-profile/UserProfileCard.tsx`. MUST be the exact path}.

- **Visual Reference:** {Link to specific Figma frame/component, or Storybook page. REQUIRED}.

- **Props (Properties):** 

| Prop Namer   | Type                                                                       | Required? | Default Value | Description                                                                                      |
| :----------- | :------------------------------------------------------------------------- | :-------- | :------------ | :----------------------------------------------------------------------------------------------- |
| `{propName}` | `{Specific primitive, imported type, or inline interface/type definition}` | {Yes/No}  | {if any}      | {MUST clearly state the prop's purpose and any constraints, e.g., 'Must be a positive integer.'} |
|              |                                                                            |           |               |                                                                                                  |

- **Internal State (if any):** { Describe any significant internal state the component manages. Only list state that is *not* derived from props or global state. If state is complex, consider if it should be managed by a custom hook or global state solution instead. } 

| State Variable    | Type     | Initial Value | Description                                       |
| :---------------- | :------- | :------------ | :------------------------------------------------ |
| `{stateVariable}` | `{type}` | `{value}`     | {Description of state variable and its purpose.}  |
|                   |          |               |                                                   |

- **Key UI Elements / Structure:** { Provide a pseudo-HTML or JSX-like structure representing the component's DOM. Include key conditional rendering logic if applicable. **This structure dictates the primary output for the AI agent.** }

    HTML

    ```html
    <div> </div>
    ```

- **Events Handled / Emitted:**

    - **Handles:** {e.g., `onClick` on a button, `onChange` on an input.}

    - **Emits:** {If the component emits custom events/callbacks not covered by props, describe them with their exact signature. e.g., `onFollow: (payload: { userId: string; followed: boolean }) => void`}

- **Actions Triggered (Side Effects):**

    - **State Management:** {e.g., "Dispatches `userSlice.actions.setUserName(newName)` from `src/frontend/store/slices/userSlice.ts`. Action payload MUST match the defined action creator." OR "Calls `updateUserProfileOptimistic(newData)` from a local `useReducer` hook."}

    - **API Calls:** {Specify which service/function from the "API Interaction Layer" is called. e.g., "Calls `userService.fetchUser(userId)` from `src/frontend/services/userService.ts` on mount. Request payload: `{ userId }`. Success response populates internal state `userData`. Error response dispatches `uiSlice.actions.showErrorToast({ message: 'Failed to load user details' })`.}

- **Styling Notes:**

    - {MUST reference specific Design System component names (e.g., "Uses `<Button variant='primary'>` from UI library") OR specify Tailwind CSS classes / CSS module class names to be applied (e.g., "Container uses `p-4 bg-white rounded-lg shadow-md`. Title uses `text-xl font-semibold`.") OR specify SCSS custom component classes to be applied (e.g., "Container uses `@apply p-4 bg-white rounded-lg shadow-md`. Title uses `@apply text-xl font-semibold`."). Any dynamic styling logic based on props or state MUST be described. If Tailwind CSS is used, list primary utility classes or `@apply` directives for custom component classes. AI Agent should prioritize direct utility class usage for simple cases and propose reusable component classes/React components for complex styling patterns.}

- **Accessibility Notes:**

    - {MUST list specific ARIA attributes and their values (e.g., `aria-label="User profile card"`, `role="article"`), required keyboard navigation behavior (e.g., "Tab navigates to avatar, name, email, then edit button. Edit button is focusable and activated by Enter/Space."), and any focus management requirements (e.g., "If this component opens a modal, focus MUST be trapped inside. On modal close, focus returns to the trigger element.").}

