import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const COUPONS = {
  BASECORE10: { code: 'BASECORE10', percent: 0.1 },
}

function itemKey(productId, color, size) {
  return [productId, color ?? '', size ?? ''].join('|')
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem(item, qty = 1) {
        const id = itemKey(item.productId, item.color, item.size)
        const existing = get().items.find((i) => i.id === id)
        const stock = Number(item.stock) > 0 ? Number(item.stock) : 99
        if (existing) {
          const next = Math.min(stock, existing.qty + qty)
          set({ items: get().items.map((i) => (i.id === id ? { ...i, qty: next } : i)) })
        } else {
          set({ items: [...get().items, { ...item, stock, id, qty: Math.min(stock, qty) }] })
        }
      },

      removeItem(id) {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      setQty(id, qty) {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, Math.min(i.stock || 99, qty)) } : i
          ),
        })
      },

      clear() {
        set({ items: [], coupon: null })
      },

      applyCoupon(code) {
        const found = COUPONS[code.trim().toUpperCase()]
        if (!found) return false
        set({ coupon: found })
        return true
      },

      removeCoupon() {
        set({ coupon: null })
      },

      count() {
        return get().items.reduce((sum, i) => sum + i.qty, 0)
      },

      subtotal() {
        return get().items.reduce((sum, i) => sum + Number(i.price) * i.qty, 0)
      },

      discount() {
        const c = get().coupon
        return c ? get().subtotal() * c.percent : 0
      },

      shipping() {
        const sub = get().subtotal()
        if (sub === 0) return 0
        const isVND = sub >= 10000
        const threshold = isVND ? 500000 : 299
        const flatFee = isVND ? 30000 : 24.9
        if (sub >= threshold) return 0
        return flatFee
      },

      total() {
        return Math.max(0, get().subtotal() - get().discount() + get().shipping())
      },
    }),
    {
      name: 'shop-cart',
      partialize: (s) => ({ items: s.items, coupon: s.coupon }),
    }
  )
)
