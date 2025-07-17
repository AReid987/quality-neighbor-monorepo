'use client'

import { User } from '@auth0/auth0-react'

// Client-safe Auth0 configuration
export const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN || process.env.AUTH0_DOMAIN,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID,
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || process.env.AUTH0_AUDIENCE,
  scope: 'openid profile email',
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : undefined,
}

// Role-based access control
export enum UserRole {
  QN_RESIDENT = 'qn:resident',
  QN_BUSINESS_OWNER = 'qn:business_owner',
  QN_INTERNAL_ADMIN = 'qn:internal_admin',
  QN_INTERNAL_MANAGER = 'qn:internal_manager',
  QN_INTERNAL_AGENT = 'qn:internal_agent',
  RLTR_AGENT = 'rltr:agent',
  RLTR_ADMIN = 'rltr:admin',
  SUPER_ADMIN = 'super:admin',
}

// Project namespaces
export enum ProjectNamespace {
  QN = 'qn',
  RLTR_MKTG = 'rltr_mktg',
}

// Custom user type that extends Auth0 user with our app metadata
export interface QNUser extends User {
  sub: string
  email: string
  name?: string
  nickname?: string
  picture?: string
  given_name?: string
  family_name?: string
  // Custom app metadata
  app_metadata?: {
    qn_user_id?: string
    rltr_agent_id?: string
    roles?: string[]
    projects?: string[]
    created_at?: string
    last_login?: string
  }
  user_metadata?: {
    preferences?: Record<string, any>
    onboarding_completed?: boolean
  }
}

// Client-safe utility functions
export function hasRole(user: QNUser, role: UserRole): boolean {
  return user.app_metadata?.roles?.includes(role) || false
}

export function hasProjectAccess(user: QNUser, project: ProjectNamespace): boolean {
  return user.app_metadata?.projects?.includes(project) || false
}

export function isQNUser(user: QNUser): boolean {
  return hasProjectAccess(user, ProjectNamespace.QN)
}

export function isRLTRUser(user: QNUser): boolean {
  return hasProjectAccess(user, ProjectNamespace.RLTR_MKTG)
}

export function isSuperAdmin(user: QNUser): boolean {
  return hasRole(user, UserRole.SUPER_ADMIN)
}

// Client-safe user metadata helpers
export function getUserDisplayName(user: QNUser): string {
  return user.name ||
         user.nickname ||
         `${user.given_name || ''} ${user.family_name || ''}`.trim() ||
         user.email ||
         'Unknown User'
}

export function getUserInitials(user: QNUser): string {
  const name = getUserDisplayName(user)
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}

export function getUserDefaultProject(user: QNUser): ProjectNamespace {
  const projects = user.app_metadata?.projects || []
  return projects.length > 0 ? projects[0] as ProjectNamespace : ProjectNamespace.QN
}

export function canAccessProject(user: QNUser, project: ProjectNamespace): boolean {
  return hasProjectAccess(user, project) || isSuperAdmin(user)
}

export function canAccessRole(user: QNUser, role: UserRole): boolean {
  return hasRole(user, role) || isSuperAdmin(user)
}

// Auth0 configuration for Next.js client
export const auth0ClientConfig = {
  domain: auth0Config.domain!,
  clientId: auth0Config.clientId!,
  audience: auth0Config.audience,
  scope: auth0Config.scope,
  redirectUri: auth0Config.redirectUri,
  cacheLocation: 'localstorage' as const,
  useRefreshTokens: true,
  useRefreshTokensFallback: false,
}

// Default export for easier imports
export default {
  auth0Config,
  auth0ClientConfig,
  hasRole,
  hasProjectAccess,
  isQNUser,
  isRLTRUser,
  isSuperAdmin,
  getUserDisplayName,
  getUserInitials,
  getUserDefaultProject,
  canAccessProject,
  canAccessRole,
  UserRole,
  ProjectNamespace,
}
