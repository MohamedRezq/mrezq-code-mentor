import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Only run auth middleware on routes that need session checks.
     * /learn/* is pre-rendered static content — skip middleware so
     * Supabase auth lookups cannot block CDN page delivery.
     */
    "/login",
    "/signup",
    "/onboarding",
    "/onboarding/:path*",
    "/playground",
    "/playground/:path*",
    "/api/:path*",
  ],
};
