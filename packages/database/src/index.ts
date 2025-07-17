// Re-export everything from client
export * from "./client";

// Re-export the main client as default
export { supabase as default } from "./client";

// Re-export specific items for convenience
export { supabase, createServiceRoleClient } from "./client";

// Export types if we had any specific database types
export type { Database, Tables, Enums } from "./client";
