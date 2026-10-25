'use client'

import { useRouter } from '@/i18n/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useEffect, useState } from 'react'

export const PrivetRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, token } = useAuthStore()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  // Ensure Zustand is hydrated on the client before checking auth state
  // We use setTimeout to avoid synchronous setState warnings in the effect
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isMounted) {
      if (!user?.email && !token.accessToken) {
        router.push('/login')
      }
    }
  }, [user, token, router, isMounted])

  if (!isMounted || (!user?.email && !token.accessToken)) {
    return null
  }

  return <>{children}</>
}
