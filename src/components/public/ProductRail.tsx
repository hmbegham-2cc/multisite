'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

import { ProductCard, type ProductService } from '@/components/public/ProductCard'
import { SiteIcon } from '@/components/icons/SiteIcon'

export function ProductRail({
  services,
  siteSlug,
}: {
  services: ProductService[]
  siteSlug: string
}) {
  const railRef = useRef<HTMLDivElement>(null)

  function scroll(direction: 'left' | 'right') {
    const rail = railRef.current
    if (!rail) return
    const amount = direction === 'left' ? -rail.clientWidth * 0.85 : rail.clientWidth * 0.85
    rail.scrollBy({ behavior: 'smooth', left: amount })
  }

  return (
    <div className="product-rail-wrap">
      <button
        aria-label="Produits précédents"
        className="product-rail-nav product-rail-nav--prev"
        type="button"
        onClick={() => scroll('left')}
      >
        <SiteIcon icon={ChevronLeft} size={24} />
      </button>
      <div className="product-rail" ref={railRef}>
        {services.map((service) => (
          <div className="product-rail__item" key={service.id}>
            <ProductCard service={service} siteSlug={siteSlug} />
          </div>
        ))}
      </div>
      <button
        aria-label="Produits suivants"
        className="product-rail-nav product-rail-nav--next"
        type="button"
        onClick={() => scroll('right')}
      >
        <SiteIcon icon={ChevronRight} size={24} />
      </button>
    </div>
  )
}
