---
type: Page
title: Project Structure
description: null
icon: null
createdAt: '2025-07-17T06:06:06.253Z'
creationDate: 2025-07-17 01:06
modificationDate: 2025-07-17 01:39
tags: []
coverImage: null
---

**4.** `docs/project-structure.md`

# Project Structure

This section provides a high-level overview of the Quality Neighbor project's folder structure, outlining how code and resources are organized. This structure supports modularity, maintainability, and efficient development, particularly with AI developer agents.

## Project Structure Diagram

Plaintext

```text
{project-root}/
├── .github/                    # CI/CD workflows (e.g., GitHub Actions)
│   └── workflows/
│       └── main.yml
├── .vscode/                    # VSCode settings (optional)
│   └── settings.json
├── build/                      # Compiled output (if applicable, often git-ignored)
├── config/                     # Static configuration files (if any)
├── docs/                       # Project documentation (PRD, Arch, etc.)
│   ├── index.md
│   └── ... (other .md files)
├── infra/                      # Infrastructure as Code (e.g., CDK, Terraform)
│   └── lib/
│   └── bin/
├── node_modules/ / venv / target/ # Project dependencies (git-ignored)
├── scripts/                    # Utility scripts (build, deploy helpers, etc.)
├── src/                        # Application source code
│   ├── backend/                # Backend-specific application code (if distinct frontend exists)
│   │   ├── core/               # Core business logic, domain models
│   │   ├── services/           # Business services, orchestrators
│   │   ├── adapters/           # Adapters to external systems (DB, APIs)
│   │   ├── controllers/ / routes/ # API endpoint handlers
│   │   └── main.ts / app.py    # Backend application entry point
│   ├── frontend/               # Placeholder: See Frontend Architecture Doc for details if used
│   ├── shared/ / common/       # Code shared (e.g., types, utils, domain models if applicable)
│   │   └── types/
│   └── main.ts / index.ts / app.ts # Main application entry point (if not using backend/frontend split above)
├── stories/                    # Generated story files for development (optional)
│   └── epic1/
├── test/                       # Automated tests
│   ├── unit/                   # Unit tests (mirroring src structure)
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
├── package.json / requirements.txt / pom.xml # Project manifest and dependencies
├── tsconfig.json / pyproject.toml # Language-specific configuration (if applicable)
├── Dockerfile                  # Docker build instructions (if applicable)
└── README.md                   # Project overview and setup instructions
```

*(The structure above illustrates a potential separation for projects with distinct frontends; for simpler projects or APIs, the* `src/` *structure might be flatter. The specific choices of language-related files (e.g.,* `package.json` *vs* `requirements.txt`*) will depend on the definitive tech stack selected.)*

## Key Directory Descriptions

- `docs/`: Contains all project planning and reference documentation, such as the Project Brief, PRD, Architecture Document, and all sharded documentation files.

- `infra/`: Holds the Infrastructure as Code definitions (e.g., AWS CDK, Terraform).

- `src/`: Contains the main application source code. May be subdivided (e.g., `backend/`, `frontend/`, `shared/`) depending on project complexity and whether a separate frontend architecture document is in use.

- `src/backend/core/` / `src/core/` / `src/domain/`: Core business logic, entities, use cases, independent of frameworks/external services.

- `src/backend/adapters/` / `src/adapters/` / `src/infrastructure/`: Implementation details, interactions with databases, cloud SDKs, frameworks.

- `src/backend/controllers/` / `src/routes/` / `src/pages/`: Entry points for API requests or UI views (if UI is simple and not in a separate frontend structure).

- `test/`: Contains all automated tests, mirroring the `src/` structure where applicable.

## Notes

Specific build output paths, compiler configuration pointers, or other relevant structural notes will be defined during the implementation phase, aligned with the chosen definitive tech stack.

