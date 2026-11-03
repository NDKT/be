import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '@/services/api'


let addressId = 100

export function parseJwt(token) {
  if (!token || typeof token !== 'string') return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem('token') || null,

      isAuthenticated() {
        const { user, token } = get()
        if (!user || !token) return false

        const payload = parseJwt(token)
        if (payload && payload.exp && payload.exp * 1000 < Date.now()) {
          return false
        }

        return true
      },

      isAdmin() {
        const { user, token } = get()
        if (!user || !token) return false

        // Token expiry verification
        const payload = parseJwt(token)
        if (payload) {
          if (payload.exp && payload.exp * 1000 < Date.now()) {
            return false
          }

          const jwtRole =
            payload['role'] ||
            payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            payload['Role']

          if (jwtRole && jwtRole !== 'Admin') {
            return false
          }
        }

        return user.role === 'Admin'
      },

      async login(emailOrUsername, password) {
        if (!emailOrUsername || !password) return false

        try {
          // Call BaseCore AuthService: /api/auth/login
          const res = await authApi.login(emailOrUsername, password)
          if (!res || !res.token) return false

          const payload = parseJwt(res.token)
          const tokenRole =
            payload?.['role'] ||
            payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            res.role ||
            'User'

          const user = {
            id: res.userId || payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
            name: res.name || res.username,
            email: res.email || (emailOrUsername.includes('@') ? emailOrUsername : `${emailOrUsername}@basecore.local`),
            username: res.username || payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            role: tokenRole,
            addresses: [],
          }

          localStorage.setItem('token', res.token)
          set({ user, token: res.token })
          return true
        } catch (err) {
          console.error('Đăng nhập thất bại:', err?.message || err)
          return false
        }
      },

      async register(name, email, password) {
        if (!name || !email || !password) return false

        try {
          const username = email.split('@')[0] || name.replace(/\s+/g, '').toLowerCase()
          await authApi.register({
            username,
            password,
            name,
            email,
          })

          // Auto login upon successful registration
          return await get().login(username, password)
        } catch (err) {
          console.error('Đăng ký tài khoản thất bại:', err?.message || err)
          return false
        }
      },

      logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ user: null, token: null })
      },

      addAddress(address) {
        const user = get().user
        if (!user) return
        const id = ++addressId
        const isFirst = user.addresses.length === 0
        set({
          user: {
            ...user,
            addresses: [...user.addresses, { ...address, id, isDefault: isFirst || address.isDefault }],
          },
        })
      },

      removeAddress(id) {
        const user = get().user
        if (!user) return
        set({ user: { ...user, addresses: user.addresses.filter((a) => a.id !== id) } })
      },
    }),
    { name: 'shop-auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
)
