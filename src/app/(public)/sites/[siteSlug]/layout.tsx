import { SiteLayoutShell } from '@/components/public/SiteLayoutShell'

export const revalidate = 60

type Props = {
  children: React.ReactNode
  params: Promise<{ siteSlug: string }>
}

export default async function SiteLayout({ children, params }: Props) {
  const { siteSlug } = await params
  return <SiteLayoutShell siteSlug={siteSlug}>{children}</SiteLayoutShell>
}
