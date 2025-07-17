---
type: Page
title: API Interaction Layer
description: null
icon: null
createdAt: '2025-07-17T06:58:17.393Z'
creationDate: 2025-07-17 01:58
modificationDate: 2025-07-17 01:58
tags: []
coverImage: null
---

### Sharding Front-End Specific Documentation: Frontend API Interaction Layer

**6.** `docs/front-end-api-interaction.md`

# API Interaction Layer

This document describes how the Quality Neighbor frontend communicates with the backend APIs defined in the main Architecture Document (`docs/api-reference.md`). It outlines the structure for API clients, service definitions, and a consistent approach to error handling and retries.

## Client/Service Structure

- **HTTP Client Setup:** An Axios instance will be set up in `src/frontend/services/apiClient.ts`.

    - **MUST include:** Base URL (from environment variable `NEXT_PUBLIC_API_URL` or equivalent), default headers (e.g., `Content-Type: 'application/json'`).

    - **Interceptors:** For automatic authentication token injection (from `sessionSlice.token` in global state management) and standardized error handling/normalization.

- **Service Definitions (Example):** Each backend API domain will have a corresponding frontend service file located in `src/frontend/services/`.

    - `authService.ts` **(in** `src/frontend/services/authService.ts`**):**

        - **Purpose:** Handles all API interactions related to user authentication (login, registration, password reset).

        - **Functions:** Each service function MUST have explicit parameter types, a return type (e.g., `Promise<User>`), JSDoc/TSDoc explaining purpose, params, return value, and any specific error handling.

            - `login(credentials: AuthCredentials): Promise<{ userId: string; token: string; role: string; }>`

            - `register(userData: RegisterData): Promise<{ userId: string; token: string; }>`

    - `listingsService.ts` **(in** `src/frontend/services/listingsService.ts`**):**

        - **Purpose:** Handles all API interactions related to service/tool/skill listings.

        - **Functions:**

            - `fetchListings(filters?: ListingsFilter): Promise<ServiceListing[]>`

            - `createListing(listingData: NewListingData): Promise<{ listingId: string; }>`

    - `businessesService.ts` **(in** `src/frontend/services/businessesService.ts`**):**

        - **Purpose:** Handles all API interactions related to business profiles and ad management.

        - **Functions:**

            - `fetchBusinesses(): Promise<Business[]>`

            - `registerBusiness(businessData: NewBusinessData): Promise<{ businessId: string; }>`

            - `getAdAnalytics(): Promise<AdAnalyticsData>`

    - `messagesService.ts` **(in** `src/frontend/services/messagesService.ts`**):**

        - **Purpose:** Handles API interactions for in-app messaging.

        - **Functions:**

            - `sendMessage(messageData: NewMessageData): Promise<{ messageId: string; }>`

            - `fetchMessages(threadId: string): Promise<Message[]>`

## Error Handling & Retries (Frontend)

- **Global Error Handling:** API errors will be caught globally via an Axios response interceptor in `apiClient.ts`.

    - Errors will be dispatched to a global UI slice (e.g., `uiSlice.actions.showGlobalErrorBanner({ message: error.message })`) for user notification.

    - Detailed errors will be logged to the console/monitoring service.

    - A global error state (e.g., `uiSlice.error`) will manage application-wide error display.

- **Specific Error Handling:** Components MAY handle specific API errors locally for more contextual feedback (e.g., displaying an inline message on a form field: "Invalid email address"). This MUST be documented in the component's specification if it deviates from global handling.

- **Retry Logic:** Client-side retry logic will be implemented using `axios-retry` with `apiClient`.

    - **Configuration:** Max retries (e.g., 3), retry conditions (e.g., network errors, 5xx server errors), retry delay (e.g., exponential backoff).

    - **Mandate:** MUST apply only to idempotent requests (GET, PUT, DELETE).

