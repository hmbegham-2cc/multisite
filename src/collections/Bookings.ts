import type { CollectionConfig } from 'payload'

import { isInternal, manageOwnSites } from '@/access/roles'
import { hideContentCollectionsFromNav, showToPlatformAdminsOnly } from '@/lib/adminRoles'
import { siteField } from '@/fields/siteField'

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Demande',
    plural: 'Demandes clients',
  },
  admin: {
    useAsTitle: 'customerName',
    hidden: hideContentCollectionsFromNav,
    defaultColumns: ['customerName', 'eventType', 'status', 'submittedAt'],
  },
  access: {
    create: () => true,
    delete: isInternal,
    read: manageOwnSites,
    update: manageOwnSites,
  },
  fields: [
    siteField,
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'En attente', value: 'pending' },
        { label: 'Confirmée', value: 'confirmed' },
        { label: 'Annulée', value: 'cancelled' },
        { label: 'Terminée', value: 'completed' },
      ],
      required: true,
      label: 'Statut',
    },
    { name: 'customerName', type: 'text', required: true, label: 'Nom client' },
    { name: 'customerEmail', type: 'email', required: true, label: 'Email' },
    { name: 'customerPhone', type: 'text', label: 'Téléphone' },
    { name: 'eventDate', type: 'date', label: 'Date souhaitée' },
    {
      name: 'eventType',
      type: 'select',
      label: 'Type de demande',
      options: [
        { label: 'Livraison / bouquet', value: 'delivery' },
        { label: 'Mariage', value: 'wedding' },
        { label: 'Deuil', value: 'funeral' },
        { label: 'Autre', value: 'other' },
      ],
    },
    { name: 'message', type: 'textarea', required: true, label: 'Message' },
    { name: 'budget', type: 'number', label: 'Budget (€)' },
    { name: 'deliveryAddress', type: 'textarea', label: 'Adresse de livraison' },
    {
      name: 'deliverySlot',
      type: 'select',
      label: 'Créneau',
      options: [
        { label: 'Matin', value: 'morning' },
        { label: 'Après-midi', value: 'afternoon' },
        { label: 'Soir', value: 'evening' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Paiement',
      options: [
        { label: 'À la livraison', value: 'on-delivery' },
        { label: 'Lien en ligne', value: 'online-link' },
      ],
    },
    { name: 'orderTotal', type: 'number', label: 'Total commande (€)' },
    {
      name: 'orderItems',
      type: 'array',
      label: 'Articles commandés',
      fields: [
        { name: 'serviceId', type: 'text', label: 'ID produit' },
        { name: 'title', type: 'text', label: 'Titre' },
        { name: 'quantity', type: 'number', label: 'Quantité' },
        { name: 'unitPrice', type: 'number', label: 'Prix unitaire' },
        { name: 'lineTotal', type: 'number', label: 'Total ligne' },
      ],
    },
    { name: 'sourcePage', type: 'text', label: 'Page source' },
    { name: 'submittedAt', type: 'date', defaultValue: () => new Date(), label: 'Reçu le' },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Notes internes',
      admin: { condition: (_d, _s, { user }) => showToPlatformAdminsOnly(user as never) },
      access: {
        read: ({ req }) =>
          req.user?.role === 'super-admin' || req.user?.role === 'internal-manager',
        update: ({ req }) =>
          req.user?.role === 'super-admin' || req.user?.role === 'internal-manager',
      },
    },
  ],
}
