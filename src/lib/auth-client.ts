import { createAuthClient } from "better-auth/react";

// No baseURL: Better Auth then resolves requests against
// window.location.origin itself (falling back to /api/auth, its default
// mount path), so calls go through Next.js's same-origin /api rewrite (see
// next.config.ts) instead of the cross-domain Render URL. A literal relative
// string like "/api/auth" doesn't work here — Better Auth's internal
// baseURL validation calls `new URL()` on it and throws.
export const authClient = createAuthClient({});

export const { signIn, signUp, signOut, useSession, requestPasswordReset } =
  authClient;
