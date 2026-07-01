import type { CollectionConfig } from 'payload'

import { manageOwnSites } from '@/access/roles'
import { defaultSiteForUser, hideContentCollectionsFromNav, showSiteField, showToPlatformAdminsOnly } from '@/lib/adminRoles'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Média',
    plural: 'Médias',
  },
  upload: true,
  admin: {
    useAsTitle: 'alt',
    hidden: hideContentCollectionsFromNav,
    defaultColumns: ['alt', 'filename', 'updatedAt'],
  },
  access: {
    create: manageOwnSites,
    delete: manageOwnSites,
    read: () => true,
    update: manageOwnSites,
  },
  fields: [
    { name: 'alt', type: 'text', required: true, label: 'Texte alternatif' },
    { name: 'caption', type: 'text', label: 'Légende' },
    {
      name: 'scope',
      type: 'select',
      defaultValue: 'site',
      options: [
        { label: 'Global', value: 'global' },
        { label: 'Modèle', value: 'template' },
        { label: 'Site', value: 'site' },
      ],
      required: true,
      admin: { condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never) },
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      index: true,
      defaultValue: ({ user }) => defaultSiteForUser(user as never),
      admin: {
        condition: (_d, _s, { user }) => showSiteField(user as never),
      },
    },
  ],
}
