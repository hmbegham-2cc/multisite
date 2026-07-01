import { RichText } from '@payloadcms/richtext-lexical/react'

import { ProductDetailClient } from '@/components/public/ProductDetailClient'
import { ProductCard } from '@/components/public/ProductCard'
import { getMediaAlt, getMediaUrl } from '@/lib/media'
import { getCategoryLabel } from '@/lib/products'
import type { ProductDetailService } from '@/lib/productDetail'

type Service = ProductDetailService

export function ProductDetailView({
  related,
  service,
  siteSlug,
}: {
  related: Service[]
  service: Service
  siteSlug: string
}) {
  const imageAlt = getMediaAlt(service.image as never, service.title)
  const category = getCategoryLabel(service.category)

  return (
    <div className="product-detail">
      <nav aria-label="Fil d'Ariane" className="breadcrumbs">
        <a href={`/sites/${siteSlug}`}>Accueil</a>
        <span>/</span>
        <a href={`/sites/${siteSlug}/bouquets`}>{category}</a>
        <span>/</span>
        <span>{service.title}</span>
      </nav>

      <ProductDetailClient
        composition={service.composition}
        deliveryDetails={service.deliveryDetails}
        deliveryFeeFrom={service.deliveryFeeFrom}
        descriptionHtml={
          service.description ? (
            <div className="rich-text">
              <RichText data={service.description as never} />
            </div>
          ) : null
        }
        imageAlt={imageAlt}
        reference={service.reference}
        service={service}
        siteSlug={siteSlug}
        sku={service.sku}
      />

      <section className="pdp__related">
        <div className="pdp__related-head">
          <h2>Ces produits pourraient vous intéresser</h2>
        </div>
        {related.length ? (
          <div className="product-grid">
            {related.slice(0, 4).map((item) => (
              <ProductCard key={item.id} service={item} siteSlug={siteSlug} />
            ))}
          </div>
        ) : (
          <p className="pdp__related-empty">
            Découvrez bientôt d&apos;autres créations florales dans notre boutique.
          </p>
        )}
      </section>
    </div>
  )
}
