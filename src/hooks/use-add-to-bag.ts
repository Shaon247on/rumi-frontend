'use client'

import { useAddCartItem } from '@/api/api-hooks/shop.api-hooks'
import { useRouter } from '@/i18n/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useTranslations } from 'next-intl'
import toast from 'react-hot-toast'

/** Adds a product to the signed-in user's cart; signed-out users are sent to login first. */
export const useAddToBag = () => {
  const t = useTranslations('productsPage.catalog')
  const router = useRouter()
  const accessToken = useAuthStore((state) => state.token.accessToken)
  const { mutateAsync, isPending } = useAddCartItem()

  const addToBag = async (productId: number, quantity = 1) => {
    if (!accessToken) {
      toast(t('loginToAdd'))
      router.push('/login')
      return false
    }

    try {
      await mutateAsync({ data: { product_id: productId, quantity } })
      return true
    } catch {
      // useAddCartItem already shows the error toast
      return false
    }
  }

  return { addToBag, isAdding: isPending, isAuthenticated: Boolean(accessToken) }
}
