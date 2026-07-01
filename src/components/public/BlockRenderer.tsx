import { ArrowRight, CalendarDays, Clock3, Leaf, Search, Sparkles, Truck } from 'lucide-react'

import { BookingForm } from '@/components/public/BookingForm'
import { ProductCard } from '@/components/public/ProductCard'
import { ProductRail } from '@/components/public/ProductRail'
import { SiteIcon } from '@/components/icons/SiteIcon'

type Service = {
  badge?: null | string
  category?: null | string
  deliveryLabel?: null | string
  id: number | string
  image?: null | number | string | { alt?: null | string; url?: null | string }
  imageUrl?: null | string
  price?: null | {
    currency?: null | string
    from?: null | number
    onRequest?: null | boolean
    to?: null | number
  }
  featured?: null | boolean
  shortDescription?: null | string
  slug: string
  title: string
}

type Block = {
  blockType?: string
  ctaHref?: string
  ctaLabel?: string
  eyebrow?: string
  imageUrl?: string
  images?: string[]
  subtitle?: string
  text?: string
  title?: string
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1400&q=85',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85',
]

const categoryLinks = [
  {
    href: 'bouquets',
    image: fallbackImages[2],
    label: 'Bouquets de fleurs',
    text: 'Trouvez le bouquet idéal pour chaque occasion.',
  },
  {
    href: 'bouquets?category=diy',
    image: fallbackImages[0],
    label: 'Bouquets DIY',
    text: 'Composez vous-même votre bouquet en 3 formats.',
  },
  {
    href: 'bouquets?category=click-collect',
    image: fallbackImages[1],
    label: 'Click & Collect',
    text: 'Commandez en ligne, retirez en 3h à l\'atelier.',
  },
  {
    href: 'bouquets?category=fleurs-francaises',
    image: fallbackImages[3],
    label: 'Fleurs françaises',
    text: 'Cultivées et assemblées en France.',
  },
]

const occasions = [
  'Anniversaire',
  'Mariage',
  'Naissance',
  'Amour',
  'Remerciements',
  'Deuil',
]

