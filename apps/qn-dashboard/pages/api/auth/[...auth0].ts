import {
  handleAuth,
  handleCallback,
  handleLogin,
  handleLogout,
} from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import {
  auth0Management,
  createOrUpdateUser,
  ProjectNamespace,
} from "@qn/auth";

// Custom callback handler to sync users with our database
const customCallback = handleCallback({
  async afterCallback(req: NextApiRequest, res: NextApiResponse, session: any) {
    try {
      const { user } = session;

      if (!user) {
        console.error("No user found in session after callback");
        return session;
      }

      // Determine project namespace based on user email domain or metadata
      let projectNamespace = ProjectNamespace.QN;

      // Check if user has existing project metadata
      if (user.app_metadata?.projects?.length > 0) {
        projectNamespace = user.app_metadata.projects[0];
      } else {
        // Default logic: assign based on email domain or other criteria
        const email = user.email?.toLowerCase();
        if (email?.includes("realestate") || email?.includes("agent")) {
          projectNamespace = ProjectNamespace.RLTR_MKTG;
        }
      }

      // Create or update user in our database
      await createOrUpdateUser(user, projectNamespace);

      // Update Auth0 metadata if needed
      const currentTime = new Date().toISOString();
      const updatedMetadata = {
        ...user.app_metadata,
        last_login: currentTime,
        projects: user.app_metadata?.projects || [projectNamespace],
      };

      await auth0Management.updateUserMetadata(user.sub, updatedMetadata);

      // Return updated session
      return {
        ...session,
        user: {
          ...user,
          app_metadata: updatedMetadata,
        },
      };
    } catch (error) {
      console.error("Error in Auth0 callback:", error);
      // Don't break the auth flow, just log the error
      return session;
    }
  },
});

// Custom login handler with project-specific redirects
const customLogin = handleLogin({
  authorizationParams: {
    audience: process.env.AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
  returnTo: "/dashboard",
});

// Custom logout handler
const customLogout = handleLogout({
  returnTo: "/",
});

// Export the Auth0 handlers
export default handleAuth({
  login: customLogin,
  logout: customLogout,
  callback: customCallback,
  signup: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: "openid profile email",
      screen_hint: "signup",
    },
    returnTo: "/dashboard",
  }),
});
