import { getMediaUrl } from '@/lib/media'
import { formatCartPrice } from '@/lib/cart/types'

export type ProductAddOn = {
  id: string
  price: number
  title: string
}

export type ProductVariant = {
  code: string
  id: string
  label: string
  price: number
}

export type ProductGalleryImage = {
  alt: string
  url: string
}

export type ProductDetailService = {
  addOns?: { price?: number | null; title?: string | null }[] | null
  badge?: null | string
  category?: null | string
  composition?: null | string
  deliveryDetails?: null | string
  deliveryFeeFrom?: null | number
  deliveryLabel?: null | string
  description?: unknown
  gallery?: { imageUrl?: null | string }[] | null
  id: number | string
  image?: null | number | string | { alt?: null | string; url?: null | string }
  imageUrl?: null | string
  price?: {
    currency?: null | string
    from?: null | number
    onRequest?: null | boolean
    to?: null | number
  } | null
  reference?: null | string
  shortDescription?: null | string
  sku?: null | string
  slug: string
  title: string
  variants?: { code?: null | string; label?: string | null; price?: number | null }[] | null
}

const defaultAddOns: ProductAddOn[] = [
  { id: 'vase', title: 'Vase', price: 5 },
  { id: 'amandes', title: "Amandes Maxim's", price: 11 },
  { id: 'rochers', title: "Rochers Maxim's", price: 11 },
  { id: 'chocolats', title: 'Chocolats artisanaux', price: 9.5 },
  { id: 'carte', title: 'Carte message personnalisée', price: 3.5 },
  { id: 'lego', title: 'LEGO - TOURNESOLS', price: 14.99 },
  { id: 'ours', title: 'Ours blanc', price: 12 },
  { id: 'bougie', title: 'Bouquet bougies tournesol', price: 12.5 },
]

const fallbackGallery = [
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85',
]

export function resolveProductAddOns(service: ProductDetailService): ProductAddOn[] {
  const fromCms = (service.addOns || [])
    .filter((item) => item?.title && typeof item.price === 'number')
    .map((item, index) => ({
      id: `addon-${index}`,
      title: item.title!,
      price: item.price!,
    }))

  return fromCms.length ? fromCms : defaultAddOns
}

export function resolveProductVariants(service: ProductDetailService): ProductVariant[] {
  const fromCms = (service.variants || [])
    .filter((item) => item?.label && typeof item.price === 'number')
    .map((item, index) => ({
      id: `variant-${index}`,
      label: item.label!,
      code: item.code || item.label!.slice(0, 1).toUpperCase(),
      price: item.price!,
    }))

  if (fromCms.length) return fromCms

  const base = service.price?.from
  if (typeof base !== 'number') {
    return [{ id: 'variant-s', label: 'Format standard', code: 'S', price: 0 }]
  }

  return [
    { id: 'variant-s', label: `${service.title} S`, code: 'S', price: base },
    { id: 'variant-m', label: `${service.title} M`, code: 'M', price: Math.round(base * 1.25 * 100) / 100 },
    { id: 'variant-l', label: `${service.title} L`, code: 'L', price: Math.round(base * 1.65 * 100) / 100 },
  ]
}

export function resolveProductGallery(service: ProductDetailService, alt: string): ProductGalleryImage[] {
  const main = getMediaUrl(service.image as never) || service.imageUrl || fallbackGallery[0]
  const fromCms = (service.gallery || [])
    .map((item) => item.imageUrl)
    .filter(Boolean) as string[]

  const urls = fromCms.length ? [...fromCms] : [...fallbackGallery]

  if (!urls.includes(main)) {
    urls.unshift(main)
  }

  return urls.slice(0, 6).map((url, index) => ({
    url,
    alt: `${alt} ${index + 1}`,
  }))
}

export function formatEuro(amount: number) {
  return formatCartPrice(amount)
}

export function buildCalendarDays(monthOffset = 0) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const view = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const monthLabel = view.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const startDay = (view.getDay() + 6) % 7
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()

  const cells: { date: Date | null; disabled: boolean; key: string }[] = []

  for (let i = 0; i < startDay; i += 1) {
    cells.push({ date: null, disabled: true, key: `empty-${i}` })
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(view.getFullYear(), view.getMonth(), day)
    cells.push({
      date,
      disabled: date < today,
      key: date.toISOString(),
    })
  }

  return { cells, monthLabel, monthOffset }
}
