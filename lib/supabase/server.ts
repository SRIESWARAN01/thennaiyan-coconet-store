import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

// Demo/offline auth is only honoured when NEXT_PUBLIC_ENABLE_MOCK_AUTH="true".
// In production (flag unset/false) the real Supabase client is always used,
// so every read and write goes to the real database.
const MOCK_AUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === "true";

export async function createClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sb-access-token")?.value;

  const client = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — set is a no-op here,
            // middleware refreshes the session on every request.
          }
        },
      },
    }
  );

  if (MOCK_AUTH_ENABLED && (token === "mock-admin" || token === "mock-customer")) {
    const mockUser = {
      id: token === "mock-admin" ? "00000000-0000-0000-0000-000000000001" : "00000000-0000-0000-0000-000000000002",
      email: token === "mock-admin" ? "admin@thennaiyan.in" : "customer@gmail.com",
      phone: token === "mock-admin" ? "+918124165047" : "+919876543210",
      role: token === "mock-admin" ? "admin" : "customer",
      user_metadata: {
        full_name: token === "mock-admin" ? "Admin Owner" : "Regular Customer",
        phone: token === "mock-admin" ? "+918124165047" : "+919876543210",
      },
    };

    return new Proxy(client, {
      get(target, prop, receiver) {
        if (prop === "auth") {
          return {
            getUser: async () => ({ data: { user: mockUser }, error: null }),
            getSession: async () => ({ data: { session: { user: mockUser } }, error: null }),
            signOut: async () => ({ error: null }),
          };
        }
        if (prop === "from") {
          return (table: string) => {
            const chainable = {
              select: () => chainable,
              eq: () => chainable,
              order: () => chainable,
              limit: () => chainable,
              single: () => Promise.resolve({ data: mockUser, error: null }),
              maybeSingle: () => {
                if (table === "profiles") {
                  return Promise.resolve({ data: { id: mockUser.id, role: mockUser.role, full_name: mockUser.user_metadata.full_name, phone: mockUser.phone }, error: null });
                }
                return Promise.resolve({ data: null, error: null });
              },
              insert: () => chainable,
              update: () => chainable,
              upsert: () => chainable,
              then: (cb: any) => cb({ data: [], error: null }),
            };
            return chainable;
          };
        }
        return Reflect.get(target, prop, receiver);
      },
    }) as any;
  }

  return client;
}
