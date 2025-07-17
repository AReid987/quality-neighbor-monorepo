import { supabase, createServiceRoleClient } from "@qn/database/src/client";
import type { QNUser } from "@qn/auth";
import { ProjectNamespace } from "@qn/auth";

// Re-export the main client
export { supabase as db };

// Service role client for admin operations
export const adminDb = createServiceRoleClient();

// Database table types (these would typically be generated from your schema)
export interface DBUser {
  user_id: string;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  location: string;
  interests: string[];
  role: "Resident" | "BusinessOwner" | "Internal";
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface QNBusiness {
  business_id: string;
  user_id: string;
  business_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  category: string;
  description?: string;
  logo_url?: string;
  ad_package_tier: "Bronze" | "Silver" | "Gold";
  created_at: string;
  updated_at: string;
}

export interface QNAdvertisement {
  ad_id: string;
  business_id: string;
  campaign_name: string;
  ad_creative_url: string;
  ad_copy: string;
  status: "Active" | "Paused" | "Pending Review" | "Completed";
  start_date: string;
  end_date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  created_at: string;
  updated_at: string;
}

export interface RLTRAgent {
  id: string;
  name: string;
  phone?: string;
  email: string;
  company?: string;
  profile_image_url?: string;
  notification_preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface RLTRListing {
  id: string;
  source_id: string;
  address: Record<string, any>;
  price?: number;
  beds?: number;
  baths?: number;
  sqft?: number;
  description?: string;
  key_features: string[];
  image_urls: string[];
  status: "active" | "sold";
  scraped_at: string;
  updated_at: string;
}

export interface RLTRContentPiece {
  id: string;
  listing_id: string;
  agent_id: string;
  content_type: "social_media_post" | "flyer_text";
  generated_text: Record<string, any>;
  associated_image_urls: string[];
  status:
    | "draft"
    | "pending_approval_agent"
    | "pending_external_marketing_approval"
    | "approved_for_posting"
    | "rejected"
    | "pending_ai_revision"
    | "posted_successfully"
    | "posting_failed";
  feedback?: string;
  created_at: string;
  updated_at: string;
  last_approved_at?: string;
}

// Database utility functions
export class DatabaseUtils {
  private client: typeof supabase;

  constructor(client: typeof supabase = supabase) {
    this.client = client;
  }

  // QN (Quality Neighbor) operations
  async getQNUsers(filters?: { role?: string; is_verified?: boolean }) {
    let query = this.client.from("qn_users").select("*");

    if (filters?.role) {
      query = query.eq("role", filters.role);
    }

    if (filters?.is_verified !== undefined) {
      query = query.eq("is_verified", filters.is_verified);
    }

    return query;
  }

  async getQNUserByEmail(email: string) {
    return this.client.from("qn_users").select("*").eq("email", email).single();
  }

  async createQNUser(
    user: Omit<DBUser, "user_id" | "created_at" | "updated_at">,
  ) {
    return this.client.from("qn_users").insert(user).select().single();
  }

  async updateQNUser(userId: string, updates: Partial<DBUser>) {
    return this.client
      .from("qn_users")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();
  }

  async getQNBusinesses(userId?: string) {
    let query = this.client.from("qn_businesses").select("*");

    if (userId) {
      query = query.eq("user_id", userId);
    }

    return query;
  }

  async getQNAdvertisements(businessId?: string) {
    let query = this.client.from("qn_advertisements").select("*");

    if (businessId) {
      query = query.eq("business_id", businessId);
    }

    return query;
  }

  // RLTR (Real Estate Marketing) operations
  async getRLTRAgents(filters?: { email?: string; company?: string }) {
    let query = this.client.from("rltr_mktg_agents").select("*");

    if (filters?.email) {
      query = query.eq("email", filters.email);
    }

    if (filters?.company) {
      query = query.eq("company", filters.company);
    }

    return query;
  }

  async getRLTRAgentByEmail(email: string) {
    return this.client
      .from("rltr_mktg_agents")
      .select("*")
      .eq("email", email)
      .single();
  }

  async createRLTRAgent(
    agent: Omit<RLTRAgent, "id" | "created_at" | "updated_at">,
  ) {
    return this.client.from("rltr_mktg_agents").insert(agent).select().single();
  }

  async getRLTRListings(filters?: { status?: string; agent_id?: string }) {
    let query = this.client.from("rltr_mktg_listings").select("*");

    if (filters?.status) {
      query = query.eq("status", filters.status);
    }

    return query;
  }

  async getRLTRContentPieces(agentId?: string, listingId?: string) {
    let query = this.client.from("rltr_mktg_content_pieces").select(`
      *,
      rltr_mktg_listings (
        address,
        price,
        beds,
        baths,
        sqft
      ),
      rltr_mktg_agents (
        name,
        email
      )
    `);

    if (agentId) {
      query = query.eq("agent_id", agentId);
    }

    if (listingId) {
      query = query.eq("listing_id", listingId);
    }

    return query;
  }

