"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/actions/auth";

const INITIAL: AuthState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    INITIAL,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="next" value={next} />

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full bg-transparent border-b border-shell/30 focus:border-leaf focus:outline-none transition-colors py-2 text-sm text-ink placeholder-shell/30 font-body"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="font-mono text-[10px] text-shell-husk uppercase tracking-wider block"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full bg-transparent border-b border-shell/30 focus:border-leaf focus:outline-none transition-colors py-2 text-sm text-ink placeholder-shell/30 font-body"
        />
      </div>

      {state?.error && (
        <p className="font-body text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-sm">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
