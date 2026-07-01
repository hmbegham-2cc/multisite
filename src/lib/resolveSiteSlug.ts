import { unstable_cache } from 'next/cache'

import { getPayloadClient } from '@/lib/payload'
import { getHostname } from '@/lib/siteHosts'

async function resolveSiteSlugFromHostUncached(host: string) {
  const hostname = getHostname(host)
  if (!hostname) return null

  const payload = await getPayloadClient()
  const subdomain = hostname.split('.')[0]

  const result = await payload.find({
    collection: 'sites',
    where: {
      and: [
        { status: { equals: 'published' } },
        {
          or: [
            { domain: { equals: hostname } },
            { subdomain: { equals: subdomain } },
          ],
        },
      ],
    },
    limit: 1,
    depth: 0,
  })

  return result.docs[0]?.slug ?? null
}

export async function resolveSiteSlugFromHost(host: string) {
  const hostname = getHostname(host)
  if (!hostname) return null

  return unstable_cache(
    () => resolveSiteSlugFromHostUncached(hostname),
    ['resolve-site-slug', hostname],
    { revalidate: 300 },
  )()
}
