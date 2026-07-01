import { notFound } from 'next/navigation'

import { ProductDetailView } from '@/components/public/ProductDetailView'
import {
  getPublishedService,
  getPublishedSite,
  getRelatedServices,
} from '@/lib/publicSite'

export const revalidate = 60

type Props = {
  params: Promise<{ siteSlug: string; serviceSlug: string }>
}

export default async function ProductPage({ params }: Props) {
  const { siteSlug, serviceSlug } = await params
  const { site } = await getPublishedSite(siteSlug)

  const service = await getPublishedService(site.id, serviceSlug)
  if (!service) notFound()

  const related = await getRelatedServices(site.id, service.category, service.id)

  return (
    <main className="site-shell">
      <section className="product-page">
        <ProductDetailView related={related as never} service={service as never} siteSlug={site.slug} />
      </section>
    </main>
  )
}
