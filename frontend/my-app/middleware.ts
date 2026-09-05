import { NextRequest, NextResponse } from "next/server"

const PROTECTED_PREFIX = "/admin"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin routes
  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next()
  }

  // Check for the JWT token stored in a cookie OR
  // rely on the presence of a token in a cookie set at login
  const token = req.cookies.get("blog_access_token")?.value

  if (!token) {
    // Redirect to home with a signal to open the login modal
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/"
    redirectUrl.searchParams.set("login", "required")
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
