---
type: Page
title: Definitive Tech Stack Selections
description: null
icon: null
createdAt: '2025-07-17T06:08:59.722Z'
creationDate: 2025-07-17 01:08
modificationDate: 2025-07-17 01:39
tags: []
coverImage: null
---

**5.** `docs/tech-stack.md`

# Definitive Tech Stack Selections

This section outlines the definitive technology choices for the Quality Neighbor project. These selections are made after a thorough understanding of the project's requirements, components, data models, and core workflows, prioritizing efficiency, developer productivity, and scalability.

This table is the **single source of truth** for all technology selections. Other architecture documents (e.g., Frontend Architecture) must refer to these choices and elaborate on their specific application rather than re-defining them.

| Category                         | Technology                                                            | Version / Details | Description / Purpose                                                                                                    | Justification (Optional)                                       |
| :------------------------------- | :-------------------------------------------------------------------- | :---------------- | :----------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| **Frontend**                     | React/Next.js                                                         | Latest stable     | For performance, SEO, and developer experience for all user-facing and internal dashboards.                              | Rapid development of production-ready software.                |
| **UI Framework/Design System**   | Radix UI-based                                                        | N/A               | For consistent UI/UX, adherence to 8px grid system, and improved UX.                                                     | Optimized for efficient implementation by AI developer agents. |
| **Backend Language/Framework**   | Node.js with Express.js or Python with FastAPI/Django                 | Latest stable     | For rapid API development and scalability. Choice to be confirmed based on specific team expertise for maximum velocity. |                                                                |
| **Database**                     | PostgreSQL                                                            | Latest stable     | For relational data, ACID compliance, and scalability.                                                                   |                                                                |
| **Caching/Real-time DB**         | Redis                                                                 | Latest stable     | For caching and real-time features like temporary message states.                                                        |                                                                |
| **Authentication/Authorization** | OAuth 2.0 / JWT                                                       | N/A               | For token-based authentication and role-based access control (RBAC).                                                     |                                                                |
| **ID Verification**              | Stripe Identity                                                       | N/A               | For robust identity verification processes, crucial for trust and safety.                                                |                                                                |
| **Cloud Provider**               | AWS or GCP                                                            | N/A               | For scalability, managed services, and global reach.                                                                     |                                                                |
| **Containerization**             | Docker                                                                | Latest stable     | For application containerization.                                                                                        |                                                                |
| **Orchestration**                | Kubernetes or AWS ECS/GCP Cloud Run                                   | N/A               | For managing containerized applications, scaling, and high availability.                                                 |                                                                |
| **CI/CD**                        | GitHub Actions or GitLab CI                                           | N/A               | For automated testing, building, and deployment.                                                                         | Ensures rapid and reliable releases.                           |
| **Monitoring & Logging**         | Prometheus/Grafana or cloud-native solutions (CloudWatch/Stackdriver) | N/A               | For system health, performance, and error tracking.                                                                      |                                                                |
| **Communication/Messaging**      | WebSockets                                                            | N/A               | For real-time messaging (user-to-user, business-to-team).                                                                |                                                                |
| **Email Communication**          | Dedicated email service provider (e.g., SendGrid, Mailgun)            | N/A               | For transactional emails and bulk newsletters.                                                                           |                                                                |
| **Maps (Future)**                | Google Maps API                                                       | N/A               | For features like the tool/library map.                                                                                  |                                                                |

Export to Sheets

---
