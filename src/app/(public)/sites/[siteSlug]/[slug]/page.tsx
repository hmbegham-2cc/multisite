import { notFound } from 'next/navigation'

import { ContactPage } from '@/components/public/ContactPage'
import { ReservationPage } from '@/components/public/ReservationPage'
import { BlockRenderer } from '@/components/public/BlockRenderer'
import { PageHeader } from '@/components/public/PageHeader'
import { ProductCard } from '@/components/public/ProductCard'
import { ShopFilters } from '@/components/public/ShopFilters'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { getPublishedPage, getPublishedSite, getSiteServices } from '@/lib/publicSite'

export const revalidate = 60

type Props = {
  params: Promise<{
    siteSlug: string
    slug: string
  }>
  searchParams: Promise<{
    booking?: string
    category?: string
    occasion?: string
    q?: string
    sent?: string
    type?: string
  }>
}

function filterServices(
  services: Awaited<ReturnType<typeof getSiteServices>>['docs'],
  query: { category?: string; occasion?: string; q?: string },
) {
  let filtered = services

  if (query.category) {
    filtered = filtered.filter(
      (service) =>
        service.category?.toLowerCase() === query.category?.toLowerCase() ||
        service.title?.toLowerCase().includes(query.category?.toLowerCase() || ''),
    )
  }
  if (query.occasion) {
    filtered = filtered.filter(
      (service) =>
        service.title?.toLowerCase().includes(query.occasion?.toLowerCase() || '') ||
        service.shortDescription?.toLowerCase().includes(query.occasion?.toLowerCase() || ''),
    )
  }
  if (query.q) {
    const term = query.q.toLowerCase()
    filtered = filtered.filter(
      (service) =>
        service.title?.toLowerCase().includes(term) ||
        service.shortDescription?.toLowerCase().includes(term),
    )
  }

  return filtered
}

export default async function SitePage({ params, searchParams }: Props) {
  const { siteSlug, slug } = await params
  const query = await searchParams
  const { site } = await getPublishedSite(siteSlug)

  const [servicesResult, page] = await Promise.all([
    getSiteServices(site.id),
    getPublishedPage(site.id, slug),
  ])

  if (!page) notFound()

  const services = filterServices(servicesResult.docs, query)
  const isShopPage = slug === 'bouquets'
  const isReservationPage = slug === 'reservation'
  const isContactPage = slug === 'contact'
  const heroImageUrl = getMediaUrl(page.heroImage)
  const eventTypes = ['delivery', 'wedding', 'funeral', 'other'] as const
  const defaultEventType = eventTypes.includes(query.type as (typeof eventTypes)[number])
    ? (query.type as (typeof eventTypes)[number])
    : 'delivery'

  return (
    <main className={`site-shell${isReservationPage ? ' reservation-page-shell' : ''}${isContactPage ? ' contact-page-shell' : ''}`}>
      {isReservationPage ? (
        <ReservationPage
          bookingSuccess={query.booking === 'success'}
          defaultEventType={defaultEventType}
          heroImageAlt={getMediaAlt(page.heroImage, page.title)}
          heroImageUrl={heroImageUrl}
          lead={page.excerpt || page.seo?.description || undefined}
          siteContact={site.contact}
          siteSlug={site.slug}
          title={page.title}
        />
      ) : isContactPage ? (
        <ContactPage
          contactSuccess={query.sent === '1'}
          heroImageAlt={getMediaAlt(page.heroImage, page.title)}
          heroImageUrl={heroImageUrl}
          lead={page.excerpt || page.seo?.description || undefined}
          siteContact={site.contact as never}
          siteName={site.name}
          siteSlug={site.slug}
          title={page.title}
        />
      ) : (
        <>
          <PageHeader
            eyebrow={isShopPage ? 'Boutique' : page.eyebrow || 'Page'}
            lead={page.excerpt || page.seo?.description || undefined}
            title={page.title}
            variant={isShopPage ? 'shop' : 'default'}
          >
            {isShopPage ? (
              <ShopFilters
                activeCategory={query.category}
                activeOccasion={query.occasion}
                activeQuery={query.q}
                resultCount={services.length}
                siteSlug={site.slug}
              />
            ) : null}
          </PageHeader>

          {isShopPage ? (
            <section className="shop-page">
              {services.length ? (
                <div className="product-grid">
                  {services.map((service) => (
                    <ProductCard key={service.id} service={service as never} siteSlug={site.slug} />
                  ))}
                </div>
              ) : (
                <div className="cart-empty">
                  <h2>Aucun produit trouvé</h2>
                  <p>Essayez un autre filtre ou une autre recherche.</p>
                  <a className="site-button" href={`/sites/${site.slug}/bouquets`}>
                    Voir tous les produits
                  </a>
                </div>
              )}
            </section>
          ) : (
            <BlockRenderer
              bookingSuccess={query.booking === 'success'}
              blocks={page.layout as never}
              heroImageAlt={getMediaAlt(page.heroImage, page.title)}
              heroImageUrl={heroImageUrl}
              services={services}
              siteSlug={site.slug}
            />
          )}
        </>
      )}
    </main>
  )
}
