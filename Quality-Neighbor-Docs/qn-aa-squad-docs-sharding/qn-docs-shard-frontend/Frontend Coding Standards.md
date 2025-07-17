---
type: Page
title: Frontend Coding Standards
description: null
icon: null
createdAt: '2025-07-17T06:56:16.255Z'
creationDate: 2025-07-17 01:56
modificationDate: 2025-07-17 01:56
tags: []
coverImage: null
---

### Sharding Front-End Specific Documentation: Frontend Coding Standards

**4.** `docs/front-end-coding-standards.md`

# Frontend Coding Standards

This document outlines the mandatory coding standards and conventions specifically for the Quality Neighbor frontend codebase. These standards ensure consistency, readability, maintainability, and align with the overall project's operational guidelines. All AI-generated and human-written frontend code MUST adhere to these guidelines.

## General Coding Standards (Frontend Specifics)

- **Primary Language/Framework:** TypeScript/React (with Next.js).

- **Style Guide & Linter:** ESLint with a recommended React configuration (e.g., Airbnb config) and Prettier for code formatting. Linter rules are mandatory and must not be disabled without cause.

- **Naming Conventions:**

    - Variables: `camelCase`.

    - Functions/Methods: `camelCase`.

    - Classes/Types/Interfaces: `PascalCase`.

    - Constants: `UPPER_SNAKE_CASE`.

    - Files: `kebab-case.ts` or `PascalCase.tsx` for components.

- **File Structure:** Adhere strictly to the `src/frontend/` layout defined in `docs/front-end-project-structure.md`.

- **Unit Test File Organization:** `*.test.tsx` or `*.spec.tsx` co-located with source components or in `__tests__` subdirectory.

- **Asynchronous Operations:** Always use `async`/`await` for promise-based operations. Avoid raw Promises where `async`/`await` can be used for clarity.

- **Type Safety:** Leverage TypeScript strict mode (all flags enabled).

    - *Type Definitions:* All new code must be strictly typed. Global types are in `src/frontend/types/`. Avoid `any` type (strongly discouraged, requires justification).

- **Comments & Documentation:** Explain *why*, not *what*, for complex logic. Use JSDoc/TSDoc format for component props, functions, and interfaces.

- **Dependency Management:** npm/yarn. Prefer pinned versions. New dependencies must follow security vulnerability check policies.

## TypeScript/React/Next.js Specifics

- **Immutability:** Always prefer immutable data structures. Use `Readonly<T>`, `ReadonlyArray<T>`, `as const` for object/array literals. Avoid direct mutation of objects/arrays passed as props or state. Consider libraries like Immer for complex state updates.

- **Functional vs. OOP:** Favor functional components and React Hooks. Avoid class components in new code unless there's a strong justification (e.g., error boundaries). Pure functions should be used for data transformation and business logic.

- **Error Handling Specifics:** Always use `Error` objects or extensions thereof for `throw`. Ensure `Promise` rejections are always `Error` objects. Use custom error classes inheriting from a base `AppError` for domain-specific errors.

- **Null/Undefined Handling:** Strict null checks (`strictNullChecks`) must be enabled. Avoid `!` non-null assertion operator; prefer explicit checks, optional chaining (`?.`), or nullish coalescing (`??`).

- **Module System:** Use ESModules (`import`/`export`) exclusively.

- **Logging Specifics:** Use the chosen structured logging library. Log messages must include a correlation ID. Do not log sensitive PII. Use appropriate log levels.

- **Framework Idioms (Next.js/React):**

    - **Next.js App Router**: Adhere to the App Router conventions for defining layouts, pages, and routing segments.

    - **React Components**: Utilize `React.memo` for components that render frequently with same props to minimize re-renders. Use `useCallback` and `useMemo` where appropriate for performance optimization.

    - **Props**: Use destructuring for props in functional components.

    - **Conditional Rendering**: Clear and readable conditional rendering using `&&` or ternary operators.

- **Key Library Usage Conventions:**

    - **HTTP Client**: Use the configured Axios instance from `src/frontend/services/apiClient.ts` for all API calls.

    - **Date/Time**: Use `date-fns` or `dayjs` for date and time manipulations, avoiding native `Date` object for complex operations.

- **Code Generation Anti-Patterns to Avoid:** Avoid overly nested conditional logic (max 2-3 levels). Avoid single-letter variable names (except for trivial loop counters). Do not write code that bypasses framework security features.

