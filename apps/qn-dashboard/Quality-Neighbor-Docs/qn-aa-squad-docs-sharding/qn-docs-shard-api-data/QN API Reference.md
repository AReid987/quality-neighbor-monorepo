---
type: Page
title: 'QN: API Reference'
description: null
icon: null
createdAt: '2025-07-17T05:56:12.570Z'
creationDate: 2025-07-17 00:56
modificationDate: 2025-07-17 01:39
tags: []
coverImage: null
---

# API Reference

### External APIs Consumed

#### Stripe Identity API

- **Purpose:** Integrates for robust ID verification processes, crucial for trust and safety in service exchange features.

- **Base URL(s):** To be defined upon integration, based on Stripe's official documentation.

- **Authentication:** API Key (server-side, secret).

- **Key Endpoints Used:**

    - `POST /v1/identity/verifications`**:**

        - Description: Initiates an identity verification session.

        - Request Parameters: N/A

        - Request Body Schema:

            JSON

            ```text
            {
              "customer": "cus_xyz",
              "type": "document"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Example Request: (Example will be provided by developer post-integration)

        - Success Response Schema (Code: `200 OK`): (Schema will be provided by developer post-integration)

        - Error Response Schema(s) (Codes: `4xx`, `5xx`): (Schema will be provided by developer post-integration)

        - Example Response: (Example will be provided by developer post-integration)

- **Rate Limits:** To be confirmed with Stripe documentation.

- **Link to Official Docs:** `https://stripe.com/docs/identity/api`

#### Email Service Provider (e.g., SendGrid)

- **Purpose:** Manages transactional emails (e.g., password resets, notifications) and bulk emails (e.g., the monthly newsletter).

- **Base URL(s):** To be defined upon integration, based on chosen provider's official documentation.

- **Authentication:** API Key.

- **Key Endpoints Used:**

    - `POST /v3/mail/send` **(SendGrid example):**

        - Description: Sends an email.

        - Request Parameters: N/A

        - Request Body Schema: (Schema will be provided by developer post-integration)

        - Example Request: (Example will be provided by developer post-integration)

        - Success Response Schema (Code: `202 Accepted`): (Schema will be provided by developer post-integration)

        - Error Response Schema(s) (Codes: `4xx`, `5xx`): (Schema will be provided by developer post-integration)

        - Example Response: (Example will be provided by developer post-integration)

- **Rate Limits:** To be confirmed with provider documentation.

- **Link to Official Docs:** (Link will be provided by developer post-integration, e.g., `https://sendgrid.com/docs/api-reference/`)

#### Google Maps API (Future)

- **Purpose:** Will be integrated for features like the tool/library map.

- **Base URL(s):** `https://maps.googleapis.com/maps/api/`

- **Authentication:** API Key (client-side for JS SDK, server-side for certain services).

- **Key Endpoints Used:** (To be defined when feature is prioritized)

- **Rate Limits:** To be confirmed with Google Maps documentation.

- **Link to Official Docs:** `https://developers.google.com/maps/documentation`

### Internal APIs Provided

#### Quality Neighbor Backend API

- **Purpose:** Provides all core application logic and data services to the Quality Neighbor frontend applications and internal tools.

- **Base URL(s):** `/api/v1/`

- **Authentication/Authorization:** OAuth 2.0 / JWT for token-based authentication. Role-based access control (RBAC) enforced by middleware/guards.

