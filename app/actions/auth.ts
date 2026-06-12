"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string };

// Demo/offline login shortcuts are only active when
// NEXT_PUBLIC_ENABLE_MOCK_AUTH="true". In production the real Supabase
// password login is always used.
const MOCK_AUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === "true";

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin") || "/admin";

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  // Local/Offline Development Auth Bypass (demo mode only)
  if (MOCK_AUTH_ENABLED) {
    if (
      (email === "admin@thennaiyan.in" || email === "admin@gmail.com") &&
      password === "adminpassword"
    ) {
      const cookieStore = await cookies();
      cookieStore.set("sb-access-token", "mock-admin", { path: "/" });
      cookieStore.set("sb-refresh-token", "mock-admin", { path: "/" });
      redirect("/admin");
    }

    if (email === "customer@gmail.com" && password === "customerpassword") {
      const cookieStore = await cookies();
      cookieStore.set("sb-access-token", "mock-customer", { path: "/" });
      cookieStore.set("sb-refresh-token", "mock-customer", { path: "/" });
      redirect(next.startsWith("/") ? next : "/account");
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data?.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile?.role === "admin") {
      redirect("/admin");
    } else {
      redirect(next.startsWith("/") && next !== "/admin" ? next : "/account");
    }
  }

  redirect("/account");
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const next = String(formData.get("next") ?? "/account") || "/account";

  if (!fullName || !phone || !email || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  if (MOCK_AUTH_ENABLED) {
    const cookieStore = await cookies();
    cookieStore.set("sb-access-token", "mock-customer", { path: "/" });
    cookieStore.set("sb-refresh-token", "mock-customer", { path: "/" });
    redirect(next.startsWith("/") ? next : "/account");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.session) {
    redirect(next.startsWith("/") ? next : "/account");
  } else {
    // If confirmation is required, redirect to login page with a success flag
    redirect(`/login?next=${encodeURIComponent(next)}&signedup=1`);
  }
}

