'use client'

import { ShoppingBag } from 'lucide-react'

import { useCart } from '@/components/public/cart/CartProvider'
import { SiteIcon } from '@/components/icons/SiteIcon'

export function CartLink({ siteSlug }: { siteSlug: string }) {
  const { itemCount } = useCart()

  return (
    <a className="site-cart-link" href={`/sites/${siteSlug}/panier`}>
      <SiteIcon icon={ShoppingBag} size={18} />
      <span>Panier</span>
      {itemCount > 0 ? <span className="site-cart-badge">{itemCount}</span> : null}
    </a>
  )
}
