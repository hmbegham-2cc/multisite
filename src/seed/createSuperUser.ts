import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

const email = 'raoul@usine-a-site.local'
const password = 'multisite2026!'

const payload = await getPayload({ config })

const existing = await payload.find({
  collection: 'users',
  where: {
    email: {
      equals: email,
    },
  },
  limit: 1,
})

if (existing.docs[0]) {
  await payload.update({
    collection: 'users',
    id: existing.docs[0].id,
    data: {
      role: 'super-admin',
      firstName: 'Raoul',
      password,
    },
    overrideAccess: true,
  })

  payload.logger.info(`Super-admin updated: ${email}`)
} else {
  await payload.create({
    collection: 'users',
    data: {
      email,
      password,
      role: 'super-admin',
      firstName: 'Raoul',
    },
    overrideAccess: true,
  })

  payload.logger.info(`Super-admin created: ${email}`)
}

await payload.destroy()
