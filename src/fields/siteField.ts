import type { Field } from 'payload'

import { defaultSiteForUser, showSiteField } from '@/lib/adminRoles'

export const siteField: Field = {
  name: 'site',
  type: 'relationship',
  relationTo: 'sites',
  required: true,
  index: true,
  defaultValue: ({ user }) => defaultSiteForUser(user as never),
  admin: {
    description: 'Site auquel ce contenu est rattaché.',
    condition: (_data, _siblingData, { user }) => showSiteField(user as never),
  },
}
