# Quality Neighbor Monorepo

## Project Overview

This is a Turborepo-based monorepo for the Quality Neighbor hyperlocal community platform. The project aims to build stronger communities through strategic communication and authentic engagement.

The tech stack includes:
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Monorepo Management:** pnpm workspaces, Turborepo

## Building and Running

### Prerequisites
- Node.js 18.0 or higher
- pnpm package manager

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development
- Run all apps in development mode:
  ```bash
  pnpm dev
  ```
- Run a specific app (e.g., `qn-dashboard`):
  ```bash
  pnpm dev --filter=@qn/dashboard
  ```

### Building
- Build all apps:
  ```bash
  pnpm build
  ```
- Build a specific app:
  ```bash
  pnpm build --filter=@qn/dashboard
  ```

### Testing
- Run all tests:
  ```bash
  pnpm test
  ```
- Run unit tests:
  ```bash
  pnpm test:unit
  ```
- Run integration tests:
  ```bash
  pnpm test:integration
  ```
- Run end-to-end tests:
  ```bash
  pnpm test:e2e
  ```

### Linting
- Lint all packages:
  ```bash
  pnpm lint
  ```
- Lint a specific app:
  ```bash
  pnpm lint --filter=@qn/dashboard
  ```

### Type Checking
- Check types in all packages:
  ```bash
  pnpm check-types
  ```

## Development Conventions

- **Coding Style:** The project uses ESLint and Prettier for code consistency and formatting.
- **Testing:** The project has a comprehensive testing strategy, including unit, integration, and end-to-end tests.
- **Commits:** The project uses Conventional Commits.
- **Contributions:** Contributions are managed through feature branches and pull requests.

## Key Files

- **`README.md`:** The main entry point for understanding the project, its structure, and how to get started.
- **`package.json`:** Defines the project's dependencies and scripts.
- **`pnpm-workspace.yaml`:** Defines the pnpm workspaces for the monorepo.
- **`turbo.json`:** Configures the Turborepo build system.
- **`apps/`:** Contains the individual applications of the Quality Neighbor platform.
- **`packages/`:** Contains the shared packages used by the applications.
- **`Quality-Neighbor-Docs/`:** Contains comprehensive project documentation.
