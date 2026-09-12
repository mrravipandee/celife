import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
}

export const COOKIE_NAME = "thedco_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not defined");
  }
  return secret;
}

/**
 * Signs a payload into a secure HMAC-SHA256 signature token (JWT format).
 */
export function signToken(payload: object, expiresMs: number): string {
  const secret = getAuthSecret();
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  
  const exp = Date.now() + expiresMs;
  const fullPayload = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${encodedPayload}`)
    .digest("base64url");
    
  return `${header}.${encodedPayload}.${signature}`;
}

export interface DecodedToken extends SessionUser {
  exp: number;
}

/**
 * Verifies and decodes a token. Returns null if invalid or expired.
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    const secret = getAuthSecret();
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [header, encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${header}.${encodedPayload}`)
      .digest("base64url");
      
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as DecodedToken;
    
    if (payload.exp && Date.now() > payload.exp) {
      return null;
    }
    
    return payload;
  } catch {
    return null;
  }
}

/**
 * Creates an HTTP-only secure session cookie for the user.
 */
export async function createSession(user: SessionUser): Promise<void> {
  const token = signToken(user, SESSION_DURATION_MS);
  const cookieStore = await cookies();
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000, // seconds
  });
}

/**
 * Retrieves the current session user details from the session cookie.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get(COOKIE_NAME);
  
  if (!tokenCookie || !tokenCookie.value) {
    return null;
  }
  
  const payload = verifyToken(tokenCookie.value);
  if (!payload) {
    return null;
  }
  
  return {
    id: payload.id,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
}

/**
 * Destroys the current session by deleting the session cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