- **Endpoints:** (Examples for core MVP features)

    - `POST /api/v1/auth/register`**:**

        - Description: Registers a new user.

        - Request Body Schema:

            JSON

            ```text
            {
              "email": "string",
              "password": "string",
              "firstName": "string",
              "lastName": "string",
              "role": "Resident" | "BusinessOwner"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Success Response Schema (Code: `201 Created`):

            JSON

            ```text
            {
              "message": "User registered successfully",
              "userId": "string",
              "token": "string"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Error Response Schema(s) (Codes: `400 Bad Request`, `409 Conflict`): (Generic error schema: `{"message": "string"}`)

    - `POST /api/v1/auth/login`**:**

        - Description: Authenticates a user and returns a JWT.

        - Request Body Schema:

            JSON

            ```text
            {
              "email": "string",
              "password": "string"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Success Response Schema (Code: `200 OK`):

            JSON

            ```text
            {
              "userId": "string",
              "token": "string",
              "role": "string"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Error Response Schema(s) (Codes: `401 Unauthorized`): (Generic error schema: `{"message": "string"}`)

    - `GET /api/v1/users/:userId/profile`**:**

        - Description: Retrieves a user's profile.

        - Request Parameters: `userId` (path parameter, string)

        - Success Response Schema (Code: `200 OK`):

            JSON

            ```text
            {
              "userId": "string",
              "firstName": "string",
              "lastName": "string",
              "location": "string",
              "interests": ["string"],
              "isVerified": "boolean"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Error Response Schema(s) (Codes: `404 Not Found`, `401 Unauthorized`): (Generic error schema: `{"message": "string"}`)

    - `POST /api/v1/listings`**:**

        - Description: Creates a new service/tool/skill listing.

        - Authentication/Authorization: Requires `Resident` role and `isVerified: true` (for offers).

        - Request Body Schema:

            JSON

            ```text
            {
              "type": "Offer" | "Request",
              "category": "string",
              "title": "string",
              "description": "string",
              "location": "string"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Success Response Schema (Code: `201 Created`):

            JSON

            ```text
            {
              "listingId": "string",
              "message": "Listing created successfully"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Error Response Schema(s) (Codes: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`): (Generic error schema: `{"message": "string"}`)

    - `GET /api/v1/listings`**:**

        - Description: Retrieves a list of listings with optional filters.

        - Request Parameters: `type` (query param, optional), `category` (query param, optional), `keyword` (query param, optional)

        - Success Response Schema (Code: `200 OK`):

            JSON

            ```text
            [
              {
                "listingId": "string",
                "posterUserId": "string",
                "type": "Offer" | "Request",
                "category": "string",
                "title": "string",
                "description": "string",
                "location": "string",
                "status": "string",
                "createdAt": "string"
              }
            ]
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Error Response Schema(s) (Codes: `500 Internal Server Error`): (Generic error schema: `{"message": "string"}`)

    - `POST /api/v1/messages`**:**

        - Description: Sends a new message in an exchange thread.

        - Authentication/Authorization: Requires authentication.

        - Request Body Schema:

            JSON

            ```text
            {
              "threadId": "string",
              "recipientId": "string",
              "content": "string"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Success Response Schema (Code: `201 Created`):

            JSON

            ```text
            {
              "messageId": "string",
              "message": "Message sent"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Error Response Schema(s) (Codes: `400 Bad Request`, `401 Unauthorized`): (Generic error schema: `{"message": "string"}`)

    - `GET /api/v1/businesses`**:**

        - Description: Retrieves a list of registered businesses.

        - Success Response Schema (Code: `200 OK`):

            JSON

            ```text
            [
              {
                "businessId": "string",
                "name": "string",
                "category": "string",
                "contactEmail": "string",
                "address": "string",
                "logoUrl": "string"
              }
            ]
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Error Response Schema(s) (Codes: `500 Internal Server Error`): (Generic error schema: `{"message": "string"}`)

    - `POST /api/v1/businesses/register`**:**

        - Description: Registers a new business profile.

        - Authentication/Authorization: Requires `BusinessOwner` role.

        - Request Body Schema:

            JSON

            ```text
            {
              "businessName": "string",
              "category": "string",
              "contactEmail": "string",
              "contactPhone": "string",
              "address": "string"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Success Response Schema (Code: `201 Created`):

            JSON

            ```text
            {
              "businessId": "string",
              "message": "Business registered successfully"
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Error Response Schema(s) (Codes: `400 Bad Request`, `401 Unauthorized`, `409 Conflict`): (Generic error schema: `{"message": "string"}`)

    - `GET /api/v1/businesses/dashboard/analytics`**:**

        - Description: Retrieves ad performance analytics for a business owner.

        - Authentication/Authorization: Requires `BusinessOwner` role.

        - Success Response Schema (Code: `200 OK`):

            JSON

            ```text
            {
              "impressions": "number",
              "clicks": "number",
              "leads": "number",
              "conversions": "number",
              "campaigns": [
                {
                  "campaignId": "string",
                  "name": "string",
                  "impressions": "number",
                  "clicks": "number"
                }
              ]
            }
            ```

            [https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png](https://storage.googleapis.com/pieces-web-extensions-cdn/pieces.png)Copy And Save[https://storage.googleapis.com/pieces-web-extensions-cdn/link.png](https://storage.googleapis.com/pieces-web-extensions-cdn/link.png)Share[https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png](https://storage.googleapis.com/pieces-web-extensions-cdn/copilot.png)Ask Copilot[https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png](https://storage.googleapis.com/pieces-web-extensions-cdn/settings.png)

        - Error Response Schema(s) (Codes: `401 Unauthorized`, `403 Forbidden`): (Generic error schema: `{"message": "string"}`)

