import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

console.log('Seed demo: starting Payload')
const payload = await getPayload({ config })
console.log('Seed demo: Payload ready')
type SeedCollection = Parameters<typeof payload.find>[0]['collection']
type SeedDoc = { id: number | string }

async function upsertBySlug<T extends string>({
  collection,
  data,
  slug,
}: {
  collection: T
  data: Record<string, unknown>
  slug: string
}) {
  const existing = await payload.find({
    collection: collection as SeedCollection,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (existing.docs[0]) {
    const doc = existing.docs[0] as SeedDoc

    return payload.update({
      collection: collection as SeedCollection,
      id: doc.id,
      data,
      overrideAccess: true,
    })
  }

  return payload.create({
    collection: collection as SeedCollection,
    data,
    overrideAccess: true,
  })
}

const pages = [
  {
    title: 'Accueil',
    slug: 'accueil',
    eyebrow: 'Livraison fleurs en 3h',
    excerpt:
      'Commandez des bouquets frais, des roses, des plantes et des cadeaux prepares par un artisan fleuriste.',
    isHomepage: true,
    blocksJson: [
      {
        blockType: 'hero',
        eyebrow: 'Livraison fleurs en 3h',
        title: 'Livraison fleurs en 3h, même le dimanche',
        subtitle:
          'Commandez des bouquets frais, des roses, des plantes et des cadeaux prepares par un artisan fleuriste.',
        ctaLabel: 'Voir les bouquets',
        ctaHref: '/bouquets',
        imageUrl:
          'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=1600&q=85',
      },
      {
        blockType: 'occasion-finder',
        eyebrow: 'Trop facile de choisir',
        title: 'Trouvez la meilleure selection pour chaque emotion',
      },
      {
        blockType: 'services-grid',
        eyebrow: 'Top ventes',
        title: 'Les bouquets preferes du moment',
      },
      {
        blockType: 'category-tiles',
        eyebrow: 'Rayons boutique',
        title: 'Des fleurs pour toutes les occasions',
      },
      {
        blockType: 'featured-products',
        eyebrow: 'Fleurs de saison',
        title: 'A cueillir maintenant',
      },
      {
        blockType: 'reassurance',
      },
      {
        blockType: 'gallery',
        eyebrow: 'Inspiration',
        title: 'Ambiances florales',
        images: [
          'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85',
          'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=900&q=85',
          'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85',
        ],
      },
      {
        blockType: 'text-image',
        eyebrow: 'Artisan fleuriste',
        title: 'Un atelier local pour transmettre vos plus belles emotions',
        text:
          'Chaque commande est preparee avec des fleurs selectionnees pour leur fraicheur, leur couleur et leur tenue. Le parcours est pense pour commander vite, choisir une occasion et garder la main sur les images, prix et produits depuis Payload.',
        imageUrl:
          'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1400&q=85',
      },
    ],
    seo: {
      title: 'Fleuriste Martin - Livraison fleurs en 3h',
      description: 'Bouquets, roses, cadeaux floraux et livraison par artisan fleuriste.',
    },
  },
  {
    title: 'Bouquets',
    slug: 'bouquets',
    eyebrow: 'Collections florales',
    excerpt:
      'Des bouquets de saison composes a la main, du geste quotidien au cadeau spectaculaire.',
    isHomepage: false,
    blocksJson: [
      {
        blockType: 'hero',
        eyebrow: 'Bouquets',
        title: 'Des fleurs qui ont de la presence',
        subtitle:
          'Couleurs maitrisees, volumes genereux, selection fraiche du marche et finitions premium.',
        ctaLabel: 'Demander un bouquet',
        ctaHref: '/reservation',
        imageUrl:
          'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=1600&q=85',
      },
      { blockType: 'services-grid', eyebrow: 'Catalogue', title: 'Nos bouquets' },
    ],
    seo: {
      title: 'Bouquets premium',
      description: 'Bouquets de saison, compositions sur mesure et livraison.',
    },
  },
  {
    title: 'Mariage',
    slug: 'mariage',
    eyebrow: 'Evenements prives',
    excerpt:
      'Une scenographie florale elegante pour ceremonies, diners, tables et bouquets de mariee.',
    isHomepage: false,
    blocksJson: [
      {
        blockType: 'hero',
        eyebrow: 'Mariage',
        title: 'Des decors floraux qui signent votre journee',
        subtitle:
          'Du bouquet de mariee a la table, nous construisons une direction florale coherente et sensible.',
        ctaLabel: 'Parler de mon mariage',
        ctaHref: '/reservation',
        imageUrl:
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
      },
      {
        blockType: 'text-image',
        eyebrow: 'Approche',
        title: 'Un accompagnement clair, de l intention au montage',
        text:
          'Moodboard, palette, estimation, production et installation : chaque etape est cadree pour garder une experience fluide et rassurante.',
        imageUrl:
          'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=85',
      },
      { blockType: 'booking-form', title: 'Demander un devis mariage' },
    ],
    seo: {
      title: 'Fleurs de mariage',
      description: 'Scenographie florale pour mariages, ceremonies et receptions.',
    },
  },
  {
    title: 'Reservation',
    slug: 'reservation',
    eyebrow: 'Demande sur mesure',
    excerpt:
      'Envoyez votre besoin, votre date et votre intention. Nous revenons vers vous rapidement.',
    isHomepage: false,
    blocksJson: [
      {
        blockType: 'booking-form',
        title: 'Racontez-nous votre demande',
      },
    ],
    seo: {
      title: 'Reservation',
      description: 'Demande de bouquet, livraison ou evenement floral.',
    },
  },
  {
    title: 'Contact',
    slug: 'contact',
    eyebrow: 'Atelier',
    excerpt: 'Retrouvez l atelier, les horaires et les coordonnees de Fleuriste Martin.',
    isHomepage: false,
    blocksJson: [
      {
        blockType: 'contact-info',
        title: 'Un atelier au coeur de Paris',
      },
    ],
    seo: {
      title: 'Contact',
      description: 'Coordonnees et horaires de Fleuriste Martin.',
    },
  },
]

const defaultServices = [
  {
    title: 'Bouquet Coccinelle',
    slug: 'coccinelle',
    category: 'bouquets',
    badge: 'Top vente',
    deliveryLabel: "Livraison dès aujourd'hui",
    shortDescription: 'Bouquet rond lumineux aux tons frais et joyeux.',
    imageUrl:
      'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=900&q=85',
    featured: true,
    order: 0,
    price: { from: 35.9, currency: 'EUR', onRequest: false },
  },
  {
    title: 'Roses Signature',
    slug: 'roses-signature',
    category: 'amour',
    badge: 'Iconique',
    deliveryLabel: 'Livraison dès demain',
    shortDescription: 'Roses longues tiges et emballage premium.',
    imageUrl:
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=85',
    featured: true,
    order: 1,
    price: { from: 39.9, currency: 'EUR', onRequest: false },
  },
  {
    title: 'Plein Été',
    slug: 'plein-ete',
    category: 'bouquets',
    badge: 'Saison',
    deliveryLabel: "Livraison dès aujourd'hui",
    shortDescription: 'Composition solaire pour une attention spontanée.',
    imageUrl:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85',
    featured: true,
    order: 2,
    price: { from: 38.9, currency: 'EUR', onRequest: false },
  },
]

console.log('Seed demo: upserting sector/template/client/site')
const sector = await upsertBySlug({
  collection: 'sectors',
  slug: 'fleuriste',
  data: {
    name: 'Fleuriste',
    slug: 'fleuriste',
    description: 'Sites vitrines premium pour fleuristes, livraison et evenements.',
  },
})

const template = await upsertBySlug({
  collection: 'templates',
  slug: 'fleuriste-v1',
  data: {
    name: 'Template Fleuriste Premium',
    slug: 'fleuriste-v1',
    sector: sector.id,
    description: 'Template premium pour fleuriste local avec parcours reservation.',
    defaultTheme: {
      primaryColor: '#19351F',
      secondaryColor: '#F5EBDD',
      accentColor: '#B65F46',
      fontHeading: 'Playfair Display',
      fontBody: 'Inter',
      borderRadius: 'medium',
    },
    defaultPages: pages,
    defaultServices,
    isActive: true,
  },
})

const client = await upsertBySlug({
  collection: 'clients',
  slug: 'fleuriste-martin',
  data: {
    name: 'Fleuriste Martin SARL',
    slug: 'fleuriste-martin',
    contactEmail: 'contact@fleuriste-martin.test',
    contactPhone: '01 23 45 67 89',
    billingAddress: {
      address: '12 rue des Fleurs',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
    },
    status: 'active',
  },
})

const siteData = {
  name: 'Fleuriste Martin',
  slug: 'fleuriste-martin',
  client: client.id,
  template: template.id,
  sector: sector.id,
  status: 'published',
  domain: 'fleuriste-martin.local',
  subdomain: 'fleuriste-martin',
  useCustomDomain: false,
  theme: {
    primaryColor: '#19351F',
    secondaryColor: '#F5EBDD',
    accentColor: '#B65F46',
    fontHeading: 'Playfair Display',
    fontBody: 'Inter',
    borderRadius: 'medium',
  },
  contact: {
    phone: '01 23 45 67 89',
    email: 'contact@fleuriste-martin.test',
    address: '12 rue des Fleurs, 75001 Paris',
    hours: {
      monday: { open: '09:00', close: '19:00', closed: false },
      tuesday: { open: '09:00', close: '19:00', closed: false },
      wednesday: { open: '09:00', close: '19:00', closed: false },
      thursday: { open: '09:00', close: '19:00', closed: false },
      friday: { open: '09:00', close: '19:00', closed: false },
      saturday: { open: '10:00', close: '18:00', closed: false },
      sunday: { closed: true },
    },
  },
  socialLinks: [
    { platform: 'Instagram', url: 'https://instagram.com' },
    { platform: 'Pinterest', url: 'https://pinterest.com' },
  ],
  seo: {
    defaultTitle: 'Fleuriste Martin',
    description:
      'Atelier floral premium a Paris : bouquets couture, mariage et livraison.',
  },
}

const site = await upsertBySlug({
  collection: 'sites',
  slug: 'fleuriste-martin',
  data: siteData,
})

console.log('Seed demo: upserting pages')
for (const page of pages) {
  const existing = await payload.find({
    collection: 'pages',
    where: {
      and: [{ site: { equals: site.id } }, { slug: { equals: page.slug } }],
    },
    limit: 1,
  })

  const data = {
    site: site.id,
    title: page.title,
    slug: page.slug,
    eyebrow: page.eyebrow,
    excerpt: page.excerpt,
    isHomepage: page.isHomepage,
    layout: page.blocksJson,
    seo: page.seo,
    contentScope: 'site',
    status: 'published',
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      data: data as never,
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'pages',
      data: data as never,
      overrideAccess: true,
    })
  }
}

