import type { PayloadRequest } from 'payload'

const getRelationId = (value: unknown): string | undefined => {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in value) return String(value.id)
  return undefined
}

type TemplatePage = {
  blocksJson?: unknown
  excerpt?: string | null
  eyebrow?: string | null
  id?: string
  isHomepage?: boolean | null
  seo?: unknown
  slug?: string
  title?: string
}

type TemplateService = {
  badge?: string | null
  category?: string | null
  deliveryLabel?: string | null
  featured?: boolean | null
  imageUrl?: string | null
  order?: number | null
  price?: { currency?: string; from?: number; onRequest?: boolean } | null
  shortDescription?: string | null
  slug?: string
  title?: string
}

export type TemplateSyncResult = {
  pagesCreated: number
  servicesCreated: number
  pageSlugs: string[]
  serviceSlugs: string[]
}

export async function syncTemplateContentToSite({
  req,
  siteId,
  contentStatus,
  templateId: templateIdOverride,
}: {
  req: PayloadRequest
  siteId: string | number
  contentStatus?: 'draft' | 'published'
  templateId?: string
}): Promise<TemplateSyncResult> {
  const site = await req.payload.findByID({
    collection: 'sites',
    id: siteId,
    depth: 0,
    req,
  })

  const templateId = templateIdOverride ?? getRelationId(site.template)
  if (!templateId) {
    return { pagesCreated: 0, servicesCreated: 0, pageSlugs: [], serviceSlugs: [] }
  }

  const template = await req.payload.findByID({
    collection: 'templates',
    id: templateId,
    depth: 0,
    req,
  })

  const status = contentStatus ?? (site.status === 'published' ? 'published' : 'draft')
  const templatePages = (template.defaultPages || []) as TemplatePage[]
  const templateServices = (template.defaultServices || []) as TemplateService[]

  if (!templatePages.length && !templateServices.length) {
    return { pagesCreated: 0, servicesCreated: 0, pageSlugs: [], serviceSlugs: [] }
  }

  const [existingPages, existingServices] = await Promise.all([
    req.payload.find({
      collection: 'pages',
      where: { site: { equals: siteId } },
      limit: 100,
      depth: 0,
      select: { slug: true },
      req,
    }),
    req.payload.find({
      collection: 'services',
      where: { site: { equals: siteId } },
      limit: 100,
      depth: 0,
      select: { slug: true },
      req,
    }),
  ])

  const existingPageSlugs = new Set(existingPages.docs.map((page) => page.slug))
  const existingServiceSlugs = new Set(existingServices.docs.map((service) => service.slug))

  const pageSlugs: string[] = []
  const serviceSlugs: string[] = []

  await Promise.all(
    templatePages.map(async (page) => {
      if (!page.slug || !page.title || existingPageSlugs.has(page.slug)) return

      await req.payload.create({
        collection: 'pages',
        data: {
          site: siteId,
          title: page.title,
          slug: page.slug,
          eyebrow: page.eyebrow,
          excerpt: page.excerpt,
          isHomepage: page.isHomepage ?? false,
          layout: page.blocksJson as never,
          seo: page.seo as never,
          sourceTemplatePageId: page.id,
          contentScope: 'site',
          status,
        },
        overrideAccess: true,
        req,
      } as never)

      pageSlugs.push(page.slug)
    }),
  )

  await Promise.all(
    templateServices.map(async (service) => {
      if (!service.slug || !service.title || existingServiceSlugs.has(service.slug)) return

      await req.payload.create({
        collection: 'services',
        data: {
          site: siteId,
          title: service.title,
          slug: service.slug,
          category: (service.category || 'bouquets') as 'bouquets',
          badge: service.badge,
          deliveryLabel: service.deliveryLabel || "Livraison dès aujourd'hui",
          shortDescription: service.shortDescription,
          imageUrl: service.imageUrl,
          featured: service.featured ?? false,
          order: service.order ?? 0,
          price: service.price || { from: 29.9, currency: 'EUR', onRequest: false },
          status,
        },
        overrideAccess: true,
        req,
      } as never)

      serviceSlugs.push(service.slug)
    }),
  )

  return {
    pagesCreated: pageSlugs.length,
    servicesCreated: serviceSlugs.length,
    pageSlugs,
    serviceSlugs,
  }
}
