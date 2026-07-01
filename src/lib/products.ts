const categoryLabels: Record<string, string> = {
  bouquets: 'Bouquets de fleurs',
  mariage: 'Mariage',
  naissance: 'Naissance',
  amour: 'Amour',
  deuil: 'Deuil',
  cadeaux: 'Fleurs et cadeaux',
}

export type ProductPrice = {
  currency?: null | string
  from?: null | number
  onRequest?: null | boolean
  to?: null | number
} | null

export function getProductUrl(siteSlug: string, serviceSlug: string) {
  return `/sites/${siteSlug}/produit/${serviceSlug}`
}

export function getCategoryLabel(category?: null | string) {
  if (!category) return 'Bouquets de fleurs'
  return categoryLabels[category] || category
}

export function formatProductPrice(price: ProductPrice) {
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

export function getUnitPrice(price: ProductPrice) {
  if (!price || price.onRequest || typeof price.from !== 'number') return null
  return price.from
}
