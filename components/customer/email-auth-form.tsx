"use client";

import { useActionState } from "react";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";
import { User, Phone, Mail, Lock, Loader2 } from "lucide-react";

type EmailAuthFormProps = {
  next: string;
  mode?: "login" | "signup";
};

const INITIAL: AuthState = {};

export function EmailAuthForm({ next, mode = "login" }: EmailAuthFormProps) {
  const action = mode === "signup" ? signUp : signIn;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    INITIAL,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      <div className="flex items-start gap-3 mb-2">
        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-leaf-mist text-leaf">
          <User size={18} />
        </span>
        <div>
          <h2
            className="font-display text-2xl text-leaf-deep"
            style={{ fontVariationSettings: "'SOFT' 55, 'opsz' 24" }}
          >
            {mode === "signup" ? "Create customer account" : "Customer login"}
          </h2>
          <p className="mt-1 font-body text-sm leading-relaxed text-shell">
            {mode === "signup"
              ? "Register to keep your orders, cart, and tracking connected."
              : "Login using your email and password."}
          </p>
        </div>
      </div>

      {mode === "signup" && (
        <>
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="fullName"
              className="block font-mono text-[10px] uppercase tracking-wider text-shell-husk"
            >
              Your name
            </label>
            <div className="relative">
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                placeholder="e.g. Ravi Kumar"
                className="w-full border-b border-shell/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors placeholder:text-shell/30 focus:border-leaf"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block font-mono text-[10px] uppercase tracking-wider text-shell-husk"
            >
              Mobile number
            </label>
            <div className="relative">
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+91 98765 43210"
                className="w-full border-b border-shell/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors placeholder:text-shell/30 focus:border-leaf"
              />
            </div>
          </div>
        </>
      )}

      {/* Email Address */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block font-mono text-[10px] uppercase tracking-wider text-shell-husk"
        >
          Email address (Gmail)
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@gmail.com"
            className="w-full border-b border-shell/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors placeholder:text-shell/30 focus:border-leaf"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block font-mono text-[10px] uppercase tracking-wider text-shell-husk"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="••••••••"
            className="w-full border-b border-shell/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors placeholder:text-shell/30 focus:border-leaf"
          />
        </div>
      </div>

      {mode === "signup" && (
        /* Confirm Password */
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block font-mono text-[10px] uppercase tracking-wider text-shell-husk"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              className="w-full border-b border-shell/30 bg-transparent py-2 font-body text-sm text-ink outline-none transition-colors placeholder:text-shell/30 focus:border-leaf"
            />
          </div>
        </div>
      )}

      {state?.error && (
        <p className="rounded-sm border border-red-200 bg-red-50 px-3 py-2 font-body text-sm text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader2 size={16} className="animate-spin" />}
        {mode === "signup" ? "Create Account" : "Sign in"}
      </button>
    </form>
  );
}
