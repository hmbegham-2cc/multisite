import { SiteHeaderClient } from '@/components/public/SiteHeaderClient'

type PageLink = {
  id: number | string
  slug: string
  title: string
}

export function SiteNav({
  pages,
  siteName,
  siteSlug,
}: {
  pages: PageLink[]
  siteContact?: { phone?: null | string } | null
  siteName: string
  siteSlug: string
}) {
  return <SiteHeaderClient pages={pages} siteName={siteName} siteSlug={siteSlug} />
}
