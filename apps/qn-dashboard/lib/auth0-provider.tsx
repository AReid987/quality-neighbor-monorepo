"use client";

import { UserProvider } from "@auth0/nextjs-auth0/client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  QNUser,
  ProjectNamespace,
  UserRole,
  hasRole,
  hasProjectAccess,
  isQNUser,
  isRLTRUser,
} from "@qn/auth";

// Extended context for our dashboard
interface DashboardAuthContextType {
  user: QNUser | null;
  isLoading: boolean;
  error?: Error;
  // Project namespace management
  currentProject: ProjectNamespace;
  setCurrentProject: (project: ProjectNamespace) => void;
  availableProjects: ProjectNamespace[];
  // Role and permission helpers
  hasRole: (role: UserRole) => boolean;
  hasProjectAccess: (project: ProjectNamespace) => boolean;
  isQNUser: boolean;
  isRLTRUser: boolean;
  // Auth actions
  login: (returnTo?: string) => void;
  logout: () => void;
  // User metadata
  updateUserMetadata: (metadata: Record<string, any>) => Promise<void>;
}

const DashboardAuthContext = createContext<
  DashboardAuthContextType | undefined
>(undefined);

interface DashboardAuthProviderProps {
  children: ReactNode;
}

function DashboardAuthContextProvider({
  children,
}: DashboardAuthProviderProps) {
  const { user, error, isLoading } = useUser();
  const [currentProject, setCurrentProject] = useState<ProjectNamespace>(
    ProjectNamespace.QN,
  );
  const [availableProjects, setAvailableProjects] = useState<
    ProjectNamespace[]
  >([]);

  const qnUser = user as QNUser | null;

  // Determine available projects based on user roles/metadata
  useEffect(() => {
    if (qnUser?.app_metadata?.projects) {
      const projects = qnUser.app_metadata.projects as ProjectNamespace[];
      setAvailableProjects(projects);

      // Set default project if current project is not available
      if (!projects.includes(currentProject)) {
        setCurrentProject(projects[0] || ProjectNamespace.QN);
      }
    } else {
      // Default to QN if no projects defined
      setAvailableProjects([ProjectNamespace.QN]);
      setCurrentProject(ProjectNamespace.QN);
    }
  }, [qnUser, currentProject]);

  // Helper functions
  const hasRoleHelper = (role: UserRole): boolean => {
    if (!qnUser) return false;
    return hasRole(qnUser, role);
  };

  const hasProjectAccessHelper = (project: ProjectNamespace): boolean => {
    if (!qnUser) return false;
    return hasProjectAccess(qnUser, project);
  };

  const login = (returnTo?: string) => {
    const baseUrl = window.location.origin;
    const loginUrl = `/api/auth/login${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
    window.location.href = loginUrl;
  };

  const logout = () => {
    window.location.href = "/api/auth/logout";
  };

  const updateUserMetadata = async (metadata: Record<string, any>) => {
    if (!qnUser) throw new Error("User not authenticated");

    try {
      const response = await fetch("/api/auth/user/metadata", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        throw new Error("Failed to update user metadata");
      }

      // Refresh the user session
      window.location.reload();
    } catch (error) {
      console.error("Error updating user metadata:", error);
      throw error;
    }
  };

  const contextValue: DashboardAuthContextType = {
    user: qnUser,
    isLoading,
    error,
    currentProject,
    setCurrentProject,
    availableProjects,
    hasRole: hasRoleHelper,
    hasProjectAccess: hasProjectAccessHelper,
    isQNUser: qnUser ? isQNUser(qnUser) : false,
    isRLTRUser: qnUser ? isRLTRUser(qnUser) : false,
    login,
    logout,
    updateUserMetadata,
  };

  return (
    <DashboardAuthContext.Provider value={contextValue}>
      {children}
    </DashboardAuthContext.Provider>
  );
}

// Auth0 configuration for the dashboard
const auth0Config = {
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  audience: process.env.AUTH0_AUDIENCE,
  scope: "openid profile email",
  redirectUri:
    typeof window !== "undefined"
      ? `${window.location.origin}/api/auth/callback`
      : undefined,
};

// Main provider component
export function DashboardAuthProvider({
  children,
}: DashboardAuthProviderProps) {
  return (
    <UserProvider loginUrl="/api/auth/login" profileUrl="/api/auth/me">
      <DashboardAuthContextProvider>{children}</DashboardAuthContextProvider>
    </UserProvider>
  );
}

// Hook to use the dashboard auth context
export function useDashboardAuth() {
  const context = useContext(DashboardAuthContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardAuth must be used within a DashboardAuthProvider",
    );
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<T extends {}>(
  Component: React.ComponentType<T>,
  requiredRole?: UserRole,
) {
  return function AuthenticatedComponent(props: T) {
    const { user, isLoading, hasRole, login } = useDashboardAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">
              Please log in to access this page.
            </p>
            <button
              type="button"
              onClick={() => login()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Log In
            </button>
          </div>
        </div>
      );
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don&apos;t have permission to access this page.
            </p>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

// Project namespace guard component
interface ProjectGuardProps {
  children: ReactNode;
  requiredProject: ProjectNamespace;
  fallback?: ReactNode;
}

export function ProjectGuard({
  children,
  requiredProject,
  fallback,
}: ProjectGuardProps) {
  const { hasProjectAccess } = useDashboardAuth();

  if (!hasProjectAccess(requiredProject)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Access Required</h1>
            <p className="text-gray-600 mb-6">
              You need access to the {requiredProject} project to view this
              content.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}

// Role guard component
interface RoleGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
  fallback?: ReactNode;
}

export function RoleGuard({
  children,
  requiredRole,
  fallback,
}: RoleGuardProps) {
  const { hasRole } = useDashboardAuth();

  if (!hasRole(requiredRole)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Role Required</h1>
            <p className="text-gray-600 mb-6">
              You need the {requiredRole} role to access this content.
            </p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
