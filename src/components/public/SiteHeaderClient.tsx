'use client'

import { Menu, Search, X } from 'lucide-react'
import { useState } from 'react'

import { CartLink } from '@/components/public/cart/CartLink'
import { SiteIcon } from '@/components/icons/SiteIcon'

type PageLink = {
  id: number | string
  slug: string
  title: string
}

const shopLinks = [
  { href: 'bouquets', label: 'Bouquets' },
  { href: 'mariage', label: 'Mariage' },
  { href: 'bouquets?category=cadeaux', label: 'Cadeaux' },
  { href: 'contact', label: 'Contact' },
  { href: 'reservation', label: 'Réservation' },
]

export function SiteHeaderClient({
  pages,
  siteName,
  siteSlug,
}: {
  pages: PageLink[]
  siteName: string
  siteSlug: string
}) {
  const [open, setOpen] = useState(false)

  const cmsLinks = pages
    .filter((page) => page.slug && page.title && !page.slug.includes('accueil'))
    .map((page) => ({
      href: page.slug,
      label: page.title,
    }))

  const navLinks = cmsLinks.length
    ? cmsLinks
    : shopLinks.map((link) => ({ href: link.href, label: link.label }))

  const uniqueLinks = navLinks.filter(
    (link, index, array) => array.findIndex((item) => item.href === link.href) === index,
  )

  return (
    <header className="header">
      <div className="header__bar">
        <a className="header__logo" href={`/sites/${siteSlug}`}>
          <span>{siteName}</span>
        </a>

        <nav aria-label="Navigation principale" className="header__nav">
          {uniqueLinks.map((link) => (
            <a href={`/sites/${siteSlug}/${link.href}`} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <form action={`/sites/${siteSlug}/bouquets`} className="header__search" role="search">
          <SiteIcon className="header__search-icon" icon={Search} size={18} />
          <input name="q" placeholder="Rechercher un bouquet..." type="search" />
          <button aria-label="Rechercher" type="submit">
            <SiteIcon icon={Search} size={18} />
          </button>
        </form>

        <div className="header__actions">
          <CartLink siteSlug={siteSlug} />
          <a className="header__cta" href={`/sites/${siteSlug}/checkout`}>
            Commander
          </a>
          <button
            aria-expanded={open}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="header__burger"
            type="button"
            onClick={() => setOpen((value) => !value)}
          >
            <SiteIcon icon={open ? X : Menu} size={20} />
          </button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Navigation mobile" className="header__mobile">
          {uniqueLinks.map((link) => (
            <a href={`/sites/${siteSlug}/${link.href}`} key={`mobile-${link.href}`}>
              {link.label}
            </a>
          ))}
          <a href={`/sites/${siteSlug}/panier`}>Mon panier</a>
          <a href={`/sites/${siteSlug}/checkout`}>Checkout</a>
        </nav>
      ) : null}
    </header>
  )
}
