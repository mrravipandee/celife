import "server-only";
import { getSession, SessionUser } from "./session";

export class AuthError extends Error {
  constructor(
    public message: string,
    public status: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Asserts that the request is authenticated.
 * @returns The authenticated SessionUser
 * @throws AuthError if the session is invalid or expired
 */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSession();
  if (!user) {
    throw new AuthError("Unauthorized", 401);
  }
  return user;
}

/**
 * Asserts that the request is authenticated with an admin role.
 * @returns The authenticated SessionUser
 * @throws AuthError if not authenticated or not an admin
 */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new AuthError("Forbidden: Admin access required", 403);
  }
  return user;
}

/**
 * Asserts that the request is authenticated with at least an editor role.
 * @returns The authenticated SessionUser
 * @throws AuthError if not authenticated or unauthorized
 */
export async function requireEditor(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== "admin" && user.role !== "editor") {
    throw new AuthError("Forbidden: Editor or Admin access required", 403);
  }
  return user;
}
