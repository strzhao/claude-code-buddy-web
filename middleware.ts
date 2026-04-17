import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // TODO: Add auth check for /admin and /api/admin routes
  // When auth is added, check for session/token here and return 401 if unauthorized
  // For now, all routes are accessible
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