  async createRLTRContentPiece(
    contentPiece: Omit<RLTRContentPiece, "id" | "created_at" | "updated_at">,
  ) {
    return this.client
      .from("rltr_mktg_content_pieces")
      .insert(contentPiece)
      .select()
      .single();
  }

  async updateRLTRContentPiece(id: string, updates: Partial<RLTRContentPiece>) {
    return this.client
      .from("rltr_mktg_content_pieces")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
  }

  async getRLTRNotifications(agentId: string, unreadOnly: boolean = false) {
    let query = this.client
      .from("rltr_mktg_notifications")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false });

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    return query;
  }

  async markNotificationAsRead(notificationId: string) {
    return this.client
      .from("rltr_mktg_notifications")
      .update({ is_read: true })
      .eq("id", notificationId);
  }

  // User synchronization functions
  async syncAuth0User(auth0User: QNUser, projectNamespace: ProjectNamespace) {
    try {
      if (projectNamespace === ProjectNamespace.QN) {
        // Check if QN user exists
        const { data: existingUser } = await this.getQNUserByEmail(
          auth0User.email,
        );

        if (existingUser) {
          // Update existing user
          return await this.updateQNUser(existingUser.user_id, {
            first_name: auth0User.given_name || auth0User.name || "",
            last_name: auth0User.family_name || "",
            // Don't update location and interests if they already exist
            ...(existingUser.location ? {} : { location: "" }),
            ...(existingUser.interests?.length ? {} : { interests: [] }),
          });
        } else {
          // Create new QN user
          return await this.createQNUser({
            email: auth0User.email,
            first_name: auth0User.given_name || auth0User.name || "",
            last_name: auth0User.family_name || "",
            location: "",
            interests: [],
            role: "Resident",
            is_verified: auth0User.email_verified || false,
          });
        }
      } else if (projectNamespace === ProjectNamespace.RLTR_MKTG) {
        // Check if RLTR agent exists
        const { data: existingAgent } = await this.getRLTRAgentByEmail(
          auth0User.email,
        );

        if (existingAgent) {
          // Update existing agent
          return await this.client
            .from("rltr_mktg_agents")
            .update({
              name:
                auth0User.name ||
                `${auth0User.given_name || ""} ${auth0User.family_name || ""}`.trim(),
              profile_image_url: auth0User.picture,
            })
            .eq("id", existingAgent.id)
            .select()
            .single();
        } else {
          // Create new RLTR agent
          return await this.createRLTRAgent({
            name:
              auth0User.name ||
              `${auth0User.given_name || ""} ${auth0User.family_name || ""}`.trim(),
            email: auth0User.email,
            profile_image_url: auth0User.picture,
            notification_preferences: {},
          });
        }
      }
    } catch (error) {
      console.error("Error syncing Auth0 user:", error);
      throw error;
    }
  }

  // Analytics and reporting functions
  async getQNDashboardStats() {
    const [usersResult, businessesResult, adsResult] = await Promise.all([
      this.client.from("qn_users").select("*", { count: "exact", head: true }),
      this.client
        .from("qn_businesses")
        .select("*", { count: "exact", head: true }),
      this.client
        .from("qn_advertisements")
        .select("*", { count: "exact", head: true }),
    ]);

    return {
      totalUsers: usersResult.count || 0,
      totalBusinesses: businessesResult.count || 0,
      totalAds: adsResult.count || 0,
    };
  }

  async getRLTRDashboardStats() {
    const [agentsResult, listingsResult, contentResult] = await Promise.all([
      this.client
        .from("rltr_mktg_agents")
        .select("*", { count: "exact", head: true }),
      this.client
        .from("rltr_mktg_listings")
        .select("*", { count: "exact", head: true }),
      this.client
        .from("rltr_mktg_content_pieces")
        .select("*", { count: "exact", head: true }),
    ]);

    return {
      totalAgents: agentsResult.count || 0,
      totalListings: listingsResult.count || 0,
      totalContent: contentResult.count || 0,
    };
  }

  // Real-time subscriptions
  subscribeToQNUsers(callback: (payload: any) => void) {
    return this.client
      .channel("qn_users_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "qn_users" },
        callback,
      )
      .subscribe();
  }

  subscribeToRLTRContentPieces(callback: (payload: any) => void) {
    return this.client
      .channel("rltr_content_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rltr_mktg_content_pieces" },
        callback,
      )
      .subscribe();
  }
}

// Export a default instance
export const dbUtils = new DatabaseUtils();

// Export utility functions
export const {
  getQNUsers,
  getQNUserByEmail,
  createQNUser,
  updateQNUser,
  getQNBusinesses,
  getQNAdvertisements,
  getRLTRAgents,
  getRLTRAgentByEmail,
  createRLTRAgent,
  getRLTRListings,
  getRLTRContentPieces,
  createRLTRContentPiece,
  updateRLTRContentPiece,
  getRLTRNotifications,
  markNotificationAsRead,
  syncAuth0User,
  getQNDashboardStats,
  getRLTRDashboardStats,
  subscribeToQNUsers,
  subscribeToRLTRContentPieces,
} = dbUtils;
