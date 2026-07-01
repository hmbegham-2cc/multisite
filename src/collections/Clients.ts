import type { CollectionConfig } from 'payload'

import { isInternal } from '@/access/roles'
import { hideFromSiteOwners } from '@/lib/adminRoles'

export const Clients: CollectionConfig = {
  slug: 'clients',
  labels: {
    singular: 'Client',
    plural: 'Clients',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Plateforme',
    hidden: ({ user }) => hideFromSiteOwners(user as never),
  },
  access: {
    create: isInternal,
    delete: isInternal,
    read: isInternal,
    update: isInternal,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'contactEmail', type: 'email' },
    { name: 'contactPhone', type: 'text' },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        { name: 'address', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'France' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: ['active', 'inactive'],
      required: true,
    },
    { name: 'notes', type: 'textarea' },
  ],
}
