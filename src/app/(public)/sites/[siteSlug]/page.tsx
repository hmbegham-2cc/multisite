import { HomePage } from '@/components/public/HomePage'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { getPublishedSite, getSiteNavigation, getSiteServices } from '@/lib/publicSite'

export const revalidate = 60

type Props = {
  params: Promise<{
    siteSlug: string
  }>
}

export default async function SiteHomePage({ params }: Props) {
  const { siteSlug } = await params
  const { site } = await getPublishedSite(siteSlug)
  const [pages, services] = await Promise.all([
    getSiteNavigation(site.id),
    getSiteServices(site.id),
  ])

  const homepage = pages.docs.find((page) => page.isHomepage) || pages.docs[0]
  if (!homepage) {
    return (
      <main className="site-shell">
        <section className="site-subpage">
          <p className="site-kicker">Site</p>
          <h1>{site.name}</h1>
          <p>Ce site existe, mais aucune page publique n&apos;a encore été générée.</p>
        </section>
      </main>
    )
  }

  const heroImageUrl = getMediaUrl(homepage.heroImage)
  const lead = homepage.excerpt || site.seo?.description || undefined
  const headline =
    homepage.title && homepage.title.toLowerCase() !== 'accueil'
      ? homepage.title
      : site.seo?.defaultTitle || 'Livraison fleurs en 3h, même le dimanche'

  return (
    <main className="site-shell">
      <HomePage
        headline={headline}
        heroImageAlt={getMediaAlt(homepage.heroImage, homepage.title)}
        heroImageUrl={heroImageUrl}
        kicker={homepage.eyebrow || undefined}
        lead={lead}
        services={services.docs as never}
        siteSlug={site.slug}
      />
    </main>
  )
}
