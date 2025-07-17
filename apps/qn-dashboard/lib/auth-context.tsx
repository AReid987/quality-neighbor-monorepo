"use client";

import { DashboardAuthProvider, useDashboardAuth } from "./auth0-provider";
import { ReactNode } from "react";
import { UserRole } from "@qn/auth";

// Re-export the Auth0 provider as AuthProvider for compatibility
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <DashboardAuthProvider>{children}</DashboardAuthProvider>;
};

// Re-export the hook as useAuth for compatibility with existing code
export const useAuth = () => {
  const auth = useDashboardAuth();

  // Transform the Auth0 user format to match the expected interface
  return {
    user: auth.user
      ? {
          id: auth.user.sub,
          name:
            auth.user.name ||
            auth.user.nickname ||
            `${auth.user.given_name || ""} ${auth.user.family_name || ""}`.trim(),
          role: auth.hasRole(UserRole.SUPER_ADMIN)
            ? ("admin" as const)
            : ("user" as const),
          // Include additional Auth0 user properties
          ...auth.user,
        }
      : null,
    loading: auth.isLoading,
    login: () => {
      // Auth0 login doesn't use email/password directly
      // Instead, redirect to Auth0 login page
      auth.login();
      return Promise.resolve(true);
    },
    logout: auth.logout,
    // Additional Auth0 specific properties
    currentProject: auth.currentProject,
    setCurrentProject: auth.setCurrentProject,
    availableProjects: auth.availableProjects,
    hasRole: auth.hasRole,
    hasProjectAccess: auth.hasProjectAccess,
    isQNUser: auth.isQNUser,
    isRLTRUser: auth.isRLTRUser,
    updateUserMetadata: auth.updateUserMetadata,
  };
};

// Export additional Auth0 components that might be needed
export {
  withAuth,
  ProjectGuard,
  RoleGuard,
  useDashboardAuth,
} from "./auth0-provider";

// Export Auth0 types and enums
export { UserRole, ProjectNamespace } from "@qn/auth";
