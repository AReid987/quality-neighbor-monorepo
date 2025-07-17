---
type: Page
title: Core Workflow / Sequence Diagrams
description: null
icon: null
createdAt: '2025-07-17T06:20:06.182Z'
creationDate: 2025-07-17 01:20
modificationDate: 2025-07-17 01:39
tags: []
coverImage: null
---

**8.** `docs/sequence-diagrams.md`

# Core Workflow / Sequence Diagrams

This section illustrates key or complex workflows within the Quality Neighbor system using Mermaid sequence diagrams. These diagrams provide a visual representation of the interactions between different components and actors during critical operations.

*(Note: The* `Architecture Document for Quality Neighbor` *does not contain specific sequence diagrams at this level of detail. The following is a conceptual representation based on the PRD and Architectural components for key workflows.)*

## 1. User Registration and Login Flow

[qn-user-flow-SEQ](https://app.capacities.io/6002bb54-716f-4804-8c6a-17e1e219e363/81ada0d6-5a78-4bfe-a51b-b1055689a25b)

```markdown
sequenceDiagram
    participant U as User (Resident/Business/Internal)
    participant F as Frontend (React/Next.js)
    participant B as Backend (Node.js/Python)
    participant DB as PostgreSQL DB
    participant AS as Auth Service (Custom/Auth0)
    U->>F: Navigates to Registration Page
    F->>U: Displays Registration Form
    U->>F: Submits Registration Data (email, password, role, etc.)
    F->>B: POST /api/v1/auth/register (Registration Request)
    B->>AS: Register User (email, password, role)
    AS->>DB: Store User (hashed password)
    AS-->>B: User Created
    B->>AS: Generate JWT for User
    AS-->>B: JWT Token
    B-->>F: 201 Created (userId, token)
    F->>U: Redirects to Dashboard/Home, Stores Token
    alt Login Flow
        U->>F: Navigates to Login Page
        F->>U: Displays Login Form
        U->>F: Submits Login Credentials (email, password)
        F->>B: POST /api/v1/auth/login (Login Request)
        B->>AS: Authenticate User (email, password)
        AS->>DB: Verify Credentials
        AS-->>B: Authentication Result
        B->>AS: Generate JWT for User
        AS-->>B: JWT Token
        B-->>F: 200 OK (userId, token, role)
        F->>U: Redirects to Dashboard/Home, Stores Token
    else Authentication Failed
        AS-->>B: Authentication Failed
        B-->>F: 401 Unauthorized
        F->>U: Displays Error Message
    end
```

## 2. Creating a Service/Tool/Skill Listing Flow

[qn-create-listing-SEQ](https://app.capacities.io/6002bb54-716f-4804-8c6a-17e1e219e363/93da4a85-7846-4830-b460-0221173e0dee)

```markdown
sequenceDiagram
    participant R as Resident (Verified)
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL DB
    R->>F: Navigates to "Create Listing"
    F->>U: Displays Listing Form (requires token)
    F->>B: GET /api/v1/users/:userId/profile (to check isVerified status)
    B->>DB: Query User Profile
    DB-->>B: User Data (including isVerified)
    B-->>F: 200 OK (User Profile)
    alt User Not Verified For Offers
        F->>R: Prompts for ID Verification (if type is "Offer" and not verified)
    else User is Verified
        R->>F: Enters Listing Details (title, description, category, type="Offer/Request")
        F->>B: POST /api/v1/listings (Auth Token, Listing Data)
        B->>DB: Store New ServiceListing
        DB-->>B: Listing Stored
        B-->>F: 201 Created (listingId)
        F->>R: Displays Confirmation / Success Message
    end
```

## 3. Business Owner Views Ad Analytics Flow

[qn-biz-owner-ad-analytics-SEQ](https://app.capacities.io/6002bb54-716f-4804-8c6a-17e1e219e363/9311f4ce-3f83-4d16-8663-3837103a8c70)

```markdown
sequenceDiagram
    participant BO as Business Owner
    participant F as Frontend
    participant B as Backend
    participant DB as PostgreSQL DB
    BO->>F: Logs in as Business Owner
    F->>B: Authenticates (JWT Token)
    F->>BO: Redirects to Business Dashboard
    BO->>F: Clicks "View Ad Analytics"
    F->>B: GET /api/v1/businesses/dashboard/analytics (Auth Token)
    B->>DB: Query Ad Data for Business Owner
    DB-->>B: Ad Campaign Metrics (impressions, clicks, conversions)
    B-->>F: 200 OK (Ad Analytics Data)
    F->>BO: Displays Ad Performance Dashboard
```

---
