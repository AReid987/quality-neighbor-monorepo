import { NextApiRequest, NextApiResponse } from "next";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { auth0Management } from "@qn/auth";
import type { QNUser } from "@qn/auth";
import { z } from "zod";

// Validation schema for metadata updates
const MetadataUpdateSchema = z
  .object({
    preferences: z.record(z.string(), z.any()).optional(),
    onboarding_completed: z.boolean().optional(),
    notification_settings: z.record(z.string(), z.any()).optional(),
    dashboard_settings: z.record(z.string(), z.any()).optional(),
    projects: z.array(z.string()).optional(),
    roles: z.array(z.string()).optional(),
  })
  .strict();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await getSession(req, res);

    if (!session || !session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = session.user as QNUser;
    const userId = user.sub;

    // Validate request body
    const validationResult = MetadataUpdateSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: "Invalid metadata format",
        details: validationResult.error.issues,
      });
    }

    const metadataUpdates = validationResult.data;

    // Get current user metadata
    const currentUserData = await auth0Management.getUserMetadata(userId);
    const currentAppMetadata = currentUserData.app_metadata || {};
    const currentUserMetadata = currentUserData.user_metadata || {};

    // Merge updates with existing metadata
    const updatedAppMetadata = {
      ...currentAppMetadata,
      // Only update projects and roles if provided
      ...(metadataUpdates.projects && { projects: metadataUpdates.projects }),
      ...(metadataUpdates.roles && { roles: metadataUpdates.roles }),
      // Update timestamp
      updated_at: new Date().toISOString(),
    };

    const updatedUserMetadata = {
      ...currentUserMetadata,
      // Update user preferences and settings
      ...(metadataUpdates.preferences && {
        preferences: metadataUpdates.preferences,
      }),
      ...(metadataUpdates.onboarding_completed !== undefined && {
        onboarding_completed: metadataUpdates.onboarding_completed,
      }),
      ...(metadataUpdates.notification_settings && {
        notification_settings: metadataUpdates.notification_settings,
      }),
      ...(metadataUpdates.dashboard_settings && {
        dashboard_settings: metadataUpdates.dashboard_settings,
      }),
      // Update timestamp
      updated_at: new Date().toISOString(),
    };

    // Update Auth0 user metadata
    await auth0Management.updateUserMetadata(userId, updatedAppMetadata);

    // Update user_metadata if there are user-specific updates
    if (Object.keys(updatedUserMetadata).length > 1) {
      // More than just updated_at
      const response = await fetch(
        `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${await auth0Management.getAccessToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_metadata: updatedUserMetadata,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update user metadata: ${response.statusText}`,
        );
      }
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: "User metadata updated successfully",
      data: {
        app_metadata: updatedAppMetadata,
        user_metadata: updatedUserMetadata,
      },
    });
  } catch (error) {
    console.error("Error updating user metadata:", error);

    // Return appropriate error response
    if (error instanceof Error) {
      res.status(500).json({
        error: "Failed to update user metadata",
        message: error.message,
      });
    } else {
      res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}

export default withApiAuthRequired(handler);
