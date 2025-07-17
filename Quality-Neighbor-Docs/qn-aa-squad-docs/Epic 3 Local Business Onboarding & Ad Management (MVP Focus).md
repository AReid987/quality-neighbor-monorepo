---
type: Page
title: 'Epic 3: Local Business Onboarding & Ad Management (MVP Focus)'
description: null
icon: null
createdAt: '2025-07-17T04:39:20.511Z'
creationDate: 2025-07-16 23:39
modificationDate: 2025-07-16 23:39
tags: []
coverImage: null
---

## Epic 3: Local Business Onboarding & Ad Management (MVP Focus)

**Goal**: Provide local businesses with a seamless way to advertise and track their performance, fostering a valuable local ecosystem.

### Story: Business Owner Account Setup

- **As a** Local Business Owner,

- **I want to to** register my business and link it to my user account,

- **So that I can** access the business owner dashboard and manage my advertising.

- **Acceptance Criteria**:

    - Business owners can create a business profile (linked to their `userID`).

    - Business profile includes fields for `businessName`, `category`, `contactEmail`, `address`, `logoURL`.

    - Business owners can edit their business profile.

- **Technical Notes**: `Business` data model in PostgreSQL. Frontend forms for business profile creation/editing.

### Story: Business Owner Dashboard (MVP)

- **As a** Local Business Owner,

- **I want to** view an overview of my advertising activity and performance,

- **So that I can** understand the value Quality Neighbor provides and optimize my strategy.

- **Acceptance Criteria**:

    - The dashboard displays active ad campaigns.

    - It shows core metrics like impressions and clicks (initially, via internal tracking).

    - A simple visual representation of performance trends (e.g., a line graph) is present.

    - Links to billing/payment information are available (placeholder or direct link to payment provider initially).

- **Technical Notes**: Frontend dashboard components. Backend API endpoints to pull ad data.

### Story: Ad Campaign Submission & Agent Support

- **As a** Local Business Owner,

- **I want to** submit my ad creative and copy, and get assistance from the Quality Neighbor agent team,

- **So that my** ads are professionally crafted and effectively reach the community.

- **Acceptance Criteria**:

    - Business owners can upload ad creative (image/text) and submit ad copy via a form.

    - A secure messaging/ticketing system allows direct communication with the assigned Quality Neighbor agent team for strategy and design help.

    - The system tracks the status of ad submissions and communications.

- **Technical Notes**: Backend storage for ad creatives. Messaging system (reusing core messaging component or dedicated ticketing).

### Story: Basic Local Business Directory (Resident Facing)

- **As a** Resident,

- **I want to** discover local businesses featured on Quality Neighbor,

- **So that I can** support my local economy and find services I need.

- **Acceptance Criteria**:

    - A dedicated section lists local businesses.

    - Each business has a basic profile displaying their name, category, and contact info.

    - Filtering by category is available.

- **Technical Notes**: Frontend component for business directory. Backend API for retrieving business data.

