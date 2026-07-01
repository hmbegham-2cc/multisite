'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  getCartStorageKey,
  getCartTotal,
  type CartItem,
} from '@/lib/cart/types'

type CartContextValue = {
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  clearCart: () => void
  itemCount: number
  items: CartItem[]
  removeItem: (serviceId: string) => void
  total: number
  hasUnknownPrice: boolean
  updateQuantity: (serviceId: string, quantity: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({
  children,
  siteSlug,
}: {
  children: ReactNode
  siteSlug: string
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(getCartStorageKey(siteSlug))
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[]
        if (Array.isArray(parsed)) setItems(parsed)
      }
    } catch {
      setItems([])
    } finally {
      setReady(true)
    }
  }, [siteSlug])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem(getCartStorageKey(siteSlug), JSON.stringify(items))
  }, [items, ready, siteSlug])

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((entry) => entry.serviceId === item.serviceId)
        if (existing) {
          return current.map((entry) =>
            entry.serviceId === item.serviceId
              ? { ...entry, quantity: entry.quantity + quantity }
              : entry,
          )
        }
        return [...current, { ...item, quantity }]
      })
    },
    [],
  )

  const updateQuantity = useCallback((serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((current) => current.filter((entry) => entry.serviceId !== serviceId))
      return
    }
    setItems((current) =>
      current.map((entry) =>
        entry.serviceId === serviceId ? { ...entry, quantity } : entry,
      ),
    )
  }, [])

  const removeItem = useCallback((serviceId: string) => {
    setItems((current) => current.filter((entry) => entry.serviceId !== serviceId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo(() => {
    const { total, hasUnknown } = getCartTotal(items)
    return {
      addItem,
      clearCart,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      items,
      removeItem,
      total,
      hasUnknownPrice: hasUnknown,
      updateQuantity,
    }
  }, [addItem, clearCart, items, removeItem, updateQuantity])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
