import { create } from 'zustand'
import { persist } from 'zustand/middleware'

let toastId = 0

export const useUiStore = create(
  persist(
    (set, get) => ({
      darkMode: false,
      cartDrawerOpen: false,
      toasts: [],

      toggleDarkMode() {
        set({ darkMode: !get().darkMode })
        get().applyTheme()
      },
      applyTheme() {
        const root = document.documentElement
        if (get().darkMode) root.classList.add('dark')
        else root.classList.remove('dark')
      },
      openCartDrawer() {
        set({ cartDrawerOpen: true })
      },
      closeCartDrawer() {
        set({ cartDrawerOpen: false })
      },
      notify(message, type = 'info', duration = 3500) {
        const id = ++toastId
        set({ toasts: [...get().toasts, { id, message, type, duration }] })
        setTimeout(() => get().dismissToast(id), duration)
      },
      notifySuccess(message) {
        get().notify(message, 'success')
      },
      notifyError(message) {
        get().notify(message, 'error')
      },
      dismissToast(id) {
        set({ toasts: get().toasts.filter((t) => t.id !== id) })
      },
    }),
    {
      name: 'shop-ui',
      partialize: (s) => ({ darkMode: s.darkMode }),
    }
  )
)
