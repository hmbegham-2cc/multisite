'use client'

import { useState } from 'react'

export function NewsletterBand({ siteName }: { siteName: string }) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section className="newsletter-band">
      <div className="newsletter-band-inner">
        <div>
          <p className="site-kicker">Newsletter</p>
          <h2>Souscrivez et profitez de -15% sur votre première commande</h2>
          <p>Offres saisonnières, conseils floraux et nouveautés {siteName}.</p>
        </div>
        {submitted ? (
          <p className="newsletter-success">Merci ! Votre inscription est enregistrée.</p>
        ) : (
          <form
            className="newsletter-form"
            onSubmit={(event) => {
              event.preventDefault()
              setSubmitted(true)
            }}
          >
            <input name="email" placeholder="Votre email" required type="email" />
            <button className="site-button" type="submit">
              M&apos;inscrire
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
