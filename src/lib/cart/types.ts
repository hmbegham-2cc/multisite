export type CartItem = {
  serviceId: string
  title: string
  quantity: number
  unitPrice: number | null
  imageUrl?: string
}

export type CartState = {
  items: CartItem[]
}

export function getCartStorageKey(siteSlug: string) {
  return `usine-cart-${siteSlug}`
}

export function getLineTotal(item: CartItem) {
  if (item.unitPrice == null) return null
  return item.unitPrice * item.quantity
}

export function getCartTotal(items: CartItem[]) {
  let total = 0
  let hasUnknown = false

  for (const item of items) {
    const line = getLineTotal(item)
    if (line == null) {
      hasUnknown = true
      continue
    }
    total += line
  }

  return { total, hasUnknown }
}

export function formatCartPrice(amount: number | null) {
  if (amount == null) return 'Sur devis'
  return new Intl.NumberFormat('fr-FR', {
    currency: 'EUR',
    style: 'currency',
  }).format(amount)
}

export function formatServiceUnitPrice(price?: {
  currency?: null | string
  from?: null | number
  onRequest?: null | boolean
  to?: null | number
} | null) {
  if (!price || price.onRequest) return { label: 'Sur devis', unitPrice: null }
  if (typeof price.from === 'number') {
    return {
      label: formatCartPrice(price.from),
      unitPrice: price.from,
    }
  }
  return { label: 'Sur devis', unitPrice: null }
}
