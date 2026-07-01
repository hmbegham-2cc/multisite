import { PageHeader } from '@/components/public/PageHeader'
import { CartPageContent } from '@/components/public/cart/CartPageContent'

type Props = {
  params: Promise<{ siteSlug: string }>
}

export default async function CartPage({ params }: Props) {
  const { siteSlug } = await params

  return (
    <main className="site-shell">
      <PageHeader
        eyebrow="Boutique"
        lead="Vérifiez vos articles, ajustez les quantités et passez au checkout."
        title="Mon panier"
        variant="compact"
      />
      <section className="cart-page">
        <CartPageContent siteSlug={siteSlug} />
      </section>
    </main>
  )
}
