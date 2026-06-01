import { NextResponse, type NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth/session'

export async function handleAuthMiddleware(request: NextRequest) {
  const session = await getSessionFromRequest(request)

  const protectedPaths = ['/playground', '/onboarding']
  const isProtectedPath = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  )

  if (isProtectedPath && !session) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  const authPaths = ['/login', '/signup']
  const isAuthPath = authPaths.some((p) => request.nextUrl.pathname.startsWith(p))

  if (isAuthPath && session) {
    const url = request.nextUrl.clone()
    const redirectTo = url.searchParams.get('redirect')
    url.pathname =
      redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
        ? redirectTo
        : '/learn'
    url.searchParams.delete('redirect')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
