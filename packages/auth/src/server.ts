import type { NextApiRequest, NextApiResponse } from "next";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { z } from "zod";
import type { QNUser, UserRole, ProjectNamespace } from "./client";

// Server-side Auth0 configuration
export const auth0ServerConfig = {
  domain: process.env.AUTH0_DOMAIN || "",
  clientId: process.env.AUTH0_CLIENT_ID || "",
  clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
  baseURL: process.env.AUTH0_BASE_URL || "",
  secret: process.env.AUTH0_SECRET || "",
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN || ""}`,
  audience:
    process.env.AUTH0_AUDIENCE ||
    `https://${process.env.AUTH0_DOMAIN || ""}/api/v2/`,
};

// Validation schemas
const Auth0UserSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  nickname: z.string().optional(),
  picture: z.string().url().optional(),
  given_name: z.string().optional(),
  family_name: z.string().optional(),
  locale: z.string().optional(),
  updated_at: z.string().optional(),
  email_verified: z.boolean().optional(),
});

// Auth0 Management API client
export class Auth0Management {
  private domain: string;
  private clientId: string;
  private clientSecret: string;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    this.domain = auth0ServerConfig.domain;
    this.clientId = auth0ServerConfig.clientId;
    this.clientSecret = auth0ServerConfig.clientSecret;
  }

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await fetch(`https://${this.domain}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        audience: `https://${this.domain}/api/v2/`,
        grant_type: "client_credentials",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get Auth0 management token: ${response.statusText}`,
      );
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000; // 1 minute buffer

    if (!this.accessToken) {
      throw new Error("Failed to retrieve access token from Auth0");
    }

    return this.accessToken as string;
  }

  async updateUserMetadata(userId: string, metadata: Record<string, unknown>) {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://${this.domain}/api/v2/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          app_metadata: metadata,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to update user metadata: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserMetadata(userId: string) {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://${this.domain}/api/v2/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to get user metadata: ${response.statusText}`);
    }

    return response.json();
  }

  async assignRoles(userId: string, roles: string[]) {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://${this.domain}/api/v2/users/${userId}/roles`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roles,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to assign roles: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserRoles(userId: string) {
    const token = await this.getAccessToken();

    const response = await fetch(
      `https://${this.domain}/api/v2/users/${userId}/roles`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to get user roles: ${response.statusText}`);
    }

    return response.json();
  }

  async createUser(userData: {
    email: string;
    password?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    app_metadata?: Record<string, any>;
  }) {
    const token = await this.getAccessToken();

    const response = await fetch(`https://${this.domain}/api/v2/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        connection: "Username-Password-Authentication",
        ...userData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`);
    }

    return response.json();
  }
}

// Utility functions
export const auth0Management = new Auth0Management();

// Higher-order component for role-based access control
export function requireRole(role: UserRole) {
  return function (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
    ) => Promise<void> | void,
  ) {
    return withApiAuthRequired(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const session = await getSession(req, res);

        if (!session || !session.user) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const user = session.user as QNUser;

        if (
          !user.app_metadata?.roles?.includes(role) &&
          !user.app_metadata?.roles?.includes("super:admin" as UserRole)
        ) {
          return res.status(403).json({ error: "Forbidden" });
        }

        return handler(req, res);
      },
    );
  };
}

// Higher-order component for project-based access control
export function requireProject(project: ProjectNamespace) {
  return function (
    handler: (
      req: NextApiRequest,
      res: NextApiResponse,
    ) => Promise<void> | void,
  ) {
    return withApiAuthRequired(
      async (req: NextApiRequest, res: NextApiResponse) => {
        const session = await getSession(req, res);

        if (!session || !session.user) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const user = session.user as QNUser;

        if (
          !user.app_metadata?.projects?.includes(project) &&
          !user.app_metadata?.roles?.includes("super:admin" as UserRole)
        ) {
          return res.status(403).json({ error: "Forbidden" });
        }

        return handler(req, res);
      },
    );
  };
}

// User creation and synchronization helpers
export async function createOrUpdateUser(
  auth0User: QNUser,
  projectNamespace: ProjectNamespace,
) {
  try {
    // Validate the Auth0 user data
    const validatedUser = Auth0UserSchema.parse(auth0User);

    // This would typically integrate with your Supabase database
    // to create or update the user record in the appropriate table

    const userData = {
      email: validatedUser.email,
      auth0_id: validatedUser.sub,
      first_name: validatedUser.given_name || validatedUser.name || "",
      last_name: validatedUser.family_name || "",
      profile_image_url: validatedUser.picture,
      last_login: new Date().toISOString(),
    };

    // Update Auth0 metadata with database IDs
    const metadata = {
      ...auth0User.app_metadata,
      projects: [...(auth0User.app_metadata?.projects || []), projectNamespace],
      last_login: new Date().toISOString(),
    };

    await auth0Management.updateUserMetadata(auth0User.sub, metadata);

    return userData;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

// Auth0 configuration for Next.js server
export const auth0NextConfig = {
  domain: auth0ServerConfig.domain,
  clientId: auth0ServerConfig.clientId,
  clientSecret: auth0ServerConfig.clientSecret,
  baseURL: auth0ServerConfig.baseURL,
  secret: auth0ServerConfig.secret,
  issuerBaseURL: auth0ServerConfig.issuerBaseURL,
  audience: auth0ServerConfig.audience,
  scope: "openid profile email",
  session: {
    rollingDuration: 60 * 60 * 24, // 24 hours
    absoluteDuration: 60 * 60 * 24 * 7, // 7 days
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  },
  routes: {
    login: "/api/auth/login",
    logout: "/api/auth/logout",
    callback: "/api/auth/callback",
    postLogoutRedirect: "/",
  },
  authorizationParams: {
    response_type: "code",
    audience: auth0ServerConfig.audience,
    scope: "openid profile email",
  },
};

// Helper function to get user from session
export async function getUserFromSession(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<QNUser | null> {
  const session = await getSession(req, res);
  return (session?.user as QNUser) || null;
}

// Helper function to validate user has required role
export function validateUserRole(
  user: QNUser,
  requiredRole: UserRole,
): boolean {
  return (
    user.app_metadata?.roles?.includes(requiredRole) ||
    user.app_metadata?.roles?.includes("super:admin" as UserRole) ||
    false
  );
}

// Helper function to validate user has project access
export function validateUserProject(
  user: QNUser,
  requiredProject: ProjectNamespace,
): boolean {
  return (
    user.app_metadata?.projects?.includes(requiredProject) ||
    user.app_metadata?.roles?.includes("super:admin" as UserRole) ||
    false
  );
}

// Default export for easier imports
export default {
  auth0ServerConfig,
  auth0Management,
  auth0NextConfig,
  requireRole,
  requireProject,
  createOrUpdateUser,
  getUserFromSession,
  validateUserRole,
  validateUserProject,
  Auth0Management,
};
