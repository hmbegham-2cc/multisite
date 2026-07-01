import { AddToCartButton } from '@/components/public/cart/AddToCartButton'
import { getProductUrl } from '@/lib/products'
import { formatServiceUnitPrice } from '@/lib/cart/types'

export type ProductService = {
  badge?: null | string
  category?: null | string
  deliveryLabel?: null | string
  id: number | string
  image?: null | number | string | { alt?: null | string; url?: null | string }
  imageUrl?: null | string
  price?: null | {
    currency?: null | string
    from?: null | number
    onRequest?: null | boolean
    to?: null | number
  }
  featured?: null | boolean
  shortDescription?: null | string
  slug: string
  title: string
}

const fallbackImage =
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85'

const categoryLabels: Record<string, string> = {
  bouquets: 'Bouquets de fleurs',
  mariage: 'Mariage',
  naissance: 'Naissance',
  amour: 'Amour',
  deuil: 'Deuil',
  cadeaux: 'Fleurs et cadeaux',
}

export function ProductCard({
  service,
  siteSlug,
}: {
  service: ProductService
  siteSlug: string
}) {
  const price = formatServiceUnitPrice(service.price)
  const imageUrl = getServiceImageUrl(service)
  const category = categoryLabels[service.category || ''] || 'Bouquets de fleurs'
  const productHref = getProductUrl(siteSlug, service.slug)

  return (
    <article className="product-card">
      <a className="product-card__media" href={productHref}>
        {service.badge ? <span className="product-badge">{service.badge}</span> : null}
        <img alt={getServiceImageAlt(service)} src={imageUrl} />
        <span className="product-discover">Découvrir</span>
      </a>
      <div className="product-card__body">
        <p className="product-category">{category}</p>
        <h3 className="product-card__title">
          <a href={productHref}>{service.title}</a>
        </h3>
        <p className="product-delivery">{service.deliveryLabel || "Livraison dès aujourd'hui"}</p>
        <div className="product-card__footer">
          <strong className="product-card__price">{formatPrice(service.price)}</strong>
          <AddToCartButton
            imageUrl={imageUrl}
            priceLabel={price.label}
            serviceId={service.id}
            title={service.title}
            unitPrice={price.unitPrice}
          />
        </div>
      </div>
    </article>
  )
}

function formatPrice(price: ProductService['price']) {
  if (!price || price.onRequest) return 'Sur devis'
  const formatter = new Intl.NumberFormat('fr-FR', {
    currency: price.currency || 'EUR',
    style: 'currency',
  })

  if (typeof price.from === 'number' && typeof price.to === 'number') {
    return `${formatter.format(price.from)} - ${formatter.format(price.to)}`
  }

  if (typeof price.from === 'number') {
    return `à partir de ${formatter.format(price.from)}`
  }

  return 'Sur devis'
}

function getServiceImageUrl(service: ProductService) {
  if (service.image && typeof service.image === 'object' && service.image.url) {
    return service.image.url
  }
  return service.imageUrl || fallbackImage
}

function getServiceImageAlt(service: ProductService) {
  if (service.image && typeof service.image === 'object' && service.image.alt) {
    return service.image.alt
  }
  return service.title
}
