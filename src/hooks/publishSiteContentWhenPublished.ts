import type { CollectionAfterChangeHook } from 'payload'

export const publishSiteContentWhenPublished: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if (doc.status !== 'published') return doc

  const justPublished = !previousDoc || previousDoc.status !== 'published'
  if (!justPublished) return doc

  const [draftPages, draftServices] = await Promise.all([
    req.payload.find({
      collection: 'pages',
      where: {
        and: [{ site: { equals: doc.id } }, { status: { equals: 'draft' } }],
      },
      limit: 100,
      req,
    }),
    req.payload.find({
      collection: 'services',
      where: {
        and: [{ site: { equals: doc.id } }, { status: { equals: 'draft' } }],
      },
      limit: 100,
      req,
    }),
  ])

  await Promise.all([
    ...draftPages.docs.map((page) =>
      req.payload.update({
        collection: 'pages',
        id: page.id,
        data: { status: 'published' },
        req,
      }),
    ),
    ...draftServices.docs.map((service) =>
      req.payload.update({
        collection: 'services',
        id: service.id,
        data: { status: 'published' },
        req,
      }),
    ),
  ])

  if (!doc.publishedAt) {
    await req.payload.update({
      collection: 'sites',
      id: doc.id,
      data: { publishedAt: new Date().toISOString() },
      req,
    })
  }

  return doc
}
