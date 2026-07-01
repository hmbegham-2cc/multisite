'use client'

import { Check, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

import { useCart } from '@/components/public/cart/CartProvider'
import { SiteIcon } from '@/components/icons/SiteIcon'

type Props = {
  imageUrl?: string
  priceLabel: string
  serviceId: string | number
  title: string
  unitPrice: number | null
}

export function AddToCartButton({
  imageUrl,
  priceLabel,
  serviceId,
  title,
  unitPrice,
}: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  return (
    <button
      className="product-add-button"
      type="button"
      onClick={() => {
        addItem({
          serviceId: String(serviceId),
          title,
          unitPrice,
          imageUrl,
        })
        setAdded(true)
        window.setTimeout(() => setAdded(false), 1800)
      }}
    >
      {added ? (
        <>
          <SiteIcon icon={Check} size={16} />
          Ajouté
        </>
      ) : (
        <>
          <SiteIcon icon={ShoppingCart} size={16} />
          {`Ajouter · ${priceLabel}`}
        </>
      )}
    </button>
  )
}
