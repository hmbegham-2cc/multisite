import type { CollectionConfig } from 'payload'

import { isInternal, manageOwnSites } from '@/access/roles'
import { readPublishedOrOwnSites } from '@/access/public'
import { hideContentCollectionsFromNav, showToPlatformAdminsOnly } from '@/lib/adminRoles'
import { siteField } from '@/fields/siteField'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Page',
    plural: 'Pages',
  },
  admin: {
    useAsTitle: 'title',
    hidden: hideContentCollectionsFromNav,
    defaultColumns: ['title', 'slug', 'status', 'isHomepage', 'updatedAt'],
  },
  access: {
    create: isInternal,
    delete: isInternal,
    read: readPublishedOrOwnSites,
    update: manageOwnSites,
  },
  fields: [
    siteField,
    { name: 'title', type: 'text', required: true, label: 'Titre' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      label: 'URL',
      admin: {
        readOnly: true,
        description: 'Définie par le modèle — non modifiable.',
      },
    },
    { name: 'eyebrow', type: 'text', label: 'Sur-titre' },
    { name: 'excerpt', type: 'textarea', label: 'Introduction' },
    { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Image hero' },
    {
      name: 'isHomepage',
      type: 'checkbox',
      defaultValue: false,
      label: "Page d'accueil",
      admin: { readOnly: true, description: 'Définie par le modèle.' },
    },
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
    {
      name: 'layout',
      type: 'json',
      label: 'Blocs de contenu',
      admin: {
        description: 'Réservé à l’équipe technique.',
        condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never),
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'title', type: 'text', label: 'Titre SEO' },
        { name: 'description', type: 'textarea', label: 'Description SEO' },
        { name: 'noIndex', type: 'checkbox', defaultValue: false, label: 'Ne pas indexer' },
      ],
    },
    {
      name: 'sourceTemplatePageId',
      type: 'text',
      admin: { readOnly: true, condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never) },
    },
    {
      name: 'contentScope',
      type: 'select',
      defaultValue: 'site',
      options: ['global', 'template', 'site'],
      required: true,
      admin: { condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never) },
    },
  ],
}
