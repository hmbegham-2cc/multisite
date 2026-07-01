type Props = {
  children?: React.ReactNode
  eyebrow?: string
  lead?: string
  title: string
  variant?: 'default' | 'compact' | 'shop'
}

export function PageHeader({
  children,
  eyebrow,
  lead,
  title,
  variant = 'default',
}: Props) {
  return (
    <header className={`page-header page-header--${variant}`}>
      <div className="page-header-inner">
        {eyebrow ? <p className="site-kicker">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {lead ? <p className="page-header-lead">{lead}</p> : null}
        {children}
      </div>
    </header>
  )
}
