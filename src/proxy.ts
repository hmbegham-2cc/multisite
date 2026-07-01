import { NextResponse, type NextRequest } from 'next/server'

import { getSiteSlugFromHostHeader } from '@/lib/siteHosts'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/sites/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  const host = request.headers.get('host') || ''
  const siteSlug = await getSiteSlugFromHostHeader(host)

  if (!siteSlug) {
    return NextResponse.next()
  }

  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = `/sites/${siteSlug}${pathname === '/' ? '' : pathname}`

  return NextResponse.rewrite(rewriteUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
