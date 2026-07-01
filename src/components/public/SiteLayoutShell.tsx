import type { ReactNode } from 'react'

import { CartProvider } from '@/components/public/cart/CartProvider'
import { SiteFooter } from '@/components/public/SiteFooter'
import { SiteNav } from '@/components/public/SiteNav'
import { getPublishedSite, getSiteNavigation } from '@/lib/publicSite'
import { getSiteThemeStyle } from '@/lib/siteTheme'

export async function SiteLayoutShell({
  children,
  siteSlug,
}: {
  children: ReactNode
  siteSlug: string
}) {
  const { site } = await getPublishedSite(siteSlug)
  const pages = await getSiteNavigation(site.id)
  const themeStyle = getSiteThemeStyle(site.theme)

  return (
    <CartProvider siteSlug={site.slug}>
      <div className="site-layout" style={themeStyle}>
        <SiteNav
          pages={pages.docs}
          siteContact={site.contact}
          siteName={site.name}
          siteSlug={site.slug}
        />
        {children}
        <SiteFooter
          pages={pages.docs}
          siteContact={site.contact}
          siteName={site.name}
          siteSlug={site.slug}
          socialLinks={site.socialLinks}
        />
      </div>
    </CartProvider>
  )
}
