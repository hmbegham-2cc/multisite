import { resolveSiteSlugFromHost } from '@/lib/resolveSiteSlug'

const LOCAL_HOSTS = new Set(['127.0.0.1', 'localhost'])

export function parseDevSiteHosts(value?: string): Record<string, string> {
  if (!value) return {}

  return value.split(',').reduce<Record<string, string>>((map, entry) => {
    const [host, slug] = entry.split(':').map((part) => part.trim().toLowerCase())
    if (host && slug) {
      map[host] = slug
    }
    return map
  }, {})
}

export function getHostname(hostHeader: string) {
  return hostHeader.split(':')[0].trim().toLowerCase()
}

export function isLocalAppHost(hostname: string) {
  return LOCAL_HOSTS.has(hostname)
}

/** Hôtes de la plateforme (pas un domaine client) — pas de rewrite multisite. */
export function isPlatformAppHost(hostname: string) {
  if (!hostname || isLocalAppHost(hostname)) return true
  if (hostname.endsWith('.vercel.app')) return true

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
  if (serverUrl) {
    try {
      if (getHostname(new URL(serverUrl).host) === hostname) return true
    } catch {
      /* ignore invalid URL */
    }
  }

  return false
}

export async function getSiteSlugFromHostHeader(hostHeader: string) {
  const hostname = getHostname(hostHeader)

  if (!hostname || isPlatformAppHost(hostname)) {
    return null
  }

  const devMap = parseDevSiteHosts(process.env.DEV_SITE_HOSTS)
  if (devMap[hostname]) {
    return devMap[hostname]
  }

  return resolveSiteSlugFromHost(hostname)
}
