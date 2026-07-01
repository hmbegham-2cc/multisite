'use client'

import Link from 'next/link'

import { useCart } from '@/components/public/cart/CartProvider'
import { formatCartPrice, getLineTotal } from '@/lib/cart/types'

export function CartPageContent({ siteSlug }: { siteSlug: string }) {
  const { hasUnknownPrice, items, removeItem, total, updateQuantity } = useCart()

  if (!items.length) {
    return (
      <section className="cart-empty">
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des bouquets ou compositions avant de passer commande.</p>
        <Link className="site-button" href={`/sites/${siteSlug}/bouquets`}>
          Voir la boutique
        </Link>
      </section>
    )
  }

  return (
    <div className="cart-layout">
      <section className="cart-items">
        <h2>Articles ({items.length})</h2>
        <ul className="cart-list">
          {items.map((item) => {
            const lineTotal = getLineTotal(item)
            return (
              <li className="cart-line" key={item.serviceId}>
                {item.imageUrl ? (
                  <img alt="" className="cart-line-image" src={item.imageUrl} />
                ) : (
                  <div className="cart-line-image cart-line-image--placeholder" />
                )}
                <div className="cart-line-body">
                  <strong>{item.title}</strong>
                  <span>{formatCartPrice(item.unitPrice)} / unité</span>
                  <div className="cart-line-qty">
                    <button
                      aria-label="Diminuer la quantité"
                      type="button"
                      onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label="Augmenter la quantité"
                      type="button"
                      onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-line-side">
                  <strong>{formatCartPrice(lineTotal)}</strong>
                  <button
                    className="cart-line-remove"
                    type="button"
                    onClick={() => removeItem(item.serviceId)}
                  >
                    Retirer
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <aside className="cart-summary">
        <h2>Récapitulatif</h2>
        <div className="cart-summary-row">
          <span>Sous-total</span>
          <strong>{hasUnknownPrice ? 'Sur devis partiel' : formatCartPrice(total)}</strong>
        </div>
        <div className="cart-summary-row">
          <span>Livraison</span>
          <strong>Calculée à l&apos;étape suivante</strong>
        </div>
        <div className="cart-summary-total">
          <span>Total estimé</span>
          <strong>{hasUnknownPrice ? 'Devis à confirmer' : formatCartPrice(total)}</strong>
        </div>
        <Link className="site-button cart-summary-cta" href={`/sites/${siteSlug}/checkout`}>
          Passer au checkout
        </Link>
        <Link className="cart-summary-link" href={`/sites/${siteSlug}/bouquets`}>
          Continuer mes achats
        </Link>
      </aside>
    </div>
  )
}
