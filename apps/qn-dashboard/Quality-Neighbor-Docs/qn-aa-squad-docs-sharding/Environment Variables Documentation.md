---
type: Page
title: Environment Variables Documentation
description: null
icon: null
createdAt: '2025-07-17T06:03:05.242Z'
creationDate: 2025-07-17 01:03
modificationDate: 2025-07-17 01:39
tags: []
coverImage: null
---

**3.** `docs/environment-vars.md`

# Environment Variables Documentation

This document outlines the essential environment variables required for configuring and deploying the Quality Neighbor application across different environments (development, staging, production). Specific variable names will be defined during implementation, but the categories and purpose are detailed below.

## Purpose

Environment variables are used to manage sensitive information (like API keys and database credentials) and configuration settings that vary between deployment environments, without hardcoding them into the codebase. This ensures security, flexibility, and adherence to the 12-factor app principles.

## General Principles

- **Never Hardcode Secrets**: All API keys, database credentials, and other sensitive information must be stored as environment variables and never committed to source control.

- **Access via Configuration Module**: In code, access secrets and configuration values only through a designated configuration module or service.

- **Least Privilege**: Database connection users, IAM roles for cloud services, and other credentials will have only the necessary permissions.

- **Validation**: Values should be validated at application startup to ensure all required variables are present and correctly formatted.

## Key Environment Variables Categories

### 1. Application Configuration

- **Purpose**: General application settings.

- **Examples**:

    - `PORT`: The port on which the application server listens.

    - `NODE_ENV` / `APP_ENV`: Specifies the current environment (e.g., `development`, `staging`, `production`).

    - `LOG_LEVEL`: Configures the minimum logging level (e.g., `DEBUG`, `INFO`, `WARN`, `ERROR`).

    - `JWT_SECRET`: Secret key for signing and verifying JSON Web Tokens (JWTs).

### 2. Database Configuration

- **Purpose**: Connection details for the PostgreSQL database and Redis cache.

- **Examples**:

    - `POSTGRES_HOST`: PostgreSQL database host.

    - `POSTGRES_PORT`: PostgreSQL database port.

    - `POSTGRES_USER`: PostgreSQL database username.

    - `POSTGRES_PASSWORD`: PostgreSQL database password.

    - `POSTGRES_DB`: PostgreSQL database name.

    - `REDIS_HOST`: Redis cache host.

    - `REDIS_PORT`: Redis cache port.

    - `REDIS_PASSWORD`: Redis cache password (if applicable).

### 3. External Service API Keys & Credentials

- **Purpose**: Authentication for third-party services.

- **Examples**:

    - `STRIPE_IDENTITY_API_KEY`: API key for Stripe Identity integration.

    - `EMAIL_SERVICE_API_KEY`: API key for the chosen Email Service Provider (e.g., SendGrid).

    - `Maps_API_KEY`: API key for Google Maps integration (future feature).

    - `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`: AWS credentials if not using IAM roles directly (less preferred for production).

### 4. Frontend-Specific Configuration

- **Purpose**: Publicly accessible variables for the frontend application.

- **Examples**:

    - `NEXT_PUBLIC_API_URL`: Base URL for the Quality Neighbor Backend API. This variable would be prefixed with `NEXT_PUBLIC_` if using Next.js, making it available in the browser.

    - `NEXT_PUBLIC_Maps_CLIENT_ID`: Client-side Google Maps API key (if different from backend key).

### 5. Deployment & Infrastructure Configuration

- **Purpose**: Settings relevant to CI/CD and cloud resource management.

- **Examples**:

    - `CI_CD_DEPLOY_TOKEN`: Token for automated deployments from the CI/CD pipeline.

    - `CLOUD_REGION`: AWS/GCP region where resources are deployed.

    - `S3_BUCKET_NAME`: Name of S3 bucket for static assets or file storage (if applicable).

## Management

- **Development**: `.env` files (not committed to version control) are recommended for local development.

- **Staging/Production**: Variables will be securely managed by the chosen cloud provider's secret management services (e.g., AWS Secrets Manager, GCP Secret Manager) and injected into the application environment during deployment via CI/CD pipelines.

