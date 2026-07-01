'use client'

import { CalendarDays, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useCart } from '@/components/public/cart/CartProvider'
import { SiteIcon } from '@/components/icons/SiteIcon'
import {
  buildCalendarDays,
  formatEuro,
  resolveProductAddOns,
  resolveProductGallery,
  resolveProductVariants,
  type ProductDetailService,
} from '@/lib/productDetail'

type TabId = 'composition' | 'delivery' | 'description'

export function ProductDetailClient({
  composition,
  deliveryDetails,
  deliveryFeeFrom,
  descriptionHtml,
  imageAlt,
  reference,
  service,
  siteSlug,
  sku,
}: {
  composition?: string | null
  deliveryDetails?: string | null
  deliveryFeeFrom?: number | null
  descriptionHtml?: React.ReactNode
  imageAlt: string
  reference?: string | null
  service: ProductDetailService
  siteSlug: string
  sku?: string | null
}) {
  const { addItem } = useCart()
  const gallery = resolveProductGallery(service, imageAlt)
  const variants = resolveProductVariants(service)
  const addOns = resolveProductAddOns(service)

  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<TabId>('description')
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || '')
  const [addOnQty, setAddOnQty] = useState<Record<string, number>>({})
  const [monthOffset, setMonthOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [locality, setLocality] = useState('')
  const [localityError, setLocalityError] = useState('')
  const [added, setAdded] = useState(false)

  const selectedVariant = variants.find((item) => item.id === selectedVariantId) || variants[0]
  const calendar = useMemo(() => buildCalendarDays(monthOffset), [monthOffset])

  const addOnTotal = addOns.reduce((sum, item) => {
    const qty = addOnQty[item.id] || 0
    return sum + item.price * qty
  }, 0)

  const bouquetPrice = selectedVariant?.price || 0
  const unitTotal = bouquetPrice + addOnTotal
  const deliveryFee = deliveryFeeFrom ?? 9.95

  const selectedAddOnLabels = addOns
    .filter((item) => (addOnQty[item.id] || 0) > 0)
    .map((item) => `${item.title} x${addOnQty[item.id]}`)

  function updateAddOn(id: string, delta: number) {
    setAddOnQty((current) => {
      const next = Math.max(0, (current[id] || 0) + delta)
      return { ...current, [id]: next }
    })
  }

  function handleOrder() {
    if (!locality.trim()) {
      setLocalityError('Saisissez une ville ou un code postal.')
      return
    }

    setLocalityError('')

    const titleParts = [service.title]
    if (selectedVariant?.code) titleParts.push(`(${selectedVariant.code})`)
    if (selectedAddOnLabels.length) titleParts.push(`+ ${selectedAddOnLabels.join(', ')}`)

    addItem({
      imageUrl: gallery[activeImage]?.url,
      serviceId: String(service.id),
      title: titleParts.join(' '),
      unitPrice: unitTotal,
    })

    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className="pdp">
      <div className="pdp__layout">
        <div className="pdp__col pdp__col--gallery">
          <div className="pdp__main-image">
            {service.badge ? <span className="product-badge">{service.badge}</span> : null}
            <img alt={gallery[activeImage]?.alt || imageAlt} src={gallery[activeImage]?.url} />
          </div>
          {gallery.length > 1 ? (
            <div className="pdp__thumbs" role="tablist" aria-label="Images du produit">
              {gallery.map((image, index) => (
                <button
                  aria-label={`Voir l'image ${index + 1}`}
                  aria-selected={index === activeImage}
                  className={index === activeImage ? 'is-active' : undefined}
                  key={image.url}
                  role="tab"
                  type="button"
                  onClick={() => setActiveImage(index)}
                >
                  <img alt="" src={image.url} />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="pdp__col pdp__col--options">
          <h1 className="pdp__title">{service.title}</h1>
          <section className="pdp__block">
            <h2 className="pdp__block-title">Je choisis ma formule :</h2>
            <div className="pdp__variants">
              {variants.map((variant) => (
                <label className="pdp__variant" key={variant.id}>
                  <input
                    checked={selectedVariantId === variant.id}
                    name="variant"
                    type="radio"
                    value={variant.id}
                    onChange={() => setSelectedVariantId(variant.id)}
                  />
                  <span className="pdp__variant-copy">
                    <strong>{formatEuro(variant.price)}</strong>
                    <span>({variant.label})</span>
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="pdp__col pdp__col--checkout">
          <section className="pdp__checkout">
            <h2 className="pdp__block-title">Ma livraison :</h2>
            <p className="pdp__delivery-note">
              Ce produit sera livré par un transporteur.{' '}
              <a href={`/sites/${siteSlug}/livraison`}>En savoir plus sur la livraison</a>
            </p>

            <label className="pdp__field">
              Localité de livraison *
              {localityError ? <span className="pdp__field-error">Erreur {localityError}</span> : null}
              <input
                placeholder="Code postal ou ville"
                type="text"
                value={locality}
                onChange={(event) => {
                  setLocality(event.target.value)
                  if (event.target.value.trim()) setLocalityError('')
                }}
              />
            </label>

            <div className="pdp__calendar">
              <div className="pdp__calendar-head">
                <span className="pdp__calendar-label">
                  <SiteIcon icon={CalendarDays} size={16} />
                  Quand *
                </span>
                <div className="pdp__calendar-nav">
                  <button
                    aria-label="Mois précédent"
                    type="button"
                    onClick={() => setMonthOffset((value) => value - 1)}
                  >
                    <SiteIcon icon={ChevronLeft} size={18} />
                  </button>
                  <strong>{calendar.monthLabel}</strong>
                  <button
                    aria-label="Mois suivant"
                    type="button"
                    onClick={() => setMonthOffset((value) => value + 1)}
                  >
                    <SiteIcon icon={ChevronRight} size={18} />
                  </button>
                </div>
              </div>
              <div className="pdp__calendar-grid">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <span className="pdp__calendar-weekday" key={day}>
                    {day}
                  </span>
                ))}
                {calendar.cells.map((cell) =>
                  cell.date ? (
                    <button
                      className={
                        selectedDate?.toDateString() === cell.date.toDateString()
                          ? 'is-selected'
                          : undefined
                      }
                      disabled={cell.disabled}
                      key={cell.key}
                      type="button"
                      onClick={() => setSelectedDate(cell.date)}
                    >
                      {cell.date.getDate()}
                    </button>
                  ) : (
                    <span className="pdp__calendar-empty" key={cell.key} />
                  ),
                )}
              </div>
            </div>

            <p className="pdp__warning">
              Attention : ce produit n&apos;est pas livrable en Corse et DROM-COM
            </p>
            <p className="pdp__same-day">
              Vous souhaitez un bouquet livré aujourd&apos;hui ?{' '}
              <a href={`/sites/${siteSlug}/bouquets`}>Cliquez ici</a>
            </p>

            <div className="pdp__order-bar">
              <span className="pdp__order-price">{formatEuro(unitTotal)}</span>
              <button className="site-button pdp__order-btn" type="button" onClick={handleOrder}>
                {added ? 'Ajouté' : 'Commander'}
                <SiteIcon icon={ChevronRight} size={18} />
              </button>
            </div>
          </section>
        </div>
      </div>

      <section aria-label="Options complémentaires" className="pdp__extras">
        <header className="pdp__extras-head">
          <div>
            <h2 className="pdp__extras-title">J&apos;ajoute une petite attention</h2>
            <p className="pdp__extras-lead">Optionnel — complétez votre bouquet avec une touche en plus</p>
          </div>
          {addOnTotal > 0 ? (
            <span className="pdp__extras-badge">+ {formatEuro(addOnTotal)}</span>
          ) : null}
        </header>
        <ul className="pdp__extras-grid">
          {addOns.map((item) => {
            const qty = addOnQty[item.id] || 0

            return (
              <li className={qty > 0 ? 'pdp__extra-card is-selected' : 'pdp__extra-card'} key={item.id}>
                <div className="pdp__extra-card-body">
                  <span className="pdp__extra-title">{item.title}</span>
                  <strong className="pdp__extra-price">+ {formatEuro(item.price)}</strong>
                </div>
                {qty === 0 ? (
                  <button
                    className="pdp__extra-add"
                    type="button"
                    onClick={() => updateAddOn(item.id, 1)}
                  >
                    <SiteIcon icon={Plus} size={14} />
                    Ajouter
                  </button>
                ) : (
                  <div className="pdp__extra-qty">
                    <button
                      aria-label={`Diminuer ${item.title}`}
                      type="button"
                      onClick={() => updateAddOn(item.id, -1)}
                    >
                      <SiteIcon icon={Minus} size={14} />
                    </button>
                    <span>{qty}</span>
                    <button
                      aria-label={`Augmenter ${item.title}`}
                      type="button"
                      onClick={() => updateAddOn(item.id, 1)}
                    >
                      <SiteIcon icon={Plus} size={14} />
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <div className="pdp__tabs">
        <div className="pdp__tab-list" role="tablist">
          {(
            [
              ['description', 'Description'],
              ['delivery', 'Livraison'],
              ['composition', 'Composition'],
            ] as const
          ).map(([id, label]) => (
            <button
              aria-selected={activeTab === id}
              className={activeTab === id ? 'is-active' : undefined}
              key={id}
              role="tab"
              type="button"
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="pdp__tab-panel">
          {activeTab === 'description' ? (
            <div className="pdp__tab-content">
              {descriptionHtml || (
                <p>
                  {service.shortDescription ||
                    'Bouquet composé avec soin par nos artisans fleuristes, prêt à offrir.'}
                </p>
              )}
            </div>
          ) : null}

          {activeTab === 'delivery' ? (
            <div className="pdp__tab-content">
              <p>
                {deliveryDetails ||
                  'La livraison de ce produit est assurée par un transporteur dans un colis du lundi au samedi de 8h à 19h.'}
              </p>
              <p>
                En cas d&apos;absence du destinataire, celui-ci sera recontacté par le transporteur.
                Assurez-vous de la présence du destinataire au moment de la livraison.
              </p>
              <p>
                Attention, la livraison n&apos;est pas possible dans un cimetière ou un lieu de
                culte.
              </p>
              <p>
                Frais de livraison à partir de : <strong>{formatEuro(deliveryFee)}</strong>
              </p>
            </div>
          ) : null}

          {activeTab === 'composition' ? (
            <div className="pdp__tab-content">
              <p>
                {composition ||
                  'Bouquet composé de fleurs fraîches sélectionnées et préparé par nos artisans fleuristes.'}
              </p>
              {reference ? <p>Référence : {reference}</p> : null}
              {sku ? <p>SKU : {sku}</p> : null}
            </div>
          ) : null}

          <div className="pdp__legal">
            <p>
              Votre arrangement floral, composé de fleurs fraîches, sera réalisé à votre intention
              par notre équipe quelques minutes avant son départ de l&apos;atelier.
            </p>
            <p>* Champs obligatoires.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
