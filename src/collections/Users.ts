import type { CollectionConfig } from 'payload'

import { isInternal, isSuperAdmin } from '@/access/roles'
import { hideFromSiteOwners } from '@/lib/adminRoles'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Utilisateur',
    plural: 'Utilisateurs',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Plateforme',
    hidden: ({ user }) => hideFromSiteOwners(user as never),
  },
  access: {
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: isInternal,
    update: isInternal,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'viewer',
      options: [
        'super-admin',
        'internal-manager',
        'client',
        'editor',
        'viewer',
      ],
    },
    {
      name: 'clients',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
    },
    {
      name: 'sites',
      type: 'relationship',
      relationTo: 'sites',
      hasMany: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
  ],
}
