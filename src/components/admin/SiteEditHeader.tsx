'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import React from 'react'

export function SiteEditHeader() {
  const { id, data } = useDocumentInfo()
  const name = typeof data?.name === 'string' ? data.name : undefined
  const slug = typeof data?.slug === 'string' ? data.slug : undefined
  const status = typeof data?.status === 'string' ? data.status : undefined

  if (!id) {
    return (
      <div
        style={{
          marginBottom: 24,
          padding: '16px 18px',
          borderRadius: 10,
          border: '1px dashed var(--theme-elevation-250)',
          background: 'var(--theme-elevation-50)',
        }}
      >
        <strong style={{ display: 'block', marginBottom: 6 }}>Nouveau site</strong>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
          Choisissez un <strong>modèle</strong>, puis <strong>Enregistrer</strong> : toutes les pages
          (Accueil, Bouquets, Contact…) seront créées automatiquement dans l’onglet Contenu.
        </p>
      </div>
    )
  }

  const publicUrl = slug ? `/sites/${slug}` : null

  return (
    <div
      style={{
        marginBottom: 24,
        padding: '18px 20px',
        borderRadius: 10,
        border: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-50)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <strong style={{ display: 'block', fontSize: 18, marginBottom: 4 }}>{name || 'Site'}</strong>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--theme-elevation-800)' }}>
          Onglet <strong>Contenu</strong> → pages assignées depuis le modèle. Cliquez une page pour
          modifier son contenu.
          {status !== 'published' ? ' Passez le statut en Publié (Identité) pour mettre en ligne.' : null}
        </p>
      </div>
      {publicUrl ? (
        <a
          href={publicUrl}
          rel="noreferrer"
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            background: '#19351F',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
            textDecoration: 'none',
          }}
          target="_blank"
        >
          Voir le site public
        </a>
      ) : null}
    </div>
  )
}
