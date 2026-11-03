import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      ids: [],
      toggle(id) {
        const ids = get().ids
        set({ ids: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] })
      },
      clear() {
        set({ ids: [] })
      },
    }),
    { name: 'shop-wishlist' }
  )
)
