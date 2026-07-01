import type { Access, AccessArgs, Where } from 'payload'

type UserWithRole = {
  role?: 'super-admin' | 'internal-manager' | 'client' | 'editor' | 'viewer'
  sites?: Array<string | { id?: string }>
}

const getSiteIds = (user: UserWithRole | null | undefined) =>
  (user?.sites || [])
    .map((site) => (typeof site === 'string' ? site : site.id))
    .filter(Boolean) as string[]

function readOwnSitesOrInternal({ req }: AccessArgs): boolean | Where {
  const user = req.user as UserWithRole | undefined

  if (!user) {
    return {
      status: {
        equals: 'published',
      },
    } as Where
  }

  if (user.role === 'super-admin' || user.role === 'internal-manager') {
    return true
  }

  const siteIds = getSiteIds(user)
  if (!siteIds.length) {
    return false
  }

  return {
    site: {
      in: siteIds,
    },
  } as Where
}

/** Public: published only. Authenticated: own sites or internal roles. */
export const readPublishedOrOwnSites: Access = ({ req }) => readOwnSitesOrInternal({ req })

/** Public: published sites only. Authenticated: internal or assigned sites. */
export const readPublishedSites: Access = ({ req }) => {
  const user = req.user as UserWithRole | undefined

  if (!user) {
    return {
      status: {
        equals: 'published',
      },
    } as Where
  }

  if (user.role === 'super-admin' || user.role === 'internal-manager') {
    return true
  }

  const siteIds = getSiteIds(user)
  if (!siteIds.length) {
    return false
  }

  return {
    id: {
      in: siteIds,
    },
  } as Where
}
