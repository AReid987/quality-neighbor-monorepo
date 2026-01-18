# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-09-16-basic-resident-user-profiles/spec.md

## Technical Requirements

- A new page will be created at `/profile` that will be accessible to authenticated users.
- The page will display the user's profile information: first name, last name, email, and location.
- An "Edit Profile" button on the profile page will open a modal with a form to edit the profile information.
- The form will have fields for first name, last name, location, and a multi-select for interests.
- The interests will be a predefined list of strings.
- Submitting the form will update the user's profile information in the database.
- The profile page will be updated with the new information after the form is submitted.

## External Dependencies

- None
