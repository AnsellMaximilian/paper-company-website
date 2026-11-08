import "server-only";

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";
import { sql } from "@/lib/db";
import type { StoreUser } from "@/lib/types";

const COOKIE_NAME = "mspc_session";
const SESSION_AGE_SECONDS = 60 * 60 * 24 * 30;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_AGE_SECONDS * 1000);

  await sql`
    insert into sessions (id, user_id, token_hash, expires_at)
    values (${randomUUID()}, ${userId}, ${hashToken(token)}, ${expiresAt})
  `;

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_AGE_SECONDS,
  });
}

export async function deleteSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    await sql`delete from sessions where token_hash = ${hashToken(token)}`;
  }
  store.delete(COOKIE_NAME);
}

export const getCurrentUser = cache(async (): Promise<StoreUser | null> => {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const rows = await sql<StoreUser[]>`
    select users.id, users.name, users.email
    from sessions
    join users on users.id = sessions.user_id
    where sessions.token_hash = ${hashToken(token)}
      and sessions.expires_at > now()
    limit 1
  `;

  return rows[0] ?? null;
});
