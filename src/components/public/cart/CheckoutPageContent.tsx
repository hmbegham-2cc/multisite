'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useCart } from '@/components/public/cart/CartProvider'
import { formatCartPrice, getLineTotal } from '@/lib/cart/types'

type DeliveryData = {
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  eventDate: string
  deliverySlot: 'morning' | 'afternoon' | 'evening'
  message: string
  paymentMethod: 'on-delivery' | 'online-link'
}

const emptyDelivery: DeliveryData = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  deliveryAddress: '',
  eventDate: '',
  deliverySlot: 'morning',
  message: '',
  paymentMethod: 'on-delivery',
}

export function CheckoutPageContent({
  siteSlug,
  success,
}: {
  siteSlug: string
  success?: boolean
}) {
  const router = useRouter()
  const { clearCart, hasUnknownPrice, items, total } = useCart()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [delivery, setDelivery] = useState<DeliveryData>(emptyDelivery)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (success) {
    return (
      <section className="checkout-success">
        <p className="site-kicker">Commande confirmée</p>
        <h2>Merci, votre commande est enregistrée</h2>
        <p>
          L&apos;atelier vous contacte sous 24h pour confirmer la livraison, le créneau
          et le paiement.
        </p>
        <Link className="site-button" href={`/sites/${siteSlug}`}>
          Retour à l&apos;accueil
        </Link>
      </section>
    )
  }

  if (!items.length) {
    return (
      <section className="cart-empty">
        <h2>Aucun article à commander</h2>
        <p>Ajoutez des produits à votre panier avant le checkout.</p>
        <Link className="site-button" href={`/sites/${siteSlug}/bouquets`}>
          Parcourir la boutique
        </Link>
      </section>
    )
  }

  function updateDelivery<K extends keyof DeliveryData>(key: K, value: DeliveryData[K]) {
    setDelivery((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (step === 1) {
      setStep(2)
      return
    }

    if (step === 2) {
      if (
        !delivery.customerName ||
        !delivery.customerEmail ||
        !delivery.customerPhone ||
        !delivery.deliveryAddress ||
        !delivery.eventDate
      ) {
        setError('Complétez tous les champs de livraison.')
        return
      }
      setError(null)
      setStep(3)
      return
    }

    if (!consent) {
      setError('Veuillez accepter d’être contacté pour confirmer la commande.')
      return
    }

    setSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.set('siteSlug', siteSlug)
    formData.set('customerName', delivery.customerName)
    formData.set('customerEmail', delivery.customerEmail)
    formData.set('customerPhone', delivery.customerPhone)
    formData.set('deliveryAddress', delivery.deliveryAddress)
    formData.set('eventDate', delivery.eventDate)
    formData.set('deliverySlot', delivery.deliverySlot)
    formData.set('message', delivery.message)
    formData.set('paymentMethod', delivery.paymentMethod)
    formData.set(
      'orderItems',
      JSON.stringify(
        items.map((item) => ({
          serviceId: item.serviceId,
          title: item.title,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          lineTotal: getLineTotal(item),
        })),
      ),
    )
    formData.set('orderTotal', String(total))

    try {
      const response = await fetch('/api/checkout', {
        body: formData,
        method: 'POST',
        redirect: 'follow',
      })

      if (response.redirected) {
        clearCart()
        router.push(response.url)
        return
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setError(payload?.error || 'Impossible de finaliser la commande.')
        return
      }

      clearCart()
      router.push(`/sites/${siteSlug}/checkout?success=1`)
    } catch {
      setError('Erreur réseau. Réessayez dans un instant.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="checkout-layout">
      <nav aria-label="Étapes de commande" className="checkout-steps">
        {[
          [1, 'Panier'],
          [2, 'Livraison'],
          [3, 'Confirmation'],
        ].map(([value, label]) => (
          <button
            className={step === value ? 'is-active' : undefined}
            key={value}
            type="button"
            onClick={() => setStep(value as 1 | 2 | 3)}
          >
            <span>{value}</span> {label}
          </button>
        ))}
      </nav>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit}>
          {error ? <p className="checkout-error">{error}</p> : null}

          {step === 1 ? (
            <section>
              <h2>Votre panier</h2>
              <ul className="checkout-cart-list">
                {items.map((item) => (
                  <li key={item.serviceId}>
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <strong>{formatCartPrice(getLineTotal(item))}</strong>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="checkout-fields">
              <h2>Livraison & contact</h2>
              <label>
                Nom complet
                <input
                  required
                  type="text"
                  value={delivery.customerName}
                  onChange={(event) => updateDelivery('customerName', event.target.value)}
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={delivery.customerEmail}
                  onChange={(event) => updateDelivery('customerEmail', event.target.value)}
                />
              </label>
              <label>
                Téléphone
                <input
                  required
                  type="tel"
                  value={delivery.customerPhone}
                  onChange={(event) => updateDelivery('customerPhone', event.target.value)}
                />
              </label>
              <label>
                Adresse de livraison
                <textarea
                  required
                  rows={3}
                  value={delivery.deliveryAddress}
                  onChange={(event) => updateDelivery('deliveryAddress', event.target.value)}
                />
              </label>
              <label>
                Date souhaitée
                <input
                  required
                  type="date"
                  value={delivery.eventDate}
                  onChange={(event) => updateDelivery('eventDate', event.target.value)}
                />
              </label>
              <label>
                Créneau
                <select
                  value={delivery.deliverySlot}
                  onChange={(event) =>
                    updateDelivery('deliverySlot', event.target.value as DeliveryData['deliverySlot'])
                  }
                >
                  <option value="morning">Matin (9h - 12h)</option>
                  <option value="afternoon">Après-midi (14h - 18h)</option>
                  <option value="evening">Soir (18h - 20h)</option>
                </select>
              </label>
              <label>
                Message pour l&apos;atelier
                <textarea
                  rows={4}
                  value={delivery.message}
                  onChange={(event) => updateDelivery('message', event.target.value)}
                  placeholder="Étage, code, instructions..."
                />
              </label>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="checkout-fields">
              <h2>Confirmation & paiement</h2>
              <p className="checkout-note">
                Paiement à la livraison (CB ou espèces) ou lien de paiement sécurisé envoyé
                par email après validation de l&apos;atelier.
              </p>
              <label>
                Mode de paiement souhaité
                <select
                  value={delivery.paymentMethod}
                  onChange={(event) =>
                    updateDelivery(
                      'paymentMethod',
                      event.target.value as DeliveryData['paymentMethod'],
                    )
                  }
                >
                  <option value="on-delivery">Paiement à la livraison</option>
                  <option value="online-link">Recevoir un lien de paiement</option>
                </select>
              </label>
              <label className="checkout-consent">
                <input
                  checked={consent}
                  type="checkbox"
                  onChange={(event) => setConsent(event.target.checked)}
                />
                J&apos;accepte d&apos;être contacté pour confirmer ma commande.
              </label>
            </section>
          ) : null}

          <button className="site-button" disabled={submitting} type="submit">
            {submitting
              ? 'Envoi en cours…'
              : step === 3
                ? 'Confirmer la commande'
                : step === 2
                  ? 'Vérifier ma commande'
                  : 'Continuer vers la livraison'}
          </button>
        </form>

        <aside className="checkout-summary">
          <h2>Total commande</h2>
          <ul className="checkout-cart-list">
            {items.map((item) => (
              <li key={item.serviceId}>
                <span>
                  {item.title} × {item.quantity}
                </span>
                <strong>{formatCartPrice(getLineTotal(item))}</strong>
              </li>
            ))}
          </ul>
          <div className="cart-summary-total">
            <span>Total estimé</span>
            <strong>{hasUnknownPrice ? 'Devis à confirmer' : formatCartPrice(total)}</strong>
          </div>
          <Link className="cart-summary-link" href={`/sites/${siteSlug}/panier`}>
            Modifier le panier
          </Link>
        </aside>
      </div>
    </div>
  )
}
