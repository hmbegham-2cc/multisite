import { resolveSiteSlugFromHost } from '@/lib/resolveSiteSlug'

export async function GET(request: Request) {
  const host = new URL(request.url).searchParams.get('host') || ''
  const slug = await resolveSiteSlugFromHost(host)

  return Response.json({ slug })
}
