import { createBrowserClient } from "@supabase/ssr";

function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

// Demo/offline auth is only honoured when NEXT_PUBLIC_ENABLE_MOCK_AUTH="true".
const MOCK_AUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_MOCK_AUTH === "true";

export function createClient() {
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const token = getCookie("sb-access-token");

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
            signOut: async () => {
              // Delete cookies client-side
              document.cookie = "sb-access-token=; Max-Age=0; path=/";
              document.cookie = "sb-refresh-token=; Max-Age=0; path=/";
              return { error: null };
            },
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
