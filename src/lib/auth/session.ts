import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export interface SessionData {
  isAdmin: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "dulceria_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8, // 8h
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

// Server actions are directly callable (not just reachable through admin
// pages), so every mutation must re-check the session itself rather than
// trusting that only an already-gated admin page could have called it.
export async function requireAdminSession() {
  const session = await getSession();
  if (!session.isAdmin) {
    throw new Error("Not authorized");
  }
  return session;
}
