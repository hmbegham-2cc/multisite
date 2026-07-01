import type { CSSProperties } from 'react'

type SiteTheme = {
  accentColor?: null | string
  borderRadius?: 'large' | 'medium' | 'small' | null
  fontBody?: null | string
  fontHeading?: null | string
  primaryColor?: null | string
  secondaryColor?: null | string
}

const radiusMap = {
  large: '12px',
  medium: '8px',
  small: '4px',
} as const

export function getSiteThemeStyle(theme?: SiteTheme | null): CSSProperties {
  const radius = radiusMap[theme?.borderRadius || 'medium']

  return {
    '--site-accent': theme?.accentColor || '#df5a2e',
    '--site-font-body': theme?.fontBody
      ? `'${theme.fontBody}', Inter, Arial, sans-serif`
      : 'Inter, Arial, sans-serif',
    '--site-font-heading': theme?.fontHeading
      ? `'${theme.fontHeading}', Georgia, 'Times New Roman', serif`
      : `Georgia, 'Times New Roman', serif`,
    '--site-primary': theme?.primaryColor || '#264b2d',
    '--site-radius': radius,
    '--site-secondary': theme?.secondaryColor || '#f6eee3',
  } as CSSProperties
}
