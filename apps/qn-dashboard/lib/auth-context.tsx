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
    console.log('Login attempt:', { email, password });
    
    // Check demo users first
    if (email && DEMO_USERS[email as keyof typeof DEMO_USERS]) {
      const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
      console.log('Demo user found:', demoUser);
      setUser(demoUser);
      localStorage.setItem('demo-user', JSON.stringify(demoUser));
      return Promise.resolve(true);
    }
    
    // Check custom users from localStorage
    const customUsers = JSON.parse(localStorage.getItem('custom-users') || '{}');
    if (email && customUsers[email] && customUsers[email].password === password) {
      const customUser = customUsers[email];
      console.log('Custom user found:', customUser);
      setUser(customUser);
      localStorage.setItem('demo-user', JSON.stringify(customUser));
      return Promise.resolve(true);
    }
    
    console.log('No matching user found');
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('demo-user');
  };

  const signup = async (email: string, password: string, userData: any) => {
    console.log('Signup attempt:', { email, userData });
    
    // Check if user already exists
    const customUsers = JSON.parse(localStorage.getItem('custom-users') || '{}');
    if (customUsers[email] || DEMO_USERS[email as keyof typeof DEMO_USERS]) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      name: userData.name || 'New User',
      role: userData.role || 'user',
      password // In real app, this would be hashed
    };
    
    // Save to localStorage
    customUsers[email] = newUser;
    localStorage.setItem('custom-users', JSON.stringify(customUsers));
    
    // Auto-login the new user
    setUser(newUser);
    localStorage.setItem('demo-user', JSON.stringify(newUser));
    
    return Promise.resolve(true);
  };

  return {
    user,
    loading,
    login,
    logout,
    signup,
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
