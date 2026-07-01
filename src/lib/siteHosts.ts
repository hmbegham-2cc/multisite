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

export async function getSiteSlugFromHostHeader(hostHeader: string) {
  const hostname = getHostname(hostHeader)

  if (!hostname || isLocalAppHost(hostname)) {
    return null
  }

  const devMap = parseDevSiteHosts(process.env.DEV_SITE_HOSTS)
  if (devMap[hostname]) {
    return devMap[hostname]
  }

  return resolveSiteSlugFromHost(hostname)
}
