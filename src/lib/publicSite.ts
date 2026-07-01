import { cache } from 'react'
import { notFound } from 'next/navigation'
import type { Where } from 'payload'

import { getPayloadClient } from './payload'

export const getPublishedSite = cache(async (siteSlug: string) => {
  const payload = await getPayloadClient()

  const sites = await payload.find({
    collection: 'sites',
    where: {
      and: [{ slug: { equals: siteSlug } }, { status: { equals: 'published' } }],
    },
    depth: 0,
    limit: 1,
  })

  const site = sites.docs[0]
  if (!site) notFound()

  return { payload, site }
})

export const getSiteNavigation = cache(async (siteId: string | number) => {
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'pages',
    where: {
      and: [{ site: { equals: siteId } }, { status: { equals: 'published' } }],
    },
    sort: 'createdAt',
    limit: 20,
    depth: 0,
  })
})

export const getPublishedPage = cache(async (siteId: string | number, slug: string) => {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { site: { equals: siteId } },
        { slug: { equals: slug } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 0,
  })

  return result.docs[0] || null
})

export const getSiteServices = cache(async (siteId: string | number) => {
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'services',
    where: {
      and: [{ site: { equals: siteId } }, { status: { equals: 'published' } }],
    },
    depth: 0,
    sort: 'order',
    limit: 50,
  })
})

export const getPublishedService = cache(async (siteId: string | number, serviceSlug: string) => {
  const payload = await getPayloadClient()

  const result = await payload.find({
    collection: 'services',
    where: {
      and: [
        { site: { equals: siteId } },
        { slug: { equals: serviceSlug } },
        { status: { equals: 'published' } },
      ],
    },
    depth: 0,
    limit: 1,
  })

  return result.docs[0] || null
})

export const getRelatedServices = cache(
  async (siteId: string | number, category: string | null | undefined, excludeId: string | number) => {
    const payload = await getPayloadClient()

    const sameCategoryConditions: Where[] = [
        { site: { equals: siteId } },
        { status: { equals: 'published' } },
        { id: { not_equals: excludeId } },
    ]
    if (category) {
      sameCategoryConditions.push({ category: { equals: category } })
    }

    const sameCategory = await payload.find({
      collection: 'services',
      where: { and: sameCategoryConditions },
      depth: 0,
      sort: 'order',
      limit: 4,
    })

    if (sameCategory.docs.length >= 4) {
      return sameCategory.docs
    }

    const otherConditions: Where[] = [
      { site: { equals: siteId } },
      { status: { equals: 'published' } },
      { id: { not_equals: excludeId } },
    ]
    if (category) {
      otherConditions.push({ category: { not_equals: category } })
    }

    const others = await payload.find({
      collection: 'services',
      where: { and: otherConditions },
      depth: 0,
      sort: 'order',
      limit: 4 - sameCategory.docs.length,
    })

    return [...sameCategory.docs, ...others.docs]
  },
)
