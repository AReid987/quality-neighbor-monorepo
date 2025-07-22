"use client";

import { DashboardAuthProvider, useDashboardAuth } from "./auth0-provider";
import { ReactNode, useState, useEffect } from "react";
import { UserRole } from "@qn/auth";

// Re-export the Auth0 provider as AuthProvider for compatibility
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return <DashboardAuthProvider>{children}</DashboardAuthProvider>;
};

// Demo users for testing
const DEMO_USERS = {
  'admin@qualityneighbor.com': {
    id: 'demo-admin-1',
    name: 'Admin User',
    email: 'admin@qualityneighbor.com',
    role: 'admin' as const,
  },
  'user@example.com': {
    id: 'demo-user-1', 
    name: 'Demo User',
    email: 'user@example.com',
    role: 'user' as const,
  },
};

// Simple demo auth hook for development
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user
    const storedUser = localStorage.getItem('demo-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email?: string, password?: string) => {
    // Demo login logic
    if (email && DEMO_USERS[email as keyof typeof DEMO_USERS]) {
      const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
      setUser(demoUser);
      localStorage.setItem('demo-user', JSON.stringify(demoUser));
      return Promise.resolve(true);
    }
    
    // If Auth0 is not configured, use demo user
    const defaultUser = DEMO_USERS['user@example.com'];
    setUser(defaultUser);
    localStorage.setItem('demo-user', JSON.stringify(defaultUser));
    return Promise.resolve(true);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo-user');
  };

  return {
    user,
    loading,
    login,
    logout,
    // Mock additional properties for compatibility
    currentProject: 'qn',
    setCurrentProject: () => {},
    availableProjects: ['qn'],
    hasRole: (role: string) => user?.role === role,
    hasProjectAccess: () => true,
    isQNUser: true,
    isRLTRUser: false,
    updateUserMetadata: () => Promise.resolve(),
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
