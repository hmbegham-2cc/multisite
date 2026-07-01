import type { CollectionConfig } from 'payload'

import { internalOrOwnSites, isInternal } from '@/access/roles'
import { readPublishedSites } from '@/access/public'
import { showToPlatformAdminsOnly } from '@/lib/adminRoles'
import { themeFields } from '@/fields/theme'
import { cloneTemplatePagesAfterCreate } from '@/hooks/cloneTemplatePagesAfterCreate'
import { publishSiteContentWhenPublished } from '@/hooks/publishSiteContentWhenPublished'

export const Sites: CollectionConfig = {
  slug: 'sites',
  labels: {
    singular: 'Site',
    plural: 'Sites',
  },
  admin: {
    useAsTitle: 'name',
    description: 'Ouvrez un site → les pages viennent du modèle choisi.',
    defaultColumns: ['name', 'slug', 'status', 'updatedAt'],
    components: {
      edit: {
        beforeDocumentControls: ['@/components/admin/SiteEditHeader#SiteEditHeader'],
      },
    },
  },
  access: {
    create: isInternal,
    delete: isInternal,
    read: readPublishedSites,
    update: internalOrOwnSites,
  },
  hooks: {
    afterChange: [cloneTemplatePagesAfterCreate, publishSiteContentWhenPublished],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Identité',
          description: 'Choisissez le modèle puis enregistrez : toutes les pages du modèle sont créées automatiquement.',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Nom du site' },
            {
              name: 'template',
              type: 'relationship',
              relationTo: 'templates',
              required: true,
              label: 'Modèle',
              admin: {
                condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never),
                description:
                  'Obligatoire à la création. Enregistrez le site → Accueil, Bouquets, Contact, etc. sont assignés d’un coup.',
              },
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              label: 'Identifiant URL',
              admin: { description: 'Ex. fleuriste-dupont → /sites/fleuriste-dupont' },
            },
            {
              name: 'status',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Brouillon', value: 'draft' },
                { label: 'Publié', value: 'published' },
                { label: 'Archivé', value: 'archived' },
              ],
              required: true,
              label: 'Statut',
              admin: {
                description: 'Publié = site en ligne + pages en brouillon publiées automatiquement.',
              },
            },
            {
              name: 'client',
              type: 'relationship',
              relationTo: 'clients',
              required: true,
              label: 'Client',
              admin: { condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never) },
            },
            {
              name: 'sector',
              type: 'relationship',
              relationTo: 'sectors',
              label: 'Secteur',
              admin: { condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never) },
            },
          ],
        },
        {
          label: 'Contenu',
          description: 'Pages assignées depuis le modèle — cliquez pour modifier le contenu.',
          fields: [
            {
              name: 'templatePagesGuide',
              type: 'ui',
              admin: {
                components: {
                  Field: '@/components/admin/SiteTemplateContentPanel#SiteTemplateContentPanel',
                },
              },
            },
            {
              name: 'sitePages',
              type: 'join',
              collection: 'pages',
              on: 'site',
              label: 'Pages assignées',
              admin: {
                description: 'Liste des pages du modèle rattachées à ce site. Édition uniquement.',
                defaultColumns: ['title', 'slug', 'status', 'isHomepage'],
                allowCreate: false,
              },
            },
            {
              name: 'siteServices',
              type: 'join',
              collection: 'services',
              on: 'site',
              label: 'Produits',
              admin: {
                description: 'Bouquets et articles de la boutique.',
                defaultColumns: ['title', 'slug', 'status', 'price'],
              },
            },
            {
              name: 'siteBookings',
              type: 'join',
              collection: 'bookings',
              on: 'site',
              label: 'Demandes clients',
              admin: {
                description: 'Réservations et messages reçus depuis le site.',
                defaultColumns: ['customerName', 'eventType', 'status', 'submittedAt'],
                allowCreate: false,
              },
            },
          ],
        },
        {
          label: 'Apparence',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo' },
            { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon' },
            { name: 'theme', type: 'group', label: 'Thème', fields: themeFields },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Coordonnées',
              fields: [
                { name: 'phone', type: 'text', label: 'Téléphone' },
                { name: 'email', type: 'email', label: 'Email' },
                { name: 'address', type: 'textarea', label: 'Adresse' },
                { name: 'hours', type: 'json', label: 'Horaires (JSON)' },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Réseaux sociaux',
              fields: [
                { name: 'platform', type: 'text', required: true, label: 'Plateforme' },
                { name: 'url', type: 'text', required: true, label: 'URL' },
              ],
            },
          ],
        },
        {
          label: 'Domaine',
          fields: [
            { name: 'domain', type: 'text', unique: true, label: 'Domaine personnalisé' },
            { name: 'subdomain', type: 'text', unique: true, label: 'Sous-domaine' },
            { name: 'useCustomDomain', type: 'checkbox', defaultValue: false, label: 'Utiliser le domaine custom' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'Référencement',
              fields: [
                { name: 'defaultTitle', type: 'text', label: 'Titre par défaut' },
                { name: 'description', type: 'textarea', label: 'Description' },
                { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Image Open Graph' },
              ],
            },
            { name: 'publishedAt', type: 'date', label: 'Date de publication' },
            {
              name: 'clonedFromTemplateAt',
              type: 'date',
              label: 'Cloné depuis le modèle le',
              admin: { readOnly: true, condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never) },
            },
            {
              name: 'templateVersion',
              type: 'text',
              label: 'Version modèle',
              admin: { condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never) },
            },
          ],
        },
      ],
    },
  ],
}
