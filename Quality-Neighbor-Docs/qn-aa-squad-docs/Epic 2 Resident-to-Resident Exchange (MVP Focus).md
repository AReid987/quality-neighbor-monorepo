---
type: Page
title: 'Epic 2: Resident-to-Resident Exchange (MVP Focus)'
description: null
icon: null
createdAt: '2025-07-17T04:38:40.351Z'
creationDate: 2025-07-16 23:38
modificationDate: 2025-07-16 23:38
tags: []
coverImage: null
---

## Epic 2: Resident-to-Resident Exchange (MVP Focus)

**Goal**: Enable core community interactions by facilitating the exchange of services, tools, and skills among residents.

### Story: Service/Tool/Skill Listing Creation

- **As a** Resident,

- **I want to** offer a service/tool/skill or request help,

- **So that I can** connect with neighbors for mutual aid and exchange.

- **Acceptance Criteria**:

    - Users can create a new listing (offer or request).

    - Listings include a title, description, category (e.g., "Gardening," "Tools," "Childcare"), and location.

    - Users can specify the type of exchange (e.g., "for free," "barter," "Time Bank credits" - for future Time Bank integration).

- **Technical Notes**: New data model for `ServiceListing` in PostgreSQL. Frontend form for listing creation.

### Story: Browse & Discover Listings

- **As a** Resident,

- **I want to** search and filter available service/tool/skill listings,

- **So that I can** easily find what I need or see what's offered in my neighborhood.

- **Acceptance Criteria**:

    - Users can view a list of active listings.

    - Users can filter listings by category and type (offer/request).

    - Users can search listings by keywords.

    - Listings are displayed with relevant details (title, description, poster, location).

- **Technical Notes**: Backend API endpoint for querying listings. Frontend display component with search/filter UI.

### Story: Secure In-App Messaging for Exchange

- **As a** Resident,

- **I want to** send a private message to another resident about a listing,

- **So that I can** coordinate details for a service/tool/skill exchange securely within the platform.

- **Acceptance Criteria**:

    - Users can initiate a private message thread from a listing page.

    - Users can send and receive messages within the thread.

    - Message history is persistent.

- **Technical Notes**: Implement WebSockets for real-time messaging. Store message data in PostgreSQL.

### Story: Trust-Building Identity Verification (MVP)

- **As Quality Neighbor**,

- **We want to** verify the identity of users offering services,

- **So that we can** build a trusted community and enhance safety for all residents.

- **Acceptance Criteria**:

    - A clear workflow for users to initiate ID verification is provided.

    - Integration with Stripe Identity (or similar) is functional for document and selfie verification.

    - Verified users receive a visual "verified" badge on their profile/listings.

    - Users requiring verification for certain actions are prompted appropriately.

- **Technical Notes**: Backend integration with Stripe Identity API. Frontend UI for verification flow. Update `User` data model with verification status.

