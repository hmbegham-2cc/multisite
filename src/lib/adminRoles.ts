type AdminUser = {
  role?: string
  sites?: Array<string | { id?: string }>
}

export function isPlatformAdmin(user?: AdminUser | null) {
  return user?.role === 'super-admin' || user?.role === 'internal-manager'
}

/** Pour `admin.hidden` sur une collection : true = masquer dans le menu. */
export function hideFromSiteOwners(user?: AdminUser | null) {
  return !isPlatformAdmin(user)
}

/** Pour `admin.condition` sur un champ : true = afficher le champ. */
export function showToPlatformAdminsOnly(user?: AdminUser | null) {
  return isPlatformAdmin(user)
}

/** Pages, produits, etc. se gèrent depuis la fiche Site — pas dans le menu latéral. */
export function hideContentCollectionsFromNav() {
  return true
}

export function canManageSiteContent(user?: AdminUser | null) {
  if (!user) return false
  if (user.role === 'viewer') return false
  return isPlatformAdmin(user) || Boolean(user.sites?.length)
}

export function showSiteField(user?: AdminUser | null) {
  if (!user) return true
  if (isPlatformAdmin(user)) return true
  return (user.sites?.length ?? 0) > 1
}

export function defaultSiteForUser(user?: AdminUser | null) {
  if (!user?.sites?.length || user.sites.length !== 1) return undefined
  const site = user.sites[0]
  return typeof site === 'object' ? site.id : site
}
