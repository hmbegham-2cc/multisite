import { Mail, Phone, Share2 } from 'lucide-react'

import { NewsletterBand } from '@/components/public/NewsletterBand'
import { getSocialIcon, SocialIcon as SocialBrandIcon } from '@/components/icons/socialIcons'
import { SiteIcon } from '@/components/icons/SiteIcon'

type PageLink = {
  id: number | string
  slug: string
  title: string
}

type SiteContact = {
  address?: null | string
  email?: null | string
  phone?: null | string
}

type SocialLink = {
  platform?: null | string
  url?: null | string
}

export function SiteFooter({
  pages,
  siteContact,
  siteName,
  siteSlug,
  socialLinks,
}: {
  pages: PageLink[]
  siteContact?: SiteContact | null
  siteName: string
  siteSlug: string
  socialLinks?: SocialLink[] | null
}) {
  const validPages = pages.filter((page) => page?.slug && page.title)
  const validSocial = (socialLinks || []).filter((link) => link?.platform && link?.url)
  const phone = siteContact?.phone || '01 23 45 67 89'

  return (
    <footer className="site-footer">
      <NewsletterBand siteName={siteName} />

      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <strong>{siteName}</strong>
          <p>
            Spécialiste de la livraison de fleurs. Artisan fleuriste local, compositions
            fraîches et livraison express en 3h.
          </p>
          {validSocial.length ? (
            <div className="site-footer-social">
              {validSocial.map((link) => {
                const BrandIcon = getSocialIcon(link.platform!)

                return (
                  <a
                    aria-label={link.platform!}
                    href={link.url!}
                    key={link.platform!}
                    rel="noreferrer"
                    target="_blank"
                    title={link.platform!}
                  >
                    {BrandIcon ? (
                      <SocialBrandIcon icon={BrandIcon} size={20} />
                    ) : (
                      <SiteIcon icon={Share2} size={20} />
                    )}
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>

        <div>
          <h3>Des fleurs à offrir</h3>
          <ul>
            <li><a href={`/sites/${siteSlug}/bouquets`}>Bouquets de fleurs</a></li>
            <li><a href={`/sites/${siteSlug}/mariage`}>Fleurs de mariage</a></li>
            <li><a href={`/sites/${siteSlug}/bouquets?category=deuil`}>Fleurs de deuil</a></li>
            <li><a href={`/sites/${siteSlug}/bouquets?category=cadeaux`}>Fleurs et cadeaux</a></li>
          </ul>
        </div>

        <div>
          <h3>Nos services</h3>
          <ul>
            <li><a href={`/sites/${siteSlug}/livraison`}>Livraison en 3h</a></li>
            <li><a href={`/sites/${siteSlug}/bouquets?category=click-collect`}>Click &amp; Collect</a></li>
            <li><a href={`/sites/${siteSlug}/reservation`}>Demande sur mesure</a></li>
            <li><a href={`/sites/${siteSlug}/checkout`}>Suivi de commande</a></li>
          </ul>
        </div>

        <div>
          <h3>Besoin d&apos;aide ?</h3>
          <ul>
            <li><a href={`/sites/${siteSlug}/contact`}>Nous contacter</a></li>
            <li><a href={`/sites/${siteSlug}/panier`}>Mon panier</a></li>
            {validPages.map((page) => (
              <li key={page.id}>
                <a href={`/sites/${siteSlug}/${page.slug}`}>{page.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Informations légales</h3>
          <ul>
            <li><a href={`/sites/${siteSlug}/contact`}>Mentions légales</a></li>
            <li><a href={`/sites/${siteSlug}/contact`}>CGV</a></li>
            <li><a href={`/sites/${siteSlug}/contact`}>Politique de confidentialité</a></li>
          </ul>
          {siteContact?.email ? (
            <p className="site-footer-contact-line">
              <SiteIcon icon={Mail} size={16} />
              <a href={`mailto:${siteContact.email}`}>{siteContact.email}</a>
            </p>
          ) : null}
          <p className="site-footer-contact-line">
            <SiteIcon icon={Phone} size={16} />
            <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
          </p>
        </div>
      </div>

      <div className="site-footer-payments">
        <span>Paiements acceptés</span>
        <div className="payment-badges">
          <span>CB</span>
          <span>Visa</span>
          <span>Mastercard</span>
          <span>PayPal</span>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} {siteName}. Tous droits réservés.</span>
        <span>Livraison 7j/7 · Fraîcheur garantie · Artisan fleuriste</span>
      </div>
    </footer>
  )
}
