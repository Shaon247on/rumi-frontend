'use client'

import { useCallback, useEffect, useState } from 'react'

type SetValue<T> = T | ((prevValue: T) => T)

/**
 * Custom hook for managing sessionStorage with React state synchronization
 *
 * @param key - The sessionStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns [storedValue, setValue, removeValue]
 *
 * @example
 * const [user, setUser, removeUser] = useSessionStorage('user', null)
 *
 * // Set value
 * setUser({ name: 'John', email: 'john@example.com' })
 *
 * // Update with function
 * setUser(prev => ({ ...prev, name: 'Jane' }))
 *
 * // Remove value
 * removeUser()
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: SetValue<T>) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists to sessionStorage
  const setValue = useCallback(
    (value: SetValue<T>) => {
      try {
        // Allow value to be a function (same API as useState)
        const valueToStore = value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to sessionStorage
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore))

          // Dispatch custom event for cross-tab/component synchronization
          window.dispatchEvent(
            new CustomEvent('session-storage-change', {
              detail: { key, value: valueToStore },
            })
          )
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Remove value from sessionStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)

      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key)

        // Dispatch custom event
        window.dispatchEvent(
          new CustomEvent('session-storage-change', {
            detail: { key, value: undefined },
          })
        )
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Listen for changes in other components/tabs
  useEffect(() => {
    const handleStorageChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: T }>

      if (customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.value ?? initialValue)
      }
    }

    window.addEventListener('session-storage-change', handleStorageChange)

    return () => {
      window.removeEventListener('session-storage-change', handleStorageChange)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
