import { redirect } from 'next/navigation'
import { z } from 'zod'

import { getPayloadClient } from '@/lib/payload'

const bookingSchema = z.object({
  budget: z.preprocess(
    (value) => (value === '' || value === undefined ? undefined : Number(value)),
    z.number().nonnegative().optional(),
  ),
  customerEmail: z.string().email(),
  customerName: z.string().min(2),
  customerPhone: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliverySlot: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.enum(['morning', 'afternoon', 'evening']).optional(),
  ),
  eventDate: z.string().optional(),
  eventType: z.enum(['delivery', 'wedding', 'funeral', 'other']).optional(),
  message: z.string().min(5),
  siteSlug: z.string().min(1),
  returnPath: z.enum(['contact', 'reservation']).optional(),
})

export async function POST(request: Request) {
  const formData = await request.formData()
  const data = bookingSchema.parse(Object.fromEntries(formData))
  const payload = await getPayloadClient()

  const sites = await payload.find({
    collection: 'sites',
    where: {
      slug: {
        equals: data.siteSlug,
      },
      status: {
        equals: 'published',
      },
    },
    limit: 1,
  })

  const site = sites.docs[0]
  if (!site) {
    return Response.json({ error: 'Site not found' }, { status: 404 })
  }

  await payload.create({
    collection: 'bookings',
    data: {
      site: site.id,
      status: 'pending',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      budget: data.budget,
      deliveryAddress: data.deliveryAddress || undefined,
      deliverySlot: data.deliverySlot,
      eventDate: data.eventDate || undefined,
      eventType: data.eventType || 'delivery',
      message: data.message,
      sourcePage: request.headers.get('referer') || undefined,
      submittedAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })

  const returnPath = data.returnPath === 'contact' ? 'contact' : 'reservation'
  const successQuery = returnPath === 'contact' ? 'sent=1' : 'booking=success'

  redirect(`/sites/${data.siteSlug}/${returnPath}?${successQuery}`)
}
