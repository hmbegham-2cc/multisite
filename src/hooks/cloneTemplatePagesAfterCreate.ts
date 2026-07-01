import type { CollectionAfterChangeHook } from 'payload'

import { syncTemplateContentToSite } from '@/lib/syncTemplateContent'

const getRelationId = (value: unknown): string | undefined => {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in value) return String(value.id)
  return undefined
}

export const SKIP_TEMPLATE_SYNC = 'skipTemplateSync'

export const cloneTemplatePagesAfterCreate: CollectionAfterChangeHook = async ({
  context,
  doc,
  operation,
  previousDoc,
  req,
}) => {
  if (context?.[SKIP_TEMPLATE_SYNC]) return doc

  const templateId = getRelationId(doc.template)
  if (!templateId) return doc

  const previousTemplateId = getRelationId(previousDoc?.template)
  const isNewSite = operation === 'create'
  const templateChanged = operation === 'update' && previousTemplateId !== templateId
  const contentStatus = doc.status === 'published' ? 'published' : 'draft'

  const result = await syncTemplateContentToSite({
    req,
    siteId: doc.id,
    contentStatus,
    templateId,
  })

  if (isNewSite || templateChanged || result.pagesCreated > 0) {
    const template = await req.payload.findByID({
      collection: 'templates',
      id: templateId,
      depth: 0,
      req,
    })

    await req.payload.update({
      collection: 'sites',
      id: doc.id,
      data: {
        theme: template.defaultTheme,
        clonedFromTemplateAt: new Date().toISOString(),
      },
      req,
      context: {
        [SKIP_TEMPLATE_SYNC]: true,
      },
    })
  }

  return doc
}
