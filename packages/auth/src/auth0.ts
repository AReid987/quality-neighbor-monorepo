// Shared Auth0 configuration constants and types

// Auth0 domain configuration
export const AUTH0_DOMAIN =
  process.env.NEXT_PUBLIC_AUTH0_DOMAIN || process.env.AUTH0_DOMAIN;
export const AUTH0_CLIENT_ID =
  process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || process.env.AUTH0_CLIENT_ID;
export const AUTH0_AUDIENCE =
  process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || process.env.AUTH0_AUDIENCE;

// Shared Auth0 configuration object
export const sharedAuth0Config = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  audience: AUTH0_AUDIENCE,
  scope: "openid profile email",
} as const;

// Auth0 API endpoints
export const AUTH0_API_ENDPOINTS = {
  token: (domain: string) => `https://${domain}/oauth/token`,
  userInfo: (domain: string) => `https://${domain}/userinfo`,
  management: (domain: string) => `https://${domain}/api/v2/`,
  users: (domain: string) => `https://${domain}/api/v2/users`,
  roles: (domain: string) => `https://${domain}/api/v2/roles`,
} as const;

// Auth0 connection types
export const AUTH0_CONNECTIONS = {
  USERNAME_PASSWORD: "Username-Password-Authentication",
  GOOGLE: "google-oauth2",
  GITHUB: "github",
} as const;

// Auth0 grant types
export const AUTH0_GRANT_TYPES = {
  CLIENT_CREDENTIALS: "client_credentials",
  AUTHORIZATION_CODE: "authorization_code",
  REFRESH_TOKEN: "refresh_token",
} as const;

// Auth0 response types
export const AUTH0_RESPONSE_TYPES = {
  CODE: "code",
  TOKEN: "token",
  ID_TOKEN: "id_token",
} as const;

// Default export for convenience
export default {
  sharedAuth0Config,
  AUTH0_API_ENDPOINTS,
  AUTH0_CONNECTIONS,
  AUTH0_GRANT_TYPES,
  AUTH0_RESPONSE_TYPES,
};
