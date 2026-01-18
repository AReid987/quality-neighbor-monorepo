# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-09-16-basic-resident-user-profiles/spec.md

## Endpoints

### GET /api/v1/users/profile

**Purpose:** Retrieves the profile of the currently authenticated user.
**Parameters:** None
**Response:**
```json
{
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "location": "string",
  "interests": ["string"]
}
```
**Errors:** 401 Unauthorized

### PUT /api/v1/users/profile

**Purpose:** Updates the profile of the currently authenticated user.
**Parameters:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "location": "string",
  "interests": ["string"]
}
```
**Response:** 204 No Content
**Errors:** 400 Bad Request, 401 Unauthorized
