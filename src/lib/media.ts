type MaybeMedia =
  | null
  | number
  | string
  | {
      alt?: null | string
      url?: null | string
    }
  | undefined

export function getMediaUrl(media: MaybeMedia) {
  if (!media || typeof media !== 'object') return undefined
  return media.url || undefined
}

export function getMediaAlt(media: MaybeMedia, fallback = '') {
  if (!media || typeof media !== 'object') return fallback
  return media.alt || fallback
}
