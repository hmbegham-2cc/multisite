import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { createLocalReq } from 'payload'

import type { User } from '@/payload-types'
import { syncTemplateContentToSite } from '@/lib/syncTemplateContent'
import { getPayloadClient } from '@/lib/payload'

function getSiteIds(user: User) {
  return (user.sites || [])
    .map((site) => (typeof site === 'number' ? String(site) : String(site.id)))
    .filter(Boolean) as string[]
}

function canManageSite(user: User, siteId: string) {
  if (user.role === 'super-admin' || user.role === 'internal-manager') return true
  if (user.role === 'viewer') return false
  return getSiteIds(user).includes(siteId)
}

async function getAuthedUser() {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await headers() })
  return { payload, user: user as User | null }
}

export async function GET(request: Request) {
  const { payload, user } = await getAuthedUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const siteId = new URL(request.url).searchParams.get('siteId')
  if (!siteId) {
    return NextResponse.json({ error: 'siteId requis' }, { status: 400 })
  }

  if (!canManageSite(user, siteId)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const site = await payload.findByID({
    collection: 'sites',
    id: siteId,
    depth: 0,
  })

  const templateId =
    typeof site.template === 'object' && site.template && 'id' in site.template
      ? String(site.template.id)
      : typeof site.template === 'string'
        ? site.template
        : null

  if (!templateId) {
    return NextResponse.json({
      templateName: null,
      pages: [],
      services: [],
    })
  }

  const template = await payload.findByID({
    collection: 'templates',
    id: templateId,
    depth: 0,
  })

  const [existingPages, existingServices] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { site: { equals: siteId } },
      limit: 100,
      depth: 0,
      select: {
        slug: true,
        status: true,
      },
    }),
    payload.find({
      collection: 'services',
      where: { site: { equals: siteId } },
      limit: 100,
      depth: 0,
      select: {
        slug: true,
      },
    }),
  ])

  const pagesBySlug = new Map(
    existingPages.docs.map((page) => [
      page.slug,
      { id: String(page.id), status: page.status as string | undefined },
    ]),
  )
  const serviceSlugs = new Set(existingServices.docs.map((service) => service.slug))

  return NextResponse.json({
    templateName: template.name,
    pages: (template.defaultPages || []).map((page) => {
      const assigned = pagesBySlug.get(page.slug)

      return {
        id: assigned?.id,
        title: page.title,
        slug: page.slug,
        isHomepage: page.isHomepage,
        status: assigned?.status,
        assigned: Boolean(assigned),
      }
    }),
    services: (template.defaultServices || []).map((service) => ({
      title: service.title,
      slug: service.slug,
      assigned: serviceSlugs.has(service.slug),
    })),
  })
}

export async function POST(request: Request) {
  const { payload, user } = await getAuthedUser()
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const body = (await request.json()) as { siteId?: string }
  const siteId = body.siteId

  if (!siteId) {
    return NextResponse.json({ error: 'siteId requis' }, { status: 400 })
  }

  if (!canManageSite(user, siteId)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const site = await payload.findByID({
    collection: 'sites',
    id: siteId,
    depth: 0,
  })

  const req = await createLocalReq({ user }, payload)

  const result = await syncTemplateContentToSite({
    req,
    siteId,
    contentStatus: site.status === 'published' ? 'published' : 'draft',
  })

  return NextResponse.json({
    ok: true,
    ...result,
  })
}
