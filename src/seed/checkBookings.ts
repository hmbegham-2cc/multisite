import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

const payload = await getPayload({ config })

const bookings = await payload.find({
  collection: 'bookings',
  sort: '-createdAt',
  limit: 5,
})

payload.logger.info(`Bookings total: ${bookings.totalDocs}`)

for (const booking of bookings.docs) {
  payload.logger.info(`${booking.customerName} - ${booking.customerEmail}`)
}

await payload.destroy()
