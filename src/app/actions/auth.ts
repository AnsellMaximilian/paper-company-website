"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sql } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSession } from "@/lib/session";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

const loginSchema = z.object({
  email: z.email("Enter a valid email address.").trim().toLowerCase(),
  password: z.string().min(1, "Enter your password."),
});

const registerSchema = loginSchema.extend({
  name: z.string().trim().min(2, "Enter your full name.").max(80),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[A-Za-z]/, "Include at least one letter.")
    .regex(/[0-9]/, "Include at least one number."),
});

export async function registerAction(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const userId = randomUUID();

  try {
    await sql`
      insert into users (id, name, email, password_hash)
      values (
        ${userId},
        ${parsed.data.name},
        ${parsed.data.email},
        ${await hashPassword(parsed.data.password)}
      )
    `;
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "23505") {
      return { error: "An account already exists for that email." };
    }
    return { error: "We couldn't create your account. Please try again." };
  }

  await createSession(userId);
  redirect("/shop");
}

export async function loginAction(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const rows = await sql<Array<{ id: string; password_hash: string }>>`
    select id, password_hash from users where email = ${parsed.data.email} limit 1
  `;
  const user = rows[0];

  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    return { error: "That email and password don't match." };
  }

  await createSession(user.id);
  redirect("/shop");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/");
}