export function BlockRenderer({
  blocks,
  bookingSuccess,
  heroImageAlt,
  heroImageUrl,
  services,
  siteSlug,
}: {
  blocks?: Block[] | null
  bookingSuccess?: boolean
  heroImageAlt?: string
  heroImageUrl?: string
  services?: Service[]
  siteSlug: string
}) {
  const validServices = (services || []).filter((service) => service?.id && service.title)

  if (!blocks?.length) {
    return (
      <section className="site-section">
        <p className="site-kicker">Contenu</p>
        <h2>Page en cours de personnalisation</h2>
      </section>
    )
  }

  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.blockType || 'block'}-${index}`

        if (block.blockType === 'hero') {
          return (
            <section className="home-hero cms-hero" key={key}>
              <div className="home-hero__copy">
                <p className="site-kicker">
                  <SiteIcon icon={Sparkles} size={14} />
                  {block.eyebrow || "L'art floral"}
                </p>
                <h1>{block.title}</h1>
                <p className="home-hero__lead">{block.subtitle}</p>
                {block.ctaHref && block.ctaLabel ? (
                  <div className="home-hero__actions">
                    <a className="site-button" href={`/sites/${siteSlug}${block.ctaHref}`}>
                      {block.ctaLabel}
                      <SiteIcon icon={ArrowRight} size={18} />
                    </a>
                  </div>
                ) : null}
                <div className="hero-service-row" aria-label="Garanties">
                  <span>33 ans d&apos;expertise</span>
                  <span>Livraison 7j/7</span>
                  <span>Livraison rapide en 3h</span>
                  <span>Fraîcheur garantie</span>
                </div>
              </div>
              <div className="home-hero__media">
                <img
                  alt={heroImageAlt || block.title || ''}
                  src={heroImageUrl || block.imageUrl || fallbackImages[0]}
                />
                <div className="home-hero__badge">
                  <SiteIcon icon={Clock3} size={22} />
                  <div>
                    <strong>Dès aujourd&apos;hui</strong>
                    <span>Préparé par votre artisan fleuriste local</span>
                  </div>
                </div>
              </div>
            </section>
          )
        }

        if (block.blockType === 'occasion-finder') {
          return (
            <section className="home-occasions cms-occasions" key={key}>
              <div className="home-occasions__intro">
                <p className="site-kicker">{block.eyebrow || 'Trop facile'}</p>
                <h2>{block.title || 'Choisir le bon cadeau fleuri'}</h2>
                <p className="home-section__lead">
                  Saisissez quelques mots-clés ou sélectionnez une occasion pour trouver le bouquet
                  parfait.
                </p>
              </div>
              <form className="home-occasions__search" action={`/sites/${siteSlug}/bouquets`}>
                <label>
                  Que recherchez-vous ?
                  <span className="home-occasions__search-field">
                    <SiteIcon icon={Search} size={18} />
                    <input name="q" placeholder="Roses, anniversaire, livraison..." type="search" />
                  </span>
                </label>
                <button type="submit">
                  <SiteIcon icon={Search} size={18} />
                  Rechercher
                </button>
              </form>
              <div className="home-occasions__pills">
                <span className="home-occasions__pills-label">Occasion</span>
                {occasions.map((occasion) => (
                  <a href={`/sites/${siteSlug}/bouquets?occasion=${occasion}`} key={occasion}>
                    {occasion}
                  </a>
                ))}
              </div>
            </section>
          )
        }

        if (block.blockType === 'services-grid') {
          const showcase = validServices
            .filter((service) => service.featured !== false)
            .slice(0, 8)
          const products = showcase.length ? showcase : validServices.slice(0, 8)

          return (
            <section className="home-section home-products cms-products" key={key}>
              <div className="home-section__head">
                <div>
                  <p className="site-kicker">{block.eyebrow || 'Top ventes'}</p>
                  <h2>{block.title || 'Top ventes'}</h2>
                  <p className="home-section__lead">
                    Bienvenue dans notre univers fleuri. Découvrez les incontournables qui font
                    vibrer les cœurs, saison après saison.
                  </p>
                </div>
                <a className="site-link-button" href={`/sites/${siteSlug}/bouquets`}>
                  Tout voir
                  <SiteIcon icon={ArrowRight} size={16} />
                </a>
              </div>
              {products.length ? (
                <ProductRail services={products} siteSlug={siteSlug} />
              ) : (
                <p className="home-section__lead">Catalogue en cours de préparation.</p>
              )}
            </section>
          )
        }

        if (block.blockType === 'featured-products') {
          const featured = validServices.filter((service) => service.featured !== false).slice(0, 8)
          return (
            <section className="home-section home-products cms-products" key={key}>
              <div className="home-section__head">
                <div>
                  <p className="site-kicker">{block.eyebrow || 'Collection'}</p>
                  <h2>{block.title || 'Les fleurs de saison'}</h2>
                  <p className="home-section__lead">à cueillir maintenant</p>
                </div>
                <a className="site-link-button" href={`/sites/${siteSlug}/bouquets`}>
                  Voir la collection
                  <SiteIcon icon={ArrowRight} size={16} />
                </a>
              </div>
              {featured.length ? (
                <ProductRail services={featured} siteSlug={siteSlug} />
              ) : null}
            </section>
          )
        }

        if (block.blockType === 'category-tiles') {
          return (
            <section className="home-section home-categories cms-categories" key={key}>
              <div className="home-section__head home-section__head--center">
                <div>
                  <p className="site-kicker">{block.eyebrow || 'Rayons'}</p>
                  <h2>{block.title || 'Trouvez le bouquet idéal pour chaque occasion'}</h2>
                </div>
              </div>
              <div className="home-category-grid">
                {categoryLinks.map((category) => (
                  <a
                    className="home-category-card"
                    href={`/sites/${siteSlug}/${category.href}`}
                    key={category.href}
                  >
                    <img alt="" src={category.image} />
                    <span className="home-category-card__label">{category.label}</span>
                    <span className="home-category-card__text">{category.text}</span>
                  </a>
                ))}
              </div>
            </section>
          )
        }

        if (block.blockType === 'reassurance') {
          const items = [
            { icon: Truck, value: '33 ans', label: "d'expertise dans la livraison de fleurs" },
            { icon: CalendarDays, value: '7j/7', label: '365 jours par an' },
            { icon: Clock3, value: '3h', label: 'livraison rapide' },
            { icon: Leaf, value: '100%', label: 'fraîcheur des végétaux garantie' },
          ]

          return (
            <section aria-label="Nos engagements" className="home-trust cms-trust" key={key}>
              {items.map((item) => (
                <div className="home-trust__item" key={item.value}>
                  <span className="trust-icon">
                    <SiteIcon icon={item.icon} size={22} />
                  </span>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </section>
          )
        }

        if (block.blockType === 'text-image') {
          return (
            <section className="text-image-band" key={key}>
              <img alt="" src={block.imageUrl || fallbackImages[1]} />
              <div>
                <p className="site-kicker">{block.eyebrow || 'Savoir-faire'}</p>
                <h2>{block.title}</h2>
                <p>{block.text}</p>
                <a className="site-button site-button--ghost-light" href={`/sites/${siteSlug}/contact`}>
                  Qui sommes-nous ?
                </a>
              </div>
            </section>
          )
        }

        if (block.blockType === 'gallery') {
          const images = block.images?.length ? block.images : fallbackImages

          return (
            <section className="gallery-band" key={key}>
              <div className="site-section-heading">
                <p className="site-kicker">{block.eyebrow || 'Galerie'}</p>
                <h2>{block.title || 'Inspiration florale'}</h2>
              </div>
              <div className="gallery-grid">
                {images.slice(0, 3).map((image, imageIndex) => (
                  <img alt="" key={image} src={image} className={`gallery-image-${imageIndex}`} />
                ))}
              </div>
            </section>
          )
        }

        if (block.blockType === 'booking-form') {
          return (
            <section className="booking-band" key={key}>
              <div className="booking-intro">
                <p className="site-kicker">Réservation</p>
                <h2>{block.title || 'Demande sur mesure'}</h2>
                <p>
                  Mariage, deuil ou création personnalisée : décrivez votre besoin. Pour une
                  commande rapide, utilisez le panier et le checkout.
                </p>
                <a className="site-button site-button--ghost" href={`/sites/${siteSlug}/checkout`}>
                  Passer commande
                </a>
              </div>
              <BookingForm bookingSuccess={bookingSuccess} siteSlug={siteSlug} />
            </section>
          )
        }

        if (block.blockType === 'contact-info') {
          return (
            <section className="site-section contact-info-block" key={key}>
              <p className="site-kicker">Contact</p>
              <h2>{block.title || 'Nous sommes joignables 7j/7'}</h2>
              <p className="site-muted">
                Du lundi au samedi de 9h à 19h. Commandez en ligne ou contactez l&apos;atelier
                pour un conseil personnalisé.
              </p>
              <div className="contact-info-actions">
                <a className="site-button" href={`/sites/${siteSlug}/panier`}>
                  Mon panier
                </a>
                <a className="site-button site-button--ghost" href={`/sites/${siteSlug}/checkout`}>
                  Checkout
                </a>
              </div>
            </section>
          )
        }

        return (
          <section className="site-section" key={key}>
            <p className="site-kicker">{block.blockType || 'Section'}</p>
            <h2>{block.title || 'Section'}</h2>
          </section>
        )
      })}
    </>
  )
}

