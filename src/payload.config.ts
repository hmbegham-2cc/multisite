import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Bookings } from './collections/Bookings'
import { Clients } from './collections/Clients'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Sectors } from './collections/Sectors'
import { Services } from './collections/Services'
import { Sites } from './collections/Sites'
import { Templates } from './collections/Templates'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

const databaseUri = process.env.DATABASE_URI || ''
const usesSupabase = databaseUri.includes('supabase.com')

const withProtocol = (value?: string | null) => {
  if (!value) return null
  return value.startsWith('http') ? value : `https://${value}`
}

// Autorise l'origine locale + les URLs Vercel (déploiement courant + prod) pour éviter les 403 CSRF.
const allowedOrigins = Array.from(
  new Set(
    [
      serverURL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      withProtocol(process.env.VERCEL_URL),
      withProtocol(process.env.VERCEL_PROJECT_PRODUCTION_URL),
      withProtocol(process.env.VERCEL_BRANCH_URL),
    ].filter(Boolean) as string[],
  ),
)

export default buildConfig({
  admin: {
    suppressHydrationWarning: true,
    user: Users.slug,
    meta: {
      titleSuffix: ' — Usine à sites',
    },
    components: {
      beforeDashboard: ['@/components/admin/SitesHomeDashboard#SitesHomeDashboard'],
    },
  },
  collections: [
    Sites,
    Pages,
    Services,
    Bookings,
    Media,
    Clients,
    Templates,
    Sectors,
    Users,
  ],
  cors: allowedOrigins,
  csrf: allowedOrigins,
  db: postgresAdapter({
    pool: {
      connectionString: databaseUri,
      max: Number(process.env.DATABASE_POOL_MAX || 5),
      ...(usesSupabase ? { ssl: { rejectUnauthorized: false } } : {}),
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true',
  }),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
