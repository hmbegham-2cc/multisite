import { PageHeader } from '@/components/public/PageHeader'
import { CheckoutPageContent } from '@/components/public/cart/CheckoutPageContent'

type Props = {
  params: Promise<{ siteSlug: string }>
  searchParams: Promise<{ success?: string }>
}

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { siteSlug } = await params
  const query = await searchParams

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Commande"
        lead="Livraison, confirmation et validation de votre commande fleurie."
        title="Checkout"
        variant="compact"
      />
      <section className="checkout-page">
        <CheckoutPageContent siteSlug={siteSlug} success={query.success === '1'} />
      </section>
    </main>
  )
}
