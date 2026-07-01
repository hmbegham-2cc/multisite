import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

type PayloadCache = {
  client: Payload | null
  promise: Promise<Payload> | null
}

declare global {
  // eslint-disable-next-line no-var
  var __payloadCache: PayloadCache | undefined
}

const cache: PayloadCache = global.__payloadCache || {
  client: null,
  promise: null,
}

if (!global.__payloadCache) {
  global.__payloadCache = cache
}

export async function getPayloadClient() {
  if (cache.client) {
    return cache.client
  }

  if (!cache.promise) {
    cache.promise = getPayload({ config: configPromise })
  }

  try {
    cache.client = await cache.promise
  } catch (error) {
    cache.promise = null
    cache.client = null
    throw error
  }

  if (!cache.client) {
    throw new Error('Payload client failed to initialize')
  }

  return cache.client
}
