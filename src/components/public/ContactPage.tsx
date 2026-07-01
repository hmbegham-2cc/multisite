import {
  CalendarDays,
  Clock3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShoppingBag,
} from 'lucide-react'

import { ContactForm } from '@/components/public/ContactForm'
import { SiteIcon } from '@/components/icons/SiteIcon'
import { formatSiteHours } from '@/lib/formatHours'

type SiteContact = {
  address?: null | string
  email?: null | string
  hours?: Record<string, unknown> | null
  phone?: null | string
}

const fallbackHero =
  'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1400&q=85'

export function ContactPage({
  contactSuccess,
  heroImageAlt,
  heroImageUrl,
  lead,
  siteContact,
  siteName,
  siteSlug,
  title = 'Contact',
}: {
  contactSuccess?: boolean
  heroImageAlt?: string
  heroImageUrl?: string
  lead?: string
  siteContact?: SiteContact | null
  siteName?: string
  siteSlug: string
  title?: string
}) {
  const phone = siteContact?.phone || '01 23 45 67 89'
  const email = siteContact?.email
  const address = siteContact?.address || '12 rue des Fleurs, 75001 Paris'
  const hours = formatSiteHours(siteContact?.hours as never)
  const mapQuery = encodeURIComponent(address)

  return (
    <div className="contact-page">
      <nav aria-label="Fil d'Ariane" className="breadcrumbs contact-page__breadcrumbs">
        <a href={`/sites/${siteSlug}`}>Accueil</a>
        <span>/</span>
        <span>{title}</span>
      </nav>

      <section className="contact-hero">
        <div className="contact-hero__copy">
          <p className="site-kicker">
            <SiteIcon icon={MessageSquare} size={14} />
            Contact
          </p>
          <h1>{title}</h1>
          <p className="contact-hero__lead">
            {lead ||
              `Une question, un conseil ou une commande ? L'équipe ${siteName || 'de l\'atelier'} est à votre écoute.`}
          </p>
          <div className="contact-hero__actions">
            <a className="site-button" href={`tel:${phone.replace(/\s/g, '')}`}>
              <SiteIcon icon={Phone} size={18} />
              {phone}
            </a>
            {email ? (
              <a className="site-link-button" href={`mailto:${email}`}>
                <SiteIcon icon={Mail} size={18} />
                {email}
              </a>
            ) : null}
          </div>
        </div>
        <div className="contact-hero__media">
          <img alt={heroImageAlt || 'Atelier fleuriste'} src={heroImageUrl || fallbackHero} />
        </div>
      </section>

      <section aria-label="Accès rapide" className="contact-quick">
        <a className="contact-quick__item" href={`tel:${phone.replace(/\s/g, '')}`}>
          <SiteIcon icon={Phone} size={22} />
          <strong>Appeler</strong>
          <span>{phone}</span>
        </a>
        {email ? (
          <a className="contact-quick__item" href={`mailto:${email}`}>
            <SiteIcon icon={Mail} size={22} />
            <strong>Email</strong>
            <span>{email}</span>
          </a>
        ) : null}
        <a className="contact-quick__item" href={`/sites/${siteSlug}/reservation`}>
          <SiteIcon icon={CalendarDays} size={22} />
          <strong>Sur mesure</strong>
          <span>Demande personnalisée</span>
        </a>
        <a className="contact-quick__item" href={`/sites/${siteSlug}/bouquets`}>
          <SiteIcon icon={ShoppingBag} size={22} />
          <strong>Boutique</strong>
          <span>Commander en ligne</span>
        </a>
      </section>

      <section className="contact-main">
        <aside aria-label="Coordonnées" className="contact-info">
          <div className="contact-info__card">
            <h2>
              <SiteIcon icon={MapPin} size={20} />
              Adresse
            </h2>
            <p>{address}</p>
            <a
              className="contact-info__link"
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              rel="noreferrer"
              target="_blank"
            >
              Voir sur la carte
            </a>
          </div>

          <div className="contact-info__card">
            <h2>
              <SiteIcon icon={Clock3} size={20} />
              Horaires
            </h2>
            <ul className="contact-info__hours">
              {hours.map((row) => (
                <li key={row.day}>
                  <span>{row.day}</span>
                  <strong>{row.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="contact-form-wrap">
          <div className="contact-form-wrap__head">
            <p className="site-kicker">Message</p>
            <h2>Écrivez-nous</h2>
            <p>Réponse sous 24h ouvrées du lundi au samedi.</p>
          </div>
          <ContactForm contactSuccess={contactSuccess} siteContact={siteContact} siteSlug={siteSlug} />
        </div>
      </section>
    </div>
  )
}
