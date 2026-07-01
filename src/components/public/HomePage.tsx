import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Heart,
  Leaf,
  Search,
  Sparkles,
  Truck,
} from 'lucide-react'

import { ProductRail } from '@/components/public/ProductRail'
import type { ProductService } from '@/components/public/ProductCard'
import { SiteIcon } from '@/components/icons/SiteIcon'

const fallbackHero =
  'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1600&q=85'

const categories = [
  {
    href: 'bouquets',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85',
    label: 'Bouquets',
  },
  {
    href: 'mariage',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85',
    label: 'Mariage',
  },
  {
    href: 'bouquets?category=naissance',
    image:
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85',
    label: 'Naissance',
  },
  {
    href: 'bouquets?category=cadeaux',
    image:
      'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=900&q=85',
    label: 'Cadeaux',
  },
]

const occasions = ['Anniversaire', 'Mariage', 'Naissance', 'Amour', 'Deuil']

const trust = [
  { icon: Truck, label: 'Livraison en 3h' },
  { icon: CalendarDays, label: '7j/7 toute l\'année' },
  { icon: Leaf, label: 'Fraîcheur garantie' },
  { icon: Heart, label: 'Artisan local' },
]

export function HomePage({
  heroImageAlt,
  heroImageUrl,
  headline,
  kicker,
  lead,
  services,
  siteSlug,
}: {
  heroImageAlt?: string
  heroImageUrl?: string
  headline?: string
  kicker?: string
  lead?: string
  services: ProductService[]
  siteSlug: string
}) {
  const validServices = services.filter((service) => service?.id && service.title && service.slug)
  const featured = validServices.filter((service) => service.featured !== false)
  const showcase = (featured.length ? featured : validServices).slice(0, 8)

  return (
    <div className="home">
      <section className="home__hero">
        <div className="home__hero-inner">
          <div className="home__hero-content">
            <p className="home__kicker">
              <SiteIcon icon={Sparkles} size={14} />
              {kicker || 'Livraison de fleurs'}
            </p>
            <h1>{headline || 'Livraison fleurs en 3h, même le dimanche'}</h1>
            <p className="home__lead">
              {lead ||
                'Artisan fleuriste local, bouquets frais et livraison express. Trop facile de faire plaisir.'}
            </p>
            <div className="home__hero-actions">
              <a className="site-button" href={`/sites/${siteSlug}/bouquets`}>
                Voir les bouquets
                <SiteIcon icon={ArrowRight} size={18} />
              </a>
              <a className="site-link-button" href={`/sites/${siteSlug}/reservation`}>
                Demande sur mesure
              </a>
            </div>
          </div>
          <div className="home__hero-visual">
            <img
              alt={heroImageAlt || 'Bouquet de fleurs fraîches'}
              className="home__hero-image"
              src={heroImageUrl || fallbackHero}
            />
            <div className="home__hero-chip">
              <SiteIcon icon={Clock3} size={20} />
              <div>
                <strong>Dès aujourd&apos;hui</strong>
                <span>Livraison express disponible</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Nos engagements" className="home__trust">
        <div className="home__trust-inner">
          {trust.map((item) => (
            <div className="home__trust-item" key={item.label}>
              <SiteIcon icon={item.icon} size={22} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {showcase.length ? (
        <section className="home__section home__section--products">
          <div className="home__section-head">
            <div>
              <p className="home__kicker">Top ventes</p>
              <h2>Les bouquets préférés</h2>
              <p className="home__section-lead">
                Préparés à la commande avec des fleurs de saison, livrés en toute fraîcheur.
              </p>
            </div>
            <a className="site-link-button" href={`/sites/${siteSlug}/bouquets`}>
              Tout voir
              <SiteIcon icon={ArrowRight} size={16} />
            </a>
          </div>
          <ProductRail services={showcase} siteSlug={siteSlug} />
        </section>
      ) : null}

      <section className="home__section home__section--categories">
        <div className="home__section-head home__section-head--center">
          <p className="home__kicker">Nos rayons</p>
          <h2>Trouvez le bouquet idéal</h2>
          <p className="home__section-lead">
            Des compositions pour chaque moment de la vie.
          </p>
        </div>
        <div className="home__categories">
          {categories.map((category) => (
            <a
              className="home__category"
              href={`/sites/${siteSlug}/${category.href}`}
              key={category.href}
            >
              <img alt="" src={category.image} />
              <span>{category.label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="home__section home__section--search">
        <div className="home__search-card">
          <div className="home__search-copy">
            <p className="home__kicker">Trop facile</p>
            <h2>Quel bouquet offrir ?</h2>
            <p className="home__section-lead">
              Recherchez par mot-clé ou choisissez une occasion.
            </p>
          </div>
          <form action={`/sites/${siteSlug}/bouquets`} className="home__search-form">
            <label className="home__search-field">
              <SiteIcon icon={Search} size={18} />
              <input name="q" placeholder="Roses, anniversaire, livraison..." type="search" />
            </label>
            <button className="site-button" type="submit">
              Rechercher
            </button>
          </form>
          <div className="home__pills">
            {occasions.map((occasion) => (
              <a href={`/sites/${siteSlug}/bouquets?occasion=${occasion}`} key={occasion}>
                {occasion}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="home__cta">
        <div className="home__cta-inner">
          <div>
            <p className="home__kicker home__kicker--light">Sur mesure</p>
            <h2>Mariage, deuil ou création unique</h2>
            <p>Décrivez votre projet — notre atelier vous répond sous 24h.</p>
          </div>
          <div className="home__cta-actions">
            <a className="site-button" href={`/sites/${siteSlug}/reservation`}>
              Demander un devis
              <SiteIcon icon={ArrowRight} size={18} />
            </a>
            <a className="site-button site-button--ghost" href={`/sites/${siteSlug}/bouquets`}>
              Commander en ligne
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
