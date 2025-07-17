---
type: Page
title: Operational Guidelines
description: null
icon: null
createdAt: '2025-07-17T06:13:18.491Z'
creationDate: 2025-07-17 01:13
modificationDate: 2025-07-17 01:39
tags: []
coverImage: null
---

**6.** `docs/operational-guidelines.md`

# Operational Guidelines

This document outlines the mandatory standards and strategies for coding, error handling, testing, and security that all AI-generated and human-written code for Quality Neighbor must adhere to. Deviations are not permitted unless explicitly approved and documented as an exception.

## Coding Standards

These standards are mandatory for all code generation by AI agents and human developers.

- **Primary Runtime(s):** Node.js 22.x (if chosen) or Python Runtime (if chosen for backend/ML).

- **Style Guide & Linter:** To be selected based on the primary backend language/framework (e.g., ESLint with Airbnb config + Prettier for Node.js; Black, Flake8, MyPy for Python). Linter rules are mandatory and must not be disabled without cause.

- **Naming Conventions:**

    - Variables: `camelCase` (for JavaScript/TypeScript) or `snake_case` (for Python).

    - Functions/Methods: `camelCase` (for JavaScript/TypeScript) or `snake_case` (for Python).

    - Classes/Types/Interfaces: `PascalCase`.

    - Constants: `UPPER_SNAKE_CASE`.

    - Files: `kebab-case.ts` (for TypeScript), `snake_case.py` (for Python). Specific to language.

    - Modules/Packages: Specific to language.

- **File Structure:** Adhere to the layout defined in `docs/project-structure.md`.

- **Unit Test File Organization:** E.g., `*.test.ts`/`*.spec.ts` co-located with source files or `test_*.py` in a parallel `tests/` directory. Convention to be specified per language.

- **Asynchronous Operations:** Always use `async`/`await` for promise-based operations.

- **Type Safety:** Leverage TypeScript strict mode (all flags enabled) or Python type hints (enforced by MyPy). All new code must be strictly typed.

    - *Type Definitions:* Located in `src/shared/types.ts` or co-located. Policy on using `any` (strongly discouraged, requires justification).

- **Comments & Documentation:**

    - Code Comments: Explain *why*, not *what*, for complex logic. Use standard formats like JSDoc/TSDoc or Python docstrings.

    - READMEs: Each module/package/service should have a README explaining its purpose, setup, and usage if not trivial.

- **Dependency Management:** Tool used (e.g., npm/yarn, pip/poetry). Policy on adding new dependencies (e.g., approval process, security vulnerability scans). Prefer pinned versions.

## Error Handling Strategy

- **General Approach:** Use exceptions as the primary mechanism. Clearly defined custom error types hierarchy.

- **Logging:**

    - Library/Method: Use a dedicated logging library like `Pino` (Node.js) or Python `logging` module with `structlog`.

    - Format: JSON (preferred for structured logging).

    - Levels: DEBUG, INFO, WARN, ERROR, CRITICAL. Standard usage for each must be defined.

    - Context: Correlation ID, User ID (if safe), Service Name, Operation Name, Key Parameters (sanitized).

- **Specific Handling Patterns:**

    - External API Calls: Define retry mechanisms (e.g., exponential backoff, max retries), circuit breaker pattern usage, timeout configurations. API errors (4xx, 5xx) must be translated or propagated consistently.

    - Internal Errors / Business Logic Exceptions: Convert internal errors to generic user-facing messages (with a unique ID for support). Define specific business exception classes.

    - Transaction Management: Ensure data consistency using database transactions (specify isolation levels if non-default).

## Overall Testing Strategy

This section outlines the project's comprehensive testing strategy, which all AI-generated and human-written code must adhere to.

- **Tools:** Jest (for unit/integration), Playwright (for E2E).

- **Unit Tests:**

    - Scope: Test individual functions, methods, classes in isolation.

    - Location: `*.test.ts`/`*.spec.ts` co-located with source files or `test_*.py` in a parallel `tests/` directory.

    - Mocking/Stubbing: Mock all external dependencies (network calls, DB, file system).

    - AI Agent Responsibility: AI Agent must generate unit tests covering all public methods, logic paths, edge cases, and error conditions for any new/modified code.

- **Integration Tests:**

    - Scope: Test interaction between several components or services (e.g., API endpoint to service to database).

    - Location: E.g., `/tests/integration`.

    - Environment: Use Testcontainers for databases/external services or in-memory versions.

- **End-to-End (E2E) Tests:**

    - Scope: Validate complete user flows from the user's perspective (e.g., UI interaction, API call sequence).

    - Tools: Playwright.

    - AI Agent Responsibility: AI Agent may be tasked with generating E2E test stubs or scripts based on user stories/BDD scenarios.

- **Test Coverage:** Target 80% line/branch coverage for unit tests (guideline).

- **Mocking/Stubbing Strategy:** Prefer fakes or test doubles over extensive mocking when it improves test clarity and maintainability.

- **Test Data Management:** Create, manage, and isolate test data using factories, fixtures, or setup/teardown scripts.

## Security Best Practices

These practices are mandatory and must be actively addressed during development.

- **Input Sanitization/Validation:** Use specified libraries/methods for ALL external inputs (API requests, user data, file uploads). Validation must occur at the boundary before processing.

- **Output Encoding:** All dynamic data rendered must be contextually auto-escaped by the template engine to prevent XSS.

- **Secrets Management:** Access secrets *only* through a designated configuration module/service. Never hardcode secrets, include them in source control, or log them.

- **Dependency Security:** Run automated vulnerability scans (e.g., `npm audit`, `pip-audit`, Snyk, Dependabot alerts) as part of CI. Update vulnerable dependencies promptly.

- **Authentication/Authorization Checks:** Enforce authentication on all API endpoints (except explicitly public ones) using central auth module/middleware. Authorization checks must be performed at the service layer for protected resources.

- **Principle of Least Privilege:** Database connection users and IAM roles for cloud services must have only the necessary permissions.

- **API Security (General):** Enforce HTTPS. Implement rate limiting and throttling. Use standard HTTP security headers (CSP, HSTS, X-Frame-Options).

- **Error Handling & Information Disclosure:** Ensure error messages do not leak sensitive information (stack traces, internal paths, detailed SQL errors) to end-users. Log detailed errors server-side, provide generic messages or error IDs to the client.

- **Regular Security Audits/Testing:** Include penetration testing and static/dynamic analysis tool usage in CI (SAST/DAST).

