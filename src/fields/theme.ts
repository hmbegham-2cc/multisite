import type { Field } from 'payload'

export const themeFields: Field[] = [
  { name: 'primaryColor', type: 'text', defaultValue: '#2D5A27' },
  { name: 'secondaryColor', type: 'text', defaultValue: '#F5E6D3' },
  { name: 'accentColor', type: 'text', defaultValue: '#C41E3A' },
  { name: 'fontHeading', type: 'text', defaultValue: 'Playfair Display' },
  { name: 'fontBody', type: 'text', defaultValue: 'Inter' },
  {
    name: 'borderRadius',
    type: 'select',
    defaultValue: 'medium',
    options: ['small', 'medium', 'large'],
  },
]
