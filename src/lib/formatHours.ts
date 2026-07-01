const dayLabels: Record<string, string> = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
}

const dayOrder = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

type DayHours = {
  close?: string | null
  closed?: boolean | null
  open?: string | null
}

export function formatSiteHours(hours?: Record<string, DayHours> | null) {
  if (!hours) {
    return [
      { day: 'Lundi – Samedi', value: '9h – 19h' },
      { day: 'Dimanche', value: 'Fermé' },
    ]
  }

  return dayOrder.map((key) => {
    const entry = hours[key]
    const day = dayLabels[key] || key

    if (!entry || entry.closed) {
      return { day, value: 'Fermé' }
    }

    const open = entry.open?.replace(':00', 'h').replace(':', 'h') || '9h'
    const close = entry.close?.replace(':00', 'h').replace(':', 'h') || '19h'

    return { day, value: `${open} – ${close}` }
  })
}
