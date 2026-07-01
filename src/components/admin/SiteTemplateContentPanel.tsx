'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import React, { useEffect, useRef, useState } from 'react'

type TemplatePageRow = {
  id?: string
  title: string
  slug: string
  isHomepage?: boolean | null
  status?: string
  assigned: boolean
}

type TemplateContentStatus = {
  templateName: string | null
  pages: TemplatePageRow[]
}

export function SiteTemplateContentPanel() {
  const { id } = useDocumentInfo()
  const [status, setStatus] = useState<TemplateContentStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const synced = useRef(false)

  useEffect(() => {
    if (!id) return

    let cancelled = false

    async function loadAndSync() {
      setLoading(true)
      try {
        let response = await fetch(`/api/admin/import-template-content?siteId=${id}`)
        if (!response.ok || cancelled) return

        let data = (await response.json()) as TemplateContentStatus
        const missing = data.pages.filter((page) => !page.assigned)

        if (missing.length > 0 && !synced.current) {
          synced.current = true
          await fetch('/api/admin/import-template-content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ siteId: id }),
          })
          response = await fetch(`/api/admin/import-template-content?siteId=${id}`)
          if (response.ok) {
            data = (await response.json()) as TemplateContentStatus
            if (!cancelled) {
              setMessage(`${missing.length} page(s) du modèle ont été assignées au site.`)
            }
          }
        }

        if (!cancelled) setStatus(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadAndSync()

    return () => {
      cancelled = true
    }
  }, [id])

  if (!id) {
    return (
      <div
        style={{
          padding: '16px 18px',
          borderRadius: 10,
          border: '1px dashed var(--theme-elevation-250)',
          background: 'var(--theme-elevation-50)',
          marginBottom: 20,
          fontSize: 13,
        }}
      >
        Onglet <strong>Identité</strong> → choisissez le <strong>modèle</strong>, enregistrez le
        site : toutes les pages seront assignées ici automatiquement.
      </div>
    )
  }

  const assignedPages = status?.pages.filter((page) => page.assigned) ?? []
  const missingPages = status?.pages.filter((page) => !page.assigned) ?? []

  return (
    <div
      style={{
        padding: '18px 20px',
        borderRadius: 10,
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-50)',
        marginBottom: 24,
      }}
    >
      <strong style={{ display: 'block', fontSize: 16, marginBottom: 6 }}>
        Pages assignées depuis le modèle
      </strong>
      <p style={{ margin: '0 0 16px', fontSize: 13, lineHeight: 1.55, color: 'var(--theme-elevation-800)' }}>
        {status?.templateName
          ? `Modèle « ${status.templateName} » — ${assignedPages.length} page(s) sur ${status.pages.length}. Cliquez pour modifier le contenu.`
          : 'Associez un modèle dans Identité puis enregistrez le site.'}
      </p>

      {loading ? <p style={{ margin: '0 0 12px', fontSize: 13 }}>Assignation des pages…</p> : null}
      {message ? (
        <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--theme-success-500)' }}>{message}</p>
      ) : null}

      {assignedPages.length > 0 ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {assignedPages.map((page) => (
            <li key={page.slug}>
              <a
                href={page.id ? `/admin/collections/pages/${page.id}` : undefined}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'var(--theme-elevation-0)',
                  border: '1px solid var(--theme-elevation-100)',
                  color: 'inherit',
                  textDecoration: 'none',
                  fontSize: 13,
                }}
              >
                <span>
                  <strong>{page.title}</strong>
                  {page.isHomepage ? ' · accueil' : ''}
                  <span style={{ color: 'var(--theme-elevation-600)' }}> /{page.slug}</span>
                </span>
                <span style={{ color: 'var(--theme-success-500)', fontWeight: 700 }}>
                  {page.status === 'published' ? 'Publié' : 'Modifier →'}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      {!loading && missingPages.length > 0 ? (
        <p style={{ margin: '12px 0 0', fontSize: 13, color: 'var(--theme-warning-500)' }}>
          {missingPages.length} page(s) manquante(s) — enregistrez à nouveau le site ou changez de
          modèle dans Identité.
        </p>
      ) : null}
    </div>
  )
}
