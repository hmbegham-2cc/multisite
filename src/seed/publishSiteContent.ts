import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

const siteSlug = process.argv[2]

if (!siteSlug) {
  console.error('Usage: npm run seed:publish-site -- <site-slug>')
  process.exit(1)
}

const payload = await getPayload({ config })

const sites = await payload.find({
  collection: 'sites',
  where: { slug: { equals: siteSlug } },
  limit: 1,
})

const site = sites.docs[0]
if (!site) {
  console.error(`Site introuvable: ${siteSlug}`)
  process.exit(1)
}

await payload.update({
  collection: 'sites',
  id: site.id,
  data: { status: 'published', publishedAt: new Date().toISOString() },
})

const [pages, services] = await Promise.all([
  payload.find({
    collection: 'pages',
    where: { site: { equals: site.id } },
    limit: 100,
  }),
  payload.find({
    collection: 'services',
    where: { site: { equals: site.id } },
    limit: 100,
  }),
])

for (const page of pages.docs) {
  if (page.status !== 'published') {
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: { status: 'published' },
    })
  }
}

for (const service of services.docs) {
  if (service.status !== 'published') {
    await payload.update({
      collection: 'services',
      id: service.id,
      data: { status: 'published' },
    })
  }
}

console.log(`Site ${siteSlug} publié: ${pages.docs.length} pages, ${services.docs.length} produits traités.`)
