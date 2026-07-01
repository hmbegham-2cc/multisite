import type { LucideIcon, LucideProps } from 'lucide-react'

type SiteIconProps = LucideProps & {
  icon: LucideIcon
}

export function SiteIcon({
  className,
  icon: Icon,
  size = 20,
  strokeWidth = 1.75,
  ...props
}: SiteIconProps) {
  return (
    <Icon
      aria-hidden
      className={className ? `site-icon ${className}` : 'site-icon'}
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  )
}
