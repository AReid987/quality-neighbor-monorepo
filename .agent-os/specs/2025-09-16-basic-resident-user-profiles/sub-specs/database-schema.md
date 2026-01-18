# Database Schema

This is the database schema implementation for the spec detailed in @.agent-os/specs/2025-09-16-basic-resident-user-profiles/spec.md

## Changes

- No new tables will be created.
- The `qn_users` table will be used to store the user's profile information.
- The `first_name`, `last_name`, `email`, `location`, and `interests` columns will be used.

## Specifications

- No changes to the database schema are required.

## Rationale

The existing `qn_users` table already has all the necessary columns to store the basic user profile information.
