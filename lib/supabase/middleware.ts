import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/account", "/admin"];

function hasSupabaseSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some(({ name, value }) => {
    if (!value) return false;
    if (name === "sb-access-token" || name === "sb-refresh-token") return true;
    return name.startsWith("sb-") && name.includes("-auth-token");
  });
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !hasSupabaseSessionCookie(request)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}
