---
type: Page
title: Frontend Testing Strategy
description: null
icon: null
createdAt: '2025-07-17T06:59:49.697Z'
creationDate: 2025-07-17 01:59
modificationDate: 2025-07-17 02:00
tags: []
coverImage: null
---

### Sharding Front-End Specific Documentation: Frontend Testing Strategy

**8.** `docs/front-end-testing-strategy.md`

# Frontend Testing Strategy

This document details the testing strategy specifically for the Quality Neighbor frontend application. It elaborates on the "Overall Testing Strategy" found in `docs/operational-guidelines.md`, focusing on frontend-specific tools, scopes, and best practices.

## Tools

The primary testing frameworks and libraries for the frontend are **Jest** (for unit/component tests) and **Playwright** (for End-to-End UI tests).

## Component Testing

- **Scope:** Testing individual UI components in isolation (similar to unit tests for components). This includes testing component rendering with various props, user interactions (clicks, input changes), event emission, and basic internal state changes.

- **Tools:** React Testing Library with Jest (or Vitest).

- **Focus:** Rendering with various props, user interactions (clicks, input changes using `fireEvent` or `userEvent`), event emission, basic internal state changes.

    - **Snapshot testing** MUST be used sparingly and with clear justification (e.g., for very stable, purely presentational components with complex DOM structure); prefer explicit assertions.

- **Location:** Test files (e.g., `*.test.tsx` or `*.spec.tsx`) are co-located alongside components, or in a `__tests__` subdirectory.

## Feature/Flow Testing (UI Integration)

- **Scope:** Testing how multiple components interact to fulfill a small user flow or feature within a page. This may involve mocking API calls or global state management. Examples include testing a complete form submission within a feature, including validation and interaction with a mocked service layer.

- **Tools:** React Testing Library with Jest/Vitest, using more complex setups involving mock providers for routing, state, and API calls.

- **Focus:** Data flow between components, conditional rendering based on interactions, navigation within a feature, and integration with mocked services/state.

## End-to-End UI Testing Tools & Scope

- **Tools:** Playwright.

- **Scope (Frontend Focus):** The following key user journeys MUST be covered by E2E UI tests from a UI perspective:

    1. User registration and login flow.

    2. Creating and viewing a service/tool/skill listing.

    3. Business owner registration and navigating to their dashboard.

    4. Submitting an ad campaign creative and verifying its display in the dashboard.

    5. Viewing the local business directory and a specific business profile.

- **Test Data Management for UI:** Consistent test data will be managed through API mocking layers (e.g., MSW) or backend seeding scripts to ensure predictable test environments for UI E2E tests.

- **AI Agent Responsibility:** AI Agent may be tasked with generating E2E test stubs or scripts based on user stories or BDD scenarios, focusing on critical happy paths and key error scenarios.

