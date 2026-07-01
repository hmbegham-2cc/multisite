'use client'

import React from 'react'

const cards = [
  {
    href: '/admin/collections/sites',
    title: 'Mon site',
    text: 'Nom, couleurs, logo, contact, réseaux sociaux et SEO.',
  },
  {
    href: '/admin/collections/pages',
    title: 'Pages',
    text: 'Accueil, boutique, mariage, réservation, contact…',
  },
  {
    href: '/admin/collections/services',
    title: 'Produits',
    text: 'Bouquets, prix, formules S/M/L, options et photos.',
  },
  {
    href: '/admin/collections/bookings',
    title: 'Demandes',
    text: 'Réservations, devis et messages clients.',
  },
  {
    href: '/admin/collections/media',
    title: 'Médias',
    text: 'Photos et visuels de votre boutique.',
  },
]

export function SiteOwnerDashboard() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        marginBottom: 32,
        padding: '4px 0 8px',
      }}
    >
      <div
        style={{
          padding: '24px 28px',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #19351F 0%, #264b2d 100%)',
          color: '#fff',
        }}
      >
        <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d4e8c8' }}>
          Espace fleuriste
        </p>
        <h2 style={{ margin: '0 0 10px', fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>
          Gérez votre site complet
        </h2>
        <p style={{ margin: 0, maxWidth: 720, fontSize: 15, lineHeight: 1.55, color: '#e8dfd2' }}>
          Ajoutez ou retirez des pages et des produits, modifiez vos prix, consultez les demandes
          clients. Passez le statut de votre site en <strong>Publié</strong> pour mettre en ligne
          toutes les pages en brouillon.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 14,
        }}
      >
        {cards.map((card) => (
          <a
            href={card.href}
            key={card.href}
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
            <strong style={{ fontSize: 16 }}>{card.title}</strong>
            <span style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--theme-elevation-800)' }}>
              {card.text}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
