'use client'

import { useAddCartItem, useCart, useUpdateCartItem } from '@/api/api-hooks/shop.api-hooks'
import { Button } from '@/components/ui'
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from '@/components/ui/number-field'
import { useAuthStore } from '@/store/auth.store'
import { ShoppingBag } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

type Props = {
  productId?: number | string
}

export const AddToCartWithIncrement = ({ productId }: Props) => {
  const t = useTranslations('productDetails')
  const accessToken = useAuthStore((state) => state.token.accessToken)
  const isAuthenticated = Boolean(accessToken)
  const { data: cart, isLoading: isCartLoading } = useCart(isAuthenticated)
  const { mutateAsync: addCartItem, isPending: isAddingToCart } = useAddCartItem()
  const { mutateAsync: updateCartItem, isPending: isUpdatingCart } = useUpdateCartItem()
  const [draftQuantity, setDraftQuantity] = useState<number | null>(null)
  const submitLockRef = useRef(false)
  const hasProductId = productId !== undefined && productId !== null && productId !== ''

  const cartItem = cart?.items?.find((item) => String(item.product_id) === String(productId))
  const selectedQuantity = Math.max(1, draftQuantity ?? cartItem?.quantity ?? 1)
  const isPending = isCartLoading || isAddingToCart || isUpdatingCart || !hasProductId

  const handleSubmit = async () => {
    if (submitLockRef.current || isPending || !hasProductId) {
      return
    }

    submitLockRef.current = true

    try {
      if (cartItem?.id) {
        await updateCartItem({
          itemId: cartItem.id,
          data: { quantity: selectedQuantity },
        })
        setDraftQuantity(null)
        return
      }

      await addCartItem({
        data: {
          product_id: Number(productId),
          quantity: selectedQuantity,
        },
      })
      setDraftQuantity(null)
    } finally {
      submitLockRef.current = false
    }
  }

  return (
    <div className="mt-6 flex items-center gap-x-3">
      <NumberField
        value={selectedQuantity}
        min={1}
        step={1}
        disabled={isPending}
        onValueChange={(value) => {
          setDraftQuantity(value)
        }}
        className="max-h-12 max-w-28"
      >
        <NumberFieldScrubArea label={t('quantity')} />
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>

      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          void handleSubmit()
        }}
        className="border-main-button text-main-button mt-6 flex max-h-12 items-center gap-2 rounded-md px-6 py-1"
      >
        {isPending ? t('loading') : cartItem ? t('updateCart') : t('addToCart')}
        <ShoppingBag className="size-4" />
      </Button>
    </div>
  )
}
