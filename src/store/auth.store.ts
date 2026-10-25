import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser } from '../api/query-list/auth.query'

interface AuthState {
  user: AuthUser | null
  token: {
    accessToken: string | null
    refreshToken: string | null
  }
  setUser: (user: AuthUser | null) => void
  setToken: (tokens: { accessToken: string | null; refreshToken?: string | null }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: {
        accessToken: null,
        refreshToken: null,
      },
      setUser: (user) => set({ user }),
      setToken: ({ accessToken, refreshToken }) =>
        set({
          token: {
            accessToken,
            refreshToken: refreshToken ?? null,
          },
        }),
      clearAuth: () =>
        set({
          user: null,
          token: {
            accessToken: null,
            refreshToken: null,
          },
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
