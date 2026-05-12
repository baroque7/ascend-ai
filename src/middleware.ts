import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Skip middleware for public routes and static assets
  if (
    req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/signup') ||
    req.nextUrl.pathname.startsWith('/forgot-password') ||
    req.nextUrl.pathname.startsWith('/pricing') ||
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.startsWith('/api') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return res
  }

  // For dashboard routes, ensure session cookies are preserved
  // This prevents redirect loops when using browser back button
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    // Preserve Supabase auth cookies
    const cookies = req.cookies.getAll()
    cookies.forEach(cookie => {
      if (cookie.name.includes('sb-')) {
        res.cookies.set(cookie.name, cookie.value, {
          ...cookie,
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
      }
    })
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, signup, forgot-password, pricing (auth and public routes)
     * - / (home page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup|forgot-password|pricing|$).*)',
  ],
}
