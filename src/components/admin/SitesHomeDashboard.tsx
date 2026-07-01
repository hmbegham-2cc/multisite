'use client'

import React, { useEffect, useState } from 'react'

type SiteRow = {
  id: string
  name: string
  slug: string
  status?: string
}

export function SitesHomeDashboard() {
  const [sites, setSites] = useState<SiteRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSites() {
      try {
        const response = await fetch('/api/sites?limit=100&depth=0&sort=name')
        if (!response.ok) return
        const data = (await response.json()) as { docs?: SiteRow[] }
        setSites(data.docs ?? [])
      } finally {
        setLoading(false)
      }
    }

    void loadSites()
  }, [])

  return (
    <div style={{ display: 'grid', gap: 20, marginBottom: 32, padding: '4px 0 8px' }}>
      <div
        style={{
          padding: '24px 28px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #19351F 0%, #264b2d 100%)',
          color: '#fff',
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#d4e8c8',
          }}
        >
          Administration
        </p>
        <h2 style={{ margin: '0 0 10px', fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>
          Choisissez un site
        </h2>
        <p style={{ margin: 0, maxWidth: 720, fontSize: 15, lineHeight: 1.55, color: '#e8dfd2' }}>
          Tout se gère depuis la fiche du site. Les <strong>pages viennent du modèle</strong>{' '}
          choisi — pas de création manuelle. Cliquez sur un site ou ouvrez{' '}
          <a href="/admin/collections/sites" style={{ color: '#fff', fontWeight: 700 }}>
            Sites
          </a>
          .
        </p>
      </div>

      {loading ? <p style={{ margin: 0, fontSize: 14 }}>Chargement des sites…</p> : null}

      {!loading && sites.length === 0 ? (
        <a
          href="/admin/collections/sites/create"
          style={{
            display: 'inline-block',
            padding: '14px 20px',
            borderRadius: 10,
            background: '#19351F',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
            width: 'fit-content',
          }}
        >
          + Créer un premier site
        </a>
      ) : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 14,
        }}
      >
        {sites.map((site) => (
          <a
            href={`/admin/collections/sites/${site.id}`}
            key={site.id}
            style={{
              display: 'grid',
              gap: 8,
              padding: '18px 20px',
              borderRadius: 10,
              border: '1px solid var(--theme-elevation-150)',
              background: 'var(--theme-elevation-0)',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <strong style={{ fontSize: 17 }}>{site.name}</strong>
            <span style={{ fontSize: 13, color: 'var(--theme-elevation-700)' }}>/{site.slug}</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: site.status === 'published' ? 'var(--theme-success-500)' : 'var(--theme-warning-500)',
              }}
            >
              {site.status === 'published' ? 'En ligne' : 'Brouillon'}
            </span>
            <span style={{ fontSize: 13, color: 'var(--theme-elevation-800)' }}>
              Ouvrir → pages du modèle, produits, demandes
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
