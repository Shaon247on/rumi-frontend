'use client'

import { useCallback, useSyncExternalStore } from 'react'

type UseExpiringDismissalReturn = {
  isReady: boolean
  isDismissed: boolean
  dismiss: () => void
  reset: () => void
}

type ExpiringDismissalValue = {
  expiresAt: number
}

type DismissalSnapshot = 'pending' | 'shown' | 'dismissed'

const dismissalListeners = new Set<() => void>()

const notifyDismissalListeners = () => {
  for (const listener of dismissalListeners) {
    listener()
  }
}

const readDismissalSnapshot = (key: string): DismissalSnapshot => {
  if (typeof window === 'undefined') {
    return 'pending'
  }

  try {
    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
      return 'shown'
    }

    const value = JSON.parse(rawValue) as ExpiringDismissalValue
    const isExpired = Date.now() >= value.expiresAt

    if (isExpired) {
      window.localStorage.removeItem(key)
      return 'shown'
    }

    return 'dismissed'
  } catch {
    return 'shown'
  }
}

const subscribeToDismissal = (key: string, listener: () => void) => {
  dismissalListeners.add(listener)

  if (typeof window === 'undefined') {
    return () => {
      dismissalListeners.delete(listener)
    }
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === key) {
      listener()
    }
  }

  window.addEventListener('storage', handleStorage)

  return () => {
    dismissalListeners.delete(listener)
    window.removeEventListener('storage', handleStorage)
  }
}

export function useExpiringDismissal(key: string, ttlMs: number): UseExpiringDismissalReturn {
  const snapshot = useSyncExternalStore(
    (listener) => subscribeToDismissal(key, listener),
    () => readDismissalSnapshot(key),
    () => 'pending'
  )

  const dismiss = useCallback(() => {
    if (typeof window === 'undefined') return

    const value: ExpiringDismissalValue = {
      expiresAt: Date.now() + ttlMs,
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      notifyDismissalListeners()
    } catch {
      // no-op: keep UI functional even if storage is unavailable
    }
  }, [key, ttlMs])

  const reset = useCallback(() => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.removeItem(key)
      notifyDismissalListeners()
    } catch {
      // no-op
    }
  }, [key])

  return {
    isReady: snapshot !== 'pending',
    isDismissed: snapshot === 'dismissed',
    dismiss,
    reset,
  }
}
