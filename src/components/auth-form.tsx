"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  loginAction,
  registerAction,
  type AuthState,
} from "@/app/actions/auth";
import { SubmitButton } from "@/components/submit-button";

const initialState: AuthState = {};

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction] = useActionState(action, initialState);
  const registering = mode === "register";

  return (
    <form action={formAction} className="auth-form">
      {registering && (
        <Field
          label="Your name"
          name="name"
          placeholder="Michael Scott"
          autoComplete="name"
          errors={state.fieldErrors?.name}
        />
      )}
      <Field
        label="Email address"
        name="email"
        type="email"
        placeholder="michael@example.com"
        autoComplete="email"
        errors={state.fieldErrors?.email}
      />
      <Field
        label="Password"
        name="password"
        type="password"
        placeholder={registering ? "8+ characters and a number" : "Your password"}
        autoComplete={registering ? "new-password" : "current-password"}
        errors={state.fieldErrors?.password}
      />

      {state.error && <p className="form-error" role="alert">{state.error}</p>}

      <SubmitButton pendingLabel={registering ? "Creating account..." : "Signing in..."}>
        {registering ? "Create my account" : "Sign in"}
      </SubmitButton>

      <p className="auth-switch">
        {registering ? "Already have an account?" : "New to our paper route?"}{" "}
        <Link href={registering ? "/login" : "/register"}>
          {registering ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  errors,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  autoComplete: string;
  errors?: string[];
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
      {errors?.map((error) => <small key={error}>{error}</small>)}
    </label>
  );
}
