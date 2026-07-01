const filters = [
  { key: '', label: 'Tous' },
  { key: 'bouquets', label: 'Bouquets' },
  { key: 'mariage', label: 'Mariage' },
  { key: 'naissance', label: 'Naissance' },
  { key: 'amour', label: 'Amour' },
  { key: 'deuil', label: 'Deuil' },
  { key: 'cadeaux', label: 'Cadeaux' },
]

export function ShopFilters({
  activeCategory,
  activeOccasion,
  activeQuery,
  resultCount,
  siteSlug,
}: {
  activeCategory?: string
  activeOccasion?: string
  activeQuery?: string
  resultCount: number
  siteSlug: string
}) {
  return (
    <div className="shop-filters">
      <div className="shop-filters-row">
        {filters.map((filter) => {
          const isActive =
            (filter.key === '' && !activeCategory) || activeCategory === filter.key
          const href =
            filter.key === ''
              ? `/sites/${siteSlug}/bouquets`
              : `/sites/${siteSlug}/bouquets?category=${filter.key}`

          return (
            <a
              className={isActive ? 'is-active' : undefined}
              href={href}
              key={filter.key || 'all'}
            >
              {filter.label}
            </a>
          )
        })}
      </div>
      <p className="shop-filters-meta">
        {resultCount} produit{resultCount > 1 ? 's' : ''}
        {activeQuery ? ` pour « ${activeQuery} »` : ''}
        {activeOccasion ? ` · ${activeOccasion}` : ''}
      </p>
    </div>
  )
}
