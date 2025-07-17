// Export client-side items (safe for browser)
export {
  UserRole,
  ProjectNamespace,
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
} from "./client";

// Export server-side items (Node.js only)
export {
  Auth0Management,
  auth0Management,
  auth0ServerConfig,
  auth0NextConfig,
  requireRole,
  requireProject,
  createOrUpdateUser,
  getUserFromSession,
  validateUserRole,
  validateUserProject,
} from "./server";

// Export defaults
export { default as client } from "./client";
export { default as server } from "./server";

// Export types for convenience
export type { QNUser } from "./client";
