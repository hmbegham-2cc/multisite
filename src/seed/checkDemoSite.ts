import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

console.log('Demo check: starting Payload')
const payload = await getPayload({ config })
console.log('Demo check: Payload ready')

const sites = await payload.find({
  collection: 'sites',
  where: {
    slug: {
      equals: 'fleuriste-martin',
    },
  },
  limit: 1,
})

const site = sites.docs[0]

if (!site) {
  payload.logger.error('Demo site not found')
  await payload.destroy()
  console.log('Demo check: Payload destroyed')
  process.exitCode = 1
  process.exit(1)
} else {
  const pages = await payload.find({
    collection: 'pages',
    where: {
      site: {
        equals: site.id,
      },
    },
    limit: 20,
  })

  const services = await payload.find({
    collection: 'services',
    where: {
      and: [
        { site: { equals: site.id } },
        { status: { equals: 'published' } },
      ],
    },
    limit: 20,
  })

  payload.logger.info(
    `Demo site check: ${site.slug}, pages=${pages.totalDocs}, services=${services.totalDocs}`,
  )

  await payload.destroy()
  console.log('Demo check: Payload destroyed')
  process.exit(0)
}
