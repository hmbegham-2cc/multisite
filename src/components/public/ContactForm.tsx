import { CircleCheck } from 'lucide-react'

import { SiteIcon } from '@/components/icons/SiteIcon'

type SiteContact = {
  email?: null | string
  phone?: null | string
}

export function ContactForm({
  contactSuccess,
  siteContact,
  siteSlug,
}: {
  contactSuccess?: boolean
  siteContact?: SiteContact | null
  siteSlug: string
}) {
  const phone = siteContact?.phone || '01 23 45 67 89'

  if (contactSuccess) {
    return (
      <div className="contact-form__success" role="status">
        <SiteIcon className="contact-form__success-icon" icon={CircleCheck} size={40} />
        <strong>Message envoyé</strong>
        <p>Merci pour votre message. Nous vous répondons sous 24h ouvrées.</p>
      </div>
    )
  }

  return (
    <form action="/api/booking" className="contact-form" method="post">
      <input name="siteSlug" type="hidden" value={siteSlug} />
      <input name="eventType" type="hidden" value="other" />
      <input name="returnPath" type="hidden" value="contact" />

      <div className="contact-form__grid">
        <label>
          Nom complet *
          <input autoComplete="name" minLength={2} name="customerName" required type="text" />
        </label>
        <label>
          Email *
          <input autoComplete="email" name="customerEmail" required type="email" />
        </label>
        <label className="contact-form__full">
          Téléphone
          <input autoComplete="tel" name="customerPhone" type="tel" />
        </label>
        <label className="contact-form__full">
          Votre message *
          <textarea
            minLength={5}
            name="message"
            placeholder="Question, conseil floral, demande d'information…"
            required
            rows={5}
          />
        </label>
      </div>

      <div className="contact-form__footer">
        <button className="site-button" type="submit">
          Envoyer mon message
        </button>
        <p className="contact-form__note">
          Besoin d&apos;une réponse immédiate ? Appelez-nous au{' '}
          <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
        </p>
      </div>
    </form>
  )
}
