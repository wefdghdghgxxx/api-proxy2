// server/utils/auth.ts

import { createHash, createHmac, randomBytes } from "crypto";
import type { H3Event } from "h3";

const AUTH_COOKIE_NAME = "homepage_auth";
const TOKEN_EXPIRY_DAYS = 7;

/**
 * Generate a secret key for signing tokens
 * In production, this should be set via environment variable
 */
function getSecretKey(): string {
  // Use HOMEPAGE_PASSWORD as part of the secret to ensure tokens are invalidated when password changes
  const password = process.env.HOMEPAGE_PASSWORD || "";
  return createHash("sha256").update(`${password}-secret-key`).digest("hex");
}

/**
 * Create a signed authentication token
 */
export function createAuthToken(): string {
  const timestamp = Date.now();
  const random = randomBytes(16).toString("hex");
  const payload = `${timestamp}:${random}`;
  const signature = createHmac("sha256", getSecretKey())
    .update(payload)
    .digest("hex");
  return `${payload}:${signature}`;
}

/**
 * Verify if an authentication token is valid
 */
export function verifyAuthToken(token: string): boolean {
  try {
    const parts = token.split(":");
    if (parts.length !== 3) return false;

    const [timestampStr, random, signature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    // Check if token has expired
    const now = Date.now();
    const expiryTime = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    if (now - timestamp > expiryTime) {
      return false;
    }

    // Verify signature
    const payload = `${timestampStr}:${random}`;
    const expectedSignature = createHmac("sha256", getSecretKey())
      .update(payload)
      .digest("hex");

    return signature === expectedSignature;
  } catch {
    return false;
  }
}

/**
 * Check if password authentication is required
 */
export function isAuthRequired(): boolean {
  return !!process.env.HOMEPAGE_PASSWORD;
}

/**
 * Verify if the provided password is correct
 */
export function verifyPassword(password: string): boolean {
  const expectedPassword = process.env.HOMEPAGE_PASSWORD || "";
  return password === expectedPassword;
}

/**
 * Check if the request is authenticated
 */
export function isAuthenticated(event: H3Event): boolean {
  if (!isAuthRequired()) {
    return true; // No authentication required
  }

  const token = getCookie(event, AUTH_COOKIE_NAME);
  if (!token) {
    return false;
  }

  return verifyAuthToken(token);
}

/**
 * Set authentication cookie
 */
export function setAuthCookie(event: H3Event): void {
  const token = createAuthToken();
  const maxAge = TOKEN_EXPIRY_DAYS * 24 * 60 * 60; // seconds

  setCookie(event, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(event: H3Event): void {
  deleteCookie(event, AUTH_COOKIE_NAME, {
    path: "/",
  });
}
