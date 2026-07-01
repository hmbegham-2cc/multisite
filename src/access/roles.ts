import type { AccessArgs, Where } from 'payload'

type Role = 'super-admin' | 'internal-manager' | 'client' | 'editor' | 'viewer'

type UserWithRole = {
  role?: Role
  sites?: Array<string | { id?: string }>
}

const getSiteIds = (user: UserWithRole | null | undefined) =>
  (user?.sites || [])
    .map((site) => (typeof site === 'string' ? site : site.id))
    .filter(Boolean) as string[]

export const isSuperAdmin = ({ req }: AccessArgs) => req.user?.role === 'super-admin'

export const isInternal = ({ req }: AccessArgs) =>
  req.user?.role === 'super-admin' || req.user?.role === 'internal-manager'

export const internalOrOwnSites = ({ req }: AccessArgs): boolean | Where => {
  if (!req.user) return false
  const user = req.user as UserWithRole
  if (user.role === 'super-admin' || user.role === 'internal-manager') return true

  const siteIds = getSiteIds(user)
  if (!siteIds.length) return false

  return {
    site: {
      in: siteIds,
    },
  }
}

export const manageOwnSites = ({ req }: AccessArgs): boolean | Where => {
  if (!req.user) return false
  const user = req.user as UserWithRole
  if (user.role === 'viewer') return false
  return internalOrOwnSites({ req })
}

export const authenticated = ({ req }: AccessArgs) => Boolean(req.user)
