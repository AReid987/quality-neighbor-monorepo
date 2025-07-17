---
type: Page
title: Data Models
description: null
icon: null
createdAt: '2025-07-17T06:01:20.884Z'
creationDate: 2025-07-17 01:01
modificationDate: 2025-07-17 01:39
tags: []
coverImage: null
---

**2.** `docs/data-models.md`

# Data Models

### Core Application Entities / Domain Objects

#### User

- **Description:** Represents a registered user of the Quality Neighbor platform, including Residents, Business Owners, and Internal Team members.

- **Schema / Interface Definition:**

    TypeScript

    ```typescript
    export interface User {
      userID: string; // Unique identifier (PK)
      email: string; // User's email address
      passwordHash: string; // Hashed password for security
      firstName: string;
      lastName: string;
      location: string; // e.g., ZIP code or neighborhood
      interests: string[]; // Array of interests (e.g., "Gardening", "Childcare")
      role: "Resident" | "BusinessOwner" | "Internal"; // User's role on the platform
      isVerified: boolean; // Indicates if identity verification is complete
      createdAt: string; // Timestamp of user creation
      updatedAt: string; // Timestamp of last update
    }
    ```

- **Validation Rules:** Email format, password complexity (min length, special chars), unique email, valid location format. `role` must be one of the predefined enums.

#### Business

- **Description:** Represents a local business registered on Quality Neighbor for advertising and community interaction.

- **Schema / Interface Definition:**

    TypeScript

    ```typescript
    export interface Business {
      businessID: string; // Unique identifier (PK)
      userID: string; // Foreign key to the User who owns this business profile
      businessName: string; // Name of the business
      contactEmail: string; // Business contact email
      contactPhone: string; // Business contact phone
      address: string; // Physical address of the business
      category: string; // Business category (e.g., "Bakery", "Plumber")
      description: string; // Short description of the business
      logoURL: string; // URL to the business logo
      adPackageTier: string; // e.g., "Bronze", "Silver", "Gold"
      createdAt: string; // Timestamp of business registration
      updatedAt: string; // Timestamp of last update
    }
    ```

- **Validation Rules:** Unique `businessName`, valid email/phone formats, valid `adPackageTier` (enum).

#### Advertisement

- **Description:** Represents an advertising campaign created by a `Business`.

- **Schema / Interface Definition:**

    TypeScript

    ```typescript
    export interface Advertisement {
      adID: string; // Unique identifier (PK)
      businessID: string; // Foreign key to the associated Business
      campaignName: string; // Name of the advertising campaign
      adCreativeURL: string; // URL to the ad's image/video creative
      adCopy: string; // The text content of the advertisement
      status: "Active" | "Paused" | "Pending Review" | "Completed"; // Current status of the ad
      startDate: string; // Date when the ad campaign starts
      endDate: string; // Date when the ad campaign ends
      impressions: number; // Number of times the ad was displayed
      clicks: number; // Number of clicks on the ad
      conversions: number; // Number of conversions attributed to the ad
      createdAt: string; // Timestamp of ad creation
      updatedAt: string; // Timestamp of last update
    }
    ```

- **Validation Rules:** `startDate` must be before `endDate`. Impressions, clicks, conversions must be non-negative.

#### ServiceListing (Resident-to-Resident)

- **Description:** Represents an offer or request for a service, tool, or skill exchange between residents.

- **Schema / Interface Definition:**

    TypeScript

    ```typescript
    export interface ServiceListing {
      listingID: string; // Unique identifier (PK)
      posterUserID: string; // Foreign key to the User who created the listing
      type: "Offer" | "Request"; // Whether it's an offer or a request
      category: string; // Category of the listing (e.g., "Gardening", "Tools", "Childcare")
      title: string; // Title of the listing
      description: string; // Detailed description
      location: string; // Specific location for the exchange (e.g., "Hartland Ranch")
      status: "Available" | "Fulfilled" | "Cancelled"; // Current status of the listing
      exchangeMechanism: "Free" | "Barter" | "TimeBank Credits"; // How the exchange is compensated
      createdAt: string; // Timestamp of listing creation
      updatedAt: string; // Timestamp of last update
    }
    ```

- **Validation Rules:** `type` and `status` must be valid enums. `category` from predefined list.

#### CheckinRequest

- **Description:** Facilitates neighbor-to-neighbor wellness checks.

- **Schema / Interface Definition:**

    TypeScript

    ```typescript
    export interface CheckinRequest {
      checkinID: string; // Unique identifier (PK)
      requesterUserID: string; // User initiating the check-in request
      targetUserID: string; // User who is being checked on
      status: "Pending" | "Completed" | "Cancelled"; // Status of the check-in
      scheduledTime: string; // ISO 8601 timestamp for scheduled check-in
      notes: string; // Any specific notes for the check-in
      createdAt: string; // Timestamp of request creation
      updatedAt: string; // Timestamp of last update
    }
    ```

- **Validation Rules:** `status` must be valid enum. `scheduledTime` must be a future date.

#### Neighborhood

- **Description:** Defines a specific geographical neighborhood managed by Quality Neighbor.

- **Schema / Interface Definition:**

    TypeScript

    ```typescript
    export interface Neighborhood {
      neighborhoodID: string; // Unique identifier (PK)
      name: string; // Name of the neighborhood (e.g., "Hartland Ranch")
      zipCode: string; // Associated ZIP code
      city: string; // City of the neighborhood
      state: string; // State of the neighborhood
      description: string; // Description of the neighborhood
      isActive: boolean; // Indicates if the neighborhood is currently active on the platform
    }
    ```

- **Validation Rules:** Unique `name` within `city/state`. Valid `zipCode` format.

#### NewsletterIssue

- **Description:** Represents a published or in-draft newsletter issue for a specific neighborhood.

- **Schema / Interface Definition:**

    TypeScript

    ```typescript
    export interface NewsletterIssue {
      issueID: string; // Unique identifier (PK)
      neighborhoodID: string; // Foreign key to the associated Neighborhood
      issueDate: string; // Date the newsletter is/was published
      contentHTML: string; // HTML content of the newsletter
      status: "Draft" | "Published" | "Archived"; // Status of the issue
      createdByUserID: string; // User ID of the internal team member who created it
      deploymentMetrics: { // Metrics related to email delivery
        totalSent: number;
        openRate: number;
        clickThroughRate: number;
      };
      createdAt: string;
      updatedAt: string;
    }
    ```

- **Validation Rules:** `status` must be valid enum. `issueDate` must be a valid date.

#### InternalTeamUser

- **Description:** Represents an internal Quality Neighbor team member with specific roles and permissions.

- **Schema / Interface Definition:**

    TypeScript

    ```typescript
    export interface InternalTeamUser {
      internalUserID: string; // Unique identifier (PK)
      email: string; // Team member's email
      passwordHash: string; // Hashed password
      role: "Admin" | "Manager" | "Agent"; // Role within the internal team
      firstName: string;
      lastName: string;
      createdAt: string;
      updatedAt: string;
    }
    ```

- **Validation Rules:** Unique email. `role` must be one of predefined enums.

