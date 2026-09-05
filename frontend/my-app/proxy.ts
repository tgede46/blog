import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const SESSION_COOKIE_NAMES = ["blog_access_token"]

export function proxy(request: NextRequest) {
  const hasSession = SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name))
  if (hasSession) return NextResponse.next()

  const loginUrl = request.nextUrl.clone()
  loginUrl.pathname = "/"
  loginUrl.search = ""
  loginUrl.searchParams.set("login", "required")
  loginUrl.searchParams.set("next", request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/admin/:path*"],
}
