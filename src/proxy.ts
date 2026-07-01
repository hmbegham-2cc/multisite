import { NextResponse, type NextRequest } from 'next/server'

import { getHostname, isPlatformAppHost, parseDevSiteHosts } from '@/lib/siteHosts'

async function resolveSiteSlugAtEdge(request: NextRequest, hostHeader: string) {
  const hostname = getHostname(hostHeader)

  if (!hostname || isPlatformAppHost(hostname)) {
    return null
  }

  const devMap = parseDevSiteHosts(process.env.DEV_SITE_HOSTS)
  if (devMap[hostname]) {
    return devMap[hostname]
  }

  // Le proxy tourne en Edge : pas de Postgres ici — on passe par une route API Node.
  const url = new URL('/api/resolve-site', request.url)
  url.searchParams.set('host', hostname)

  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return null
    const data = (await response.json()) as { slug?: string | null }
    return data.slug ?? null
  } catch {
    return null
  }
}

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
  const siteSlug = await resolveSiteSlugAtEdge(request, host)

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
