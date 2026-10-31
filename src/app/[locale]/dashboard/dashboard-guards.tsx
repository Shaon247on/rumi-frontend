'use client'

import { useRouter } from '@/i18n/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useEffect, useState } from 'react'

/** Admins only. The API enforces this too; here it just keeps others off the page. */
export const DashboardGuards = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.token.accessToken)
  const [isMounted, setIsMounted] = useState(false)

  // The auth store reads localStorage, so it is only reliable after mounting
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  const isAdmin = Boolean(accessToken) && user?.role === 'admin'

  useEffect(() => {
    if (isMounted && !isAdmin) {
      router.replace(accessToken ? '/' : '/login')
    }
  }, [accessToken, isAdmin, isMounted, router])

  if (!isMounted || !isAdmin) return null

  return children
}
