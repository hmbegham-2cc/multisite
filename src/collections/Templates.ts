import type { CollectionConfig } from 'payload'

import { isInternal } from '@/access/roles'
import { hideFromSiteOwners } from '@/lib/adminRoles'
import { themeFields } from '@/fields/theme'

export const Templates: CollectionConfig = {
  slug: 'templates',
  labels: {
    singular: 'Modèle',
    plural: 'Modèles',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Plateforme',
    hidden: ({ user }) => hideFromSiteOwners(user as never),
    description: 'Modèles utilisés pour créer automatiquement pages et produits de démo.',
  },
  access: {
    create: isInternal,
    delete: isInternal,
    read: () => true,
    update: isInternal,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'sector', type: 'relationship', relationTo: 'sectors' },
    { name: 'description', type: 'textarea' },
    { name: 'previewImage', type: 'upload', relationTo: 'media' },
    {
      name: 'defaultTheme',
      type: 'group',
      fields: themeFields,
    },
    {
      name: 'defaultPages',
      type: 'array',
      label: 'Pages par défaut',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Titre' },
        { name: 'slug', type: 'text', required: true, label: 'Slug' },
        { name: 'eyebrow', type: 'text', label: 'Sur-titre' },
        { name: 'excerpt', type: 'textarea', label: 'Introduction' },
        { name: 'isHomepage', type: 'checkbox', defaultValue: false, label: 'Accueil' },
        { name: 'blocksJson', type: 'json', label: 'Blocs JSON' },
        {
          name: 'seo',
          type: 'group',
          label: 'SEO',
          fields: [
            { name: 'title', type: 'text', label: 'Titre SEO' },
            { name: 'description', type: 'textarea', label: 'Description SEO' },
          ],
        },
      ],
    },
    {
      name: 'defaultServices',
      type: 'array',
      label: 'Produits de démo',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Nom' },
        { name: 'slug', type: 'text', required: true, label: 'Slug' },
        { name: 'category', type: 'text', label: 'Catégorie' },
        { name: 'badge', type: 'text', label: 'Badge' },
        { name: 'deliveryLabel', type: 'text', label: 'Label livraison' },
        { name: 'shortDescription', type: 'textarea', label: 'Description courte' },
        { name: 'imageUrl', type: 'text', label: 'URL image' },
        { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Mis en avant' },
        { name: 'order', type: 'number', defaultValue: 0, label: 'Ordre' },
        {
          name: 'price',
          type: 'group',
          label: 'Prix',
          fields: [
            { name: 'from', type: 'number', label: 'Prix (€)' },
            { name: 'currency', type: 'text', defaultValue: 'EUR' },
            { name: 'onRequest', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'defaultBlocks',
      type: 'json',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
