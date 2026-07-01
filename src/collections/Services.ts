import type { CollectionConfig } from 'payload'

import { manageOwnSites } from '@/access/roles'
import { readPublishedOrOwnSites } from '@/access/public'
import { hideContentCollectionsFromNav } from '@/lib/adminRoles'
import { siteField } from '@/fields/siteField'

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Produit',
    plural: 'Produits',
  },
  admin: {
    useAsTitle: 'title',
    hidden: hideContentCollectionsFromNav,
    defaultColumns: ['title', 'price.from', 'status', 'featured', 'order'],
  },
  access: {
    create: manageOwnSites,
    delete: manageOwnSites,
    read: readPublishedOrOwnSites,
    update: manageOwnSites,
  },
  fields: [
    siteField,
    { name: 'title', type: 'text', required: true, label: 'Nom du produit' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      label: 'URL produit',
      admin: { description: 'Ex. melodie-des-jardins-s' },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'bouquets',
      label: 'Catégorie',
      options: [
        { label: 'Bouquets', value: 'bouquets' },
        { label: 'Mariage', value: 'mariage' },
        { label: 'Naissance', value: 'naissance' },
        { label: 'Amour', value: 'amour' },
        { label: 'Deuil', value: 'deuil' },
        { label: 'Cadeaux', value: 'cadeaux' },
      ],
    },
    { name: 'badge', type: 'text', label: 'Badge' },
    { name: 'deliveryLabel', type: 'text', defaultValue: "Livraison dès aujourd'hui", label: 'Label livraison' },
    { name: 'description', type: 'richText', label: 'Description complète' },
    { name: 'shortDescription', type: 'textarea', label: 'Description courte' },
    { name: 'composition', type: 'textarea', label: 'Composition florale' },
    { name: 'deliveryDetails', type: 'textarea', label: 'Détails livraison' },
    { name: 'reference', type: 'text', label: 'Référence' },
    { name: 'sku', type: 'text', label: 'SKU' },
    { name: 'deliveryFeeFrom', type: 'number', defaultValue: 9.95, label: 'Frais livraison dès' },
    {
      name: 'gallery',
      type: 'array',
      label: 'Galerie photos',
      fields: [{ name: 'imageUrl', type: 'text', required: true, label: 'URL image' }],
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Formules / tailles',
      admin: { description: 'Ex. S, M, L avec un prix chacun.' },
      fields: [
        { name: 'label', type: 'text', required: true, label: 'Libellé' },
        { name: 'code', type: 'text', label: 'Code' },
        { name: 'price', type: 'number', required: true, label: 'Prix (€)' },
      ],
    },
    {
      name: 'addOns',
      type: 'array',
      label: 'Options / attentions',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Nom' },
        { name: 'price', type: 'number', required: true, label: 'Prix (€)' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'Photo principale' },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'URL image (alternative)',
      admin: { description: 'Si vous n\'utilisez pas encore la médiathèque.' },
    },
    {
      name: 'price',
      type: 'group',
      label: 'Prix',
      fields: [
        { name: 'from', type: 'number', label: 'Prix à partir de (€)' },
        { name: 'to', type: 'number', label: 'Prix max (€)' },
        { name: 'currency', type: 'text', defaultValue: 'EUR', label: 'Devise' },
        { name: 'onRequest', type: 'checkbox', defaultValue: false, label: 'Sur devis uniquement' },
      ],
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, label: 'Mis en avant' },
    { name: 'order', type: 'number', defaultValue: 0, label: 'Ordre d\'affichage' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Brouillon', value: 'draft' },
        { label: 'Publié', value: 'published' },
        { label: 'Archivé', value: 'archived' },
      ],
      required: true,
      label: 'Statut',
    },
  ],
}
