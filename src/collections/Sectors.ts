import type { CollectionConfig } from 'payload'

import { isInternal } from '@/access/roles'
import { hideFromSiteOwners } from '@/lib/adminRoles'

export const Sectors: CollectionConfig = {
  slug: 'sectors',
  labels: { singular: 'Secteur', plural: 'Secteurs' },
  admin: {
    useAsTitle: 'name',
    group: 'Plateforme',
    hidden: ({ user }) => hideFromSiteOwners(user as never),
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
    { name: 'icon', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
  ],
}
