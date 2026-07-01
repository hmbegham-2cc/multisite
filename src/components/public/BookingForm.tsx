import { CircleCheck } from 'lucide-react'

import { SiteIcon } from '@/components/icons/SiteIcon'

type SiteContact = {
  address?: null | string
  email?: null | string
  phone?: null | string
}

export function BookingForm({
  bookingSuccess,
  className,
  defaultEventType = 'delivery',
  siteContact,
  siteSlug,
}: {
  bookingSuccess?: boolean
  className?: string
  defaultEventType?: 'delivery' | 'funeral' | 'other' | 'wedding'
  siteContact?: SiteContact | null
  siteSlug: string
}) {
  const phone = siteContact?.phone || '01 23 45 67 89'
  const email = siteContact?.email

  return (
    <form action="/api/booking" className={['booking-form', className].filter(Boolean).join(' ')} method="post">
      <input name="siteSlug" type="hidden" value={siteSlug} />

      {bookingSuccess ? (
        <div className="booking-success" role="status">
          <SiteIcon className="booking-success__icon" icon={CircleCheck} size={40} />
          <strong>Demande envoyée avec succès</strong>
          <p>
            Merci pour votre confiance. Notre atelier revient vers vous sous 24h ouvrées pour
            affiner votre projet.
          </p>
          <div className="booking-success__actions">
            <a className="site-button" href={`/sites/${siteSlug}/bouquets`}>
              Voir les bouquets
            </a>
            <a className="site-link-button" href={`/sites/${siteSlug}`}>
              Retour à l&apos;accueil
            </a>
          </div>
        </div>
      ) : (
        <>
      <fieldset className="booking-form__section">
        <legend>Vos coordonnées</legend>
        <div className="booking-form__grid">
          <label>
            Nom complet
            <input
              autoComplete="name"
              minLength={2}
              name="customerName"
              placeholder="Marie Dupont"
              required
              type="text"
            />
          </label>
          <label>
            Email
            <input
              autoComplete="email"
              name="customerEmail"
              placeholder="marie@exemple.fr"
              required
              type="email"
            />
          </label>
          <label>
            Téléphone
            <span className="booking-form__hint">Facultatif, pour un rappel rapide</span>
            <input
              autoComplete="tel"
              name="customerPhone"
              placeholder="06 12 34 56 78"
              type="tel"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="booking-form__section">
        <legend>Votre projet</legend>
        <div className="booking-form__grid">
          <label>
            Date souhaitée
            <input min={new Date().toISOString().split('T')[0]} name="eventDate" type="date" />
          </label>
          <label>
            Type de demande
            <select defaultValue={defaultEventType} name="eventType" required>
              <option value="delivery">Livraison / bouquet</option>
              <option value="wedding">Mariage</option>
              <option value="funeral">Deuil</option>
              <option value="other">Autre événement</option>
            </select>
          </label>
          <label>
            Budget indicatif
            <span className="booking-form__hint">Facultatif, en euros</span>
            <input
              min={0}
              name="budget"
              placeholder="150"
              step="1"
              type="number"
            />
          </label>
          <label>
            Créneau de livraison
            <select defaultValue="" name="deliverySlot">
              <option value="">Pas encore défini</option>
              <option value="morning">Matin (8h – 12h)</option>
              <option value="afternoon">Après-midi (12h – 18h)</option>
              <option value="evening">Soir (18h – 21h)</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="booking-form__section booking-form__section--full">
        <legend>Livraison</legend>
        <label>
          Adresse ou lieu de livraison
          <span className="booking-form__hint">Ville, code postal, instructions d&apos;accès…</span>
          <textarea
            name="deliveryAddress"
            placeholder="Ex. 12 rue des Lilas, 75011 Paris — sonner au nom de Martin"
            rows={3}
          />
        </label>
      </fieldset>

      <fieldset className="booking-form__section booking-form__section--full">
        <legend>Décrivez votre besoin</legend>
        <label>
          Message
          <span className="booking-form__hint">
            Occasion, couleurs, budget indicatif, lieu de livraison…
          </span>
          <textarea
            minLength={5}
            name="message"
            placeholder="Ex. Bouquet de roses pour un anniversaire, livraison demain matin à Paris 11e…"
            required
            rows={5}
          />
        </label>
      </fieldset>

      <div className="booking-form__footer">
        <button className="site-button" type="submit">
          Envoyer ma demande
        </button>
        <p className="booking-form__note">
          Réponse sous 24h ouvrées. Besoin d&apos;une commande express ?{' '}
          <a href={`/sites/${siteSlug}/bouquets`}>Commander en ligne</a>
          {email ? (
            <>
              {' '}
              ou appelez-nous au{' '}
              <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
            </>
          ) : null}
        </p>
      </div>
        </>
      )}
    </form>
  )
}