const melodieGallery = [
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85',
]

const services = [
  {
    title: 'Mélodie des jardins S',
    slug: 'melodie-des-jardins-s',
    category: 'bouquets',
    badge: 'Nouveau',
    deliveryLabel: "Livraison dès aujourd'hui",
    shortDescription:
      'Bouquet champêtre aux tons pastel, mélange délicat de fleurs de saison pour une attention toute en douceur.',
    composition:
      '3 roses, 2 pivoines, 3 alstroemères, 2 delphiniums, 2 gypsophiles, 2 eucalyptus parvifolia, 1 ruban.',
    deliveryDetails:
      'La livraison de ce produit est assurée par un transporteur dans un colis du lundi au samedi de 8h à 19h.',
    reference: 'MJS-2026-S',
    sku: 'FLJ-MEL-S',
    deliveryFeeFrom: 9.95,
    gallery: melodieGallery.map((imageUrl) => ({ imageUrl })),
    variants: [
      { label: 'Mélodie des jardins S', code: 'S', price: 19.9 },
      { label: 'Mélodie des jardins M', code: 'M', price: 24.9 },
      { label: 'Mélodie des jardins L', code: 'L', price: 32.9 },
    ],
    addOns: [
      { title: 'Vase', price: 5 },
      { title: "Amandes Maxim's", price: 11 },
      { title: "Rochers Maxim's", price: 11 },
      { title: 'Chocolats artisanaux', price: 9.5 },
      { title: 'Carte message personnalisée', price: 3.5 },
      { title: 'LEGO - TOURNESOLS', price: 14.99 },
      { title: 'Ours blanc', price: 12 },
      { title: 'Bouquet bougies tournesol', price: 12.5 },
    ],
    imageUrl: melodieGallery[0],
    featured: true,
    order: 0,
    price: { from: 19.9, currency: 'EUR', onRequest: false },
  },
  {
    title: 'Coccinelle',
    slug: 'coccinelle',
    category: 'bouquets',
    badge: 'Top vente',
    deliveryLabel: "Livraison des aujourd'hui",
    shortDescription:
      'Bouquet rond lumineux, compose de fleurs de saison aux tons frais et joyeux.',
    imageUrl:
      'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=900&q=85',
    featured: true,
    order: 1,
    price: { from: 35.9, currency: 'EUR', onRequest: false },
  },
  {
    title: 'Roses Signature',
    slug: 'roses-signature',
    category: 'amour',
    badge: 'Iconique',
    deliveryLabel: 'Livraison des demain',
    shortDescription:
      'Roses longues tiges, feuillage elegant et emballage premium pret a offrir.',
    imageUrl:
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=85',
    featured: true,
    order: 2,
    price: { from: 39.9, currency: 'EUR', onRequest: false },
  },
  {
    title: 'Plein Ete',
    slug: 'plein-ete',
    category: 'bouquets',
    badge: 'Saison',
    deliveryLabel: "Livraison des aujourd'hui",
    shortDescription:
      'Composition solaire et genereuse, pensee pour une table, un anniversaire ou une attention spontanee.',
    imageUrl:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85',
    featured: true,
    order: 3,
    price: { from: 38.9, currency: 'EUR', onRequest: false },
  },
  {
    title: 'Alchimie Gourmande',
    slug: 'alchimie-gourmande',
    category: 'cadeaux',
    badge: 'Avec cadeau',
    deliveryLabel: 'Livraison des demain',
    shortDescription:
      'Bouquet raffine accompagne d une douceur gourmande pour un cadeau complet.',
    imageUrl:
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=85',
    featured: true,
    order: 4,
    price: { from: 47.9, currency: 'EUR', onRequest: false },
  },
  {
    title: 'Bouquet de mariee',
    slug: 'bouquet-de-mariee',
    category: 'mariage',
    badge: 'Sur mesure',
    deliveryLabel: 'Devis personnalise',
    shortDescription:
      'Creation sur mesure, palette florale et finitions coordonnees a votre ceremonie.',
    imageUrl:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85',
    featured: false,
    order: 5,
    price: { from: 95, currency: 'EUR', onRequest: false },
  },
  {
    title: 'Gerbe hommage',
    slug: 'gerbe-hommage',
    category: 'deuil',
    badge: 'Accompagnement',
    deliveryLabel: 'Livraison ceremonie',
    shortDescription:
      'Composition sobre et elegante pour transmettre une attention respectueuse.',
    imageUrl:
      'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85',
    featured: true,
    order: 6,
    price: { from: 54.9, currency: 'EUR', onRequest: false },
  },
]

const expectedServiceSlugs = services.map((service) => service.slug)
console.log('Seed demo: archiving stale services')
const staleServices = await payload.find({
  collection: 'services',
  where: {
    and: [
      { site: { equals: site.id } },
      { slug: { not_in: expectedServiceSlugs } },
    ],
  },
  limit: 100,
})

for (const staleService of staleServices.docs) {
  await payload.update({
    collection: 'services',
    id: staleService.id,
    data: {
      status: 'archived',
    },
    overrideAccess: true,
  })
}

console.log('Seed demo: upserting services')
for (const service of services) {
  const existing = await payload.find({
    collection: 'services',
    where: {
      and: [{ site: { equals: site.id } }, { slug: { equals: service.slug } }],
    },
    limit: 1,
  })

  const data = {
    ...service,
    site: site.id,
    status: 'published',
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: 'services',
      id: existing.docs[0].id,
      data: data as never,
      overrideAccess: true,
    })
  } else {
    await payload.create({
      collection: 'services',
      data: data as never,
      overrideAccess: true,
    })
  }
}

console.log('Seed demo: premium demo site ready: fleuriste-martin')
await payload.destroy()
console.log('Seed demo: Payload destroyed')
process.exit(0)
