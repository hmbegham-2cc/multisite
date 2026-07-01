import {
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  PenLine,
  Phone,
  ShoppingBag,
  Sparkles,
  Truck,
} from 'lucide-react'

import { BookingForm } from '@/components/public/BookingForm'
import { SiteIcon } from '@/components/icons/SiteIcon'

const fallbackHero =
  'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=85'

const trustItems = [
  { icon: MessageSquare, value: '24h', label: 'Réponse sous 24h ouvrées' },
  { icon: CalendarDays, value: '7j/7', label: 'Atelier ouvert toute l\'année' },
  { icon: Truck, value: '3h', label: 'Livraison express possible' },
  { icon: BadgeCheck, value: '100%', label: 'Devis sans engagement' },
]

const steps = [
  {
    icon: PenLine,
    title: 'Décrivez votre besoin',
    text: 'Occasion, date, style floral et contraintes de livraison.',
  },
  {
    icon: FileText,
    title: 'Recevez notre proposition',
    text: 'Devis personnalisé et conseils de l\'artisan fleuriste.',
  },
  {
    icon: CheckCircle2,
    title: 'Validez en toute sérénité',
    text: 'Ajustements possibles avant la préparation finale.',
  },
]

type SiteContact = {
  address?: null | string
  email?: null | string
  phone?: null | string
}

export function ReservationPage({
  bookingSuccess,
  defaultEventType = 'delivery',
  heroImageAlt,
  heroImageUrl,
  lead,
  siteContact,
  siteSlug,
  title = 'Demande sur mesure',
}: {
  bookingSuccess?: boolean
  defaultEventType?: 'delivery' | 'funeral' | 'other' | 'wedding'
  heroImageAlt?: string
  heroImageUrl?: string
  lead?: string
  siteContact?: SiteContact | null
  siteSlug: string
  title?: string
}) {
  const phone = siteContact?.phone || '01 23 45 67 89'
  const email = siteContact?.email

  return (
    <div className="reservation-page">
      <nav aria-label="Fil d'Ariane" className="breadcrumbs reservation-page__breadcrumbs">
        <a href={`/sites/${siteSlug}`}>Accueil</a>
        <span>/</span>
        <span>{title}</span>
      </nav>

      <section className="reservation-hero">
        <div className="reservation-hero__copy">
          <p className="site-kicker">
            <SiteIcon icon={Sparkles} size={14} />
            Réservation
          </p>
          <h1>{title}</h1>
          <p className="reservation-hero__lead">
            {lead ||
              'Mariage, deuil ou création personnalisée : décrivez votre projet. Notre atelier vous accompagne de l\'idée à la livraison.'}
          </p>
          <div className="reservation-hero__actions">
            <a className="site-button" href="#reservation-form">
              Remplir le formulaire
            </a>
            <a className="site-link-button" href={`/sites/${siteSlug}/bouquets`}>
              Commander en ligne
            </a>
          </div>
        </div>
        <div className="reservation-hero__media">
          <img
            alt={heroImageAlt || 'Composition florale sur mesure'}
            src={heroImageUrl || fallbackHero}
          />
        </div>
      </section>

      <section aria-label="Nos engagements" className="reservation-trust">
        {trustItems.map((item) => (
          <div className="reservation-trust__item" key={item.value}>
            <span className="trust-icon">
              <SiteIcon icon={item.icon} size={22} />
            </span>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </section>

      <section className="reservation-steps">
        <div className="reservation-steps__intro">
          <p className="site-kicker">Comment ça marche</p>
          <h2>Un parcours simple et rassurant</h2>
        </div>
        <ol className="reservation-steps__list">
          {steps.map((step, index) => (
            <li className="reservation-steps__item" key={step.title}>
              <span className="reservation-steps__number">{index + 1}</span>
              <div>
                <h3>
                  <SiteIcon icon={step.icon} size={18} />
                  {step.title}
                </h3>
                <p>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="reservation-main" id="reservation-form">
        <div className="reservation-main__form">
          <div className="reservation-main__head">
            <p className="site-kicker">Formulaire</p>
            <h2>Racontez-nous votre demande</h2>
            <p className="reservation-main__lead">
              Tous les champs marqués d&apos;un * sont obligatoires. Plus votre message est précis,
              plus notre réponse sera adaptée.
            </p>
          </div>
          <BookingForm
            bookingSuccess={bookingSuccess}
            className="booking-form--reservation"
            defaultEventType={defaultEventType}
            siteContact={siteContact}
            siteSlug={siteSlug}
          />
        </div>

        <aside aria-label="Informations pratiques" className="reservation-aside">
          <div className="reservation-aside__card">
            <p className="site-kicker">Besoin urgent ?</p>
            <h3>
              <SiteIcon icon={Phone} size={20} />
              Contactez l&apos;atelier
            </h3>
            <p>Pour une livraison le jour même ou un conseil rapide, appelez-nous directement.</p>
            <a className="site-button" href={`tel:${phone.replace(/\s/g, '')}`}>
              <SiteIcon icon={Phone} size={18} />
              {phone}
            </a>
            {email ? (
              <p className="reservation-aside__email">
                <SiteIcon icon={Mail} size={16} />
                <a href={`mailto:${email}`}>{email}</a>
              </p>
            ) : null}
            {siteContact?.address ? (
              <p className="reservation-aside__address">
                <SiteIcon icon={MapPin} size={16} />
                {siteContact.address}
              </p>
            ) : null}
          </div>

          <div className="reservation-aside__card reservation-aside__card--muted">
            <h3>
              <SiteIcon icon={Clock3} size={20} />
              Délais habituels
            </h3>
            <ul>
              <li>
                <strong>
                  <SiteIcon icon={Truck} size={16} />
                  Commande express
                </strong>
                <span>Livraison en 3h via la boutique en ligne</span>
              </li>
              <li>
                <strong>
                  <SiteIcon icon={MessageSquare} size={16} />
                  Devis sur mesure
                </strong>
                <span>Réponse sous 24h ouvrées</span>
              </li>
              <li>
                <strong>
                  <SiteIcon icon={CalendarDays} size={16} />
                  Mariage / événement
                </strong>
                <span>Idéalement 4 à 8 semaines à l&apos;avance</span>
              </li>
            </ul>
          </div>

          <div className="reservation-aside__card reservation-aside__card--accent">
            <h3>
              <SiteIcon icon={ShoppingBag} size={20} />
              Commande rapide
            </h3>
            <p>
              Pour un bouquet prêt à livrer, passez directement par la boutique — c&apos;est plus
              rapide qu&apos;une demande sur mesure.
            </p>
            <a className="site-button site-button--ghost" href={`/sites/${siteSlug}/bouquets`}>
              Voir les bouquets
            </a>
          </div>
        </aside>
      </section>
    </div>
  )
}
