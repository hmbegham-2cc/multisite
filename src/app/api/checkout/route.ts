import { redirect } from 'next/navigation'
import { z } from 'zod'

import { getPayloadClient } from '@/lib/payload'

const orderItemSchema = z.object({
  serviceId: z.string(),
  title: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nullable(),
  lineTotal: z.number().nullable(),
})

const checkoutSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(2),
  customerPhone: z.string().min(6),
  deliveryAddress: z.string().min(5),
  deliverySlot: z.enum(['morning', 'afternoon', 'evening']).optional(),
  eventDate: z.string().min(1),
  message: z.string().optional(),
  orderItems: z.array(orderItemSchema).min(1),
  orderTotal: z.coerce.number().optional(),
  paymentMethod: z.enum(['on-delivery', 'online-link']).optional(),
  siteSlug: z.string().min(1),
})

export async function POST(request: Request) {
  const formData = await request.formData()
  const raw = Object.fromEntries(formData)

  let orderItems: z.infer<typeof orderItemSchema>[] = []
  try {
    orderItems = JSON.parse(String(raw.orderItems || '[]'))
  } catch {
    return Response.json({ error: 'Panier invalide' }, { status: 400 })
  }

  const data = checkoutSchema.parse({
    ...raw,
    orderItems,
  })

  const payload = await getPayloadClient()

  const sites = await payload.find({
    collection: 'sites',
    where: {
      slug: { equals: data.siteSlug },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const site = sites.docs[0]
  if (!site) {
    return Response.json({ error: 'Site not found' }, { status: 404 })
  }

  const itemsSummary = data.orderItems
    .map(
      (item) =>
        `- ${item.title} x${item.quantity}${item.lineTotal != null ? ` (${item.lineTotal.toFixed(2)} EUR)` : ''}`,
    )
    .join('\n')

  const fullMessage = [
    data.message?.trim(),
    '',
    '--- Commande panier ---',
    itemsSummary,
    '',
    `Adresse: ${data.deliveryAddress}`,
    `Créneau: ${data.deliverySlot || 'morning'}`,
    `Paiement: ${data.paymentMethod || 'on-delivery'}`,
    data.orderTotal != null ? `Total estimé: ${data.orderTotal.toFixed(2)} EUR` : '',
  ]
    .filter(Boolean)
    .join('\n')

  await payload.create({
    collection: 'bookings',
    data: {
      site: site.id,
      status: 'pending',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      eventDate: data.eventDate,
      eventType: 'delivery',
      message: fullMessage,
      deliveryAddress: data.deliveryAddress,
      deliverySlot: data.deliverySlot || 'morning',
      paymentMethod: data.paymentMethod || 'on-delivery',
      orderItems: data.orderItems,
      orderTotal: data.orderTotal,
      budget: data.orderTotal,
      sourcePage: request.headers.get('referer') || undefined,
      submittedAt: new Date().toISOString(),
    },
    overrideAccess: true,
  })

  redirect(`/sites/${data.siteSlug}/checkout?success=1`)
}
