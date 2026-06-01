import { type NextRequest } from "next/server";
import { handleAuthMiddleware } from "@/lib/auth/middleware";

export async function middleware(request: NextRequest) {
  return handleAuthMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Only run auth middleware on routes that need session checks.
     * /learn/* is pre-rendered static content — skip middleware entirely.
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
