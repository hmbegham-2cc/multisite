'use client'

import { useState } from 'react'

import { useCart } from '@/components/public/cart/CartProvider'

export function ProductAddToCartPanel({
  imageUrl,
  priceLabel,
  serviceId,
  title,
  unitPrice,
}: {
  imageUrl?: string
  priceLabel: string
  serviceId: string | number
  title: string
  unitPrice: number | null
}) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  return (
    <div className="product-add-panel">
      <div className="product-qty">
        <button
          aria-label="Diminuer"
          type="button"
          onClick={() => setQuantity((value) => Math.max(1, value - 1))}
        >
          −
        </button>
        <span>{quantity}</span>
        <button
          aria-label="Augmenter"
          type="button"
          onClick={() => setQuantity((value) => value + 1)}
        >
          +
        </button>
      </div>
      <button
        className="site-button product-add-panel-cta"
        type="button"
        onClick={() => {
          addItem(
            {
              serviceId: String(serviceId),
              title,
              unitPrice,
              imageUrl,
            },
            quantity,
          )
          setAdded(true)
          window.setTimeout(() => setAdded(false), 2000)
        }}
      >
        {added ? 'Ajouté au panier' : `Ajouter au panier · ${priceLabel}`}
      </button>
    </div>
  )
}
