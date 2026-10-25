import { getApiErrorMessage } from '@/lib/api-error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import {
  shopApi,
  type AddCartItemRequestData,
  type CheckoutInitiateRequestData,
  type GenerateRoutineRequestData,
  type UpdateCartItemRequestData,
} from '../query-list/shop.query'

const SHOP_KEYS = {
  all: () => ['shop'] as const,
  cart: () => ['shop', 'cart'] as const,
  cartDetail: (itemId: number | string) => ['shop', 'cart', 'detail', itemId] as const,
  checkout: () => ['shop', 'checkout'] as const,
  checkoutInitiate: () => ['shop', 'checkout', 'initiate'] as const,
  chatHistory: () => ['shop', 'chat', 'history'] as const,
  routine: () => ['shop', 'routine'] as const,
  routineGenerate: () => ['shop', 'routine', 'generate'] as const,
}

export const useCart = (enabled = true) => {
  return useQuery({
    queryKey: SHOP_KEYS.cart(),
    queryFn: () => shopApi.getCart(),
    enabled,
    select: (response) => response.data.data,
  })
}

export const useCartByItemId = (itemId?: number | string) => {
  return useQuery({
    queryKey: SHOP_KEYS.cartDetail(itemId ?? 'unknown'),
    queryFn: async () => {
      if (itemId === undefined) {
        throw new Error('Cart item id is required')
      }

      return shopApi.getCart(itemId)
    },
    enabled: itemId !== undefined,
    select: (response) => response.data.data,
  })
}

export const useAddCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId?: number | string; data: AddCartItemRequestData }) =>
      shopApi.addCartItem(data, itemId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.cart() })
      toast.success('Item added to cart successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to add item to cart'))
    },
  })
}

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId?: number | string; data: UpdateCartItemRequestData }) =>
      shopApi.updateCartItem(data, itemId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.cart() })
      toast.success('Cart item updated successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to update cart item'))
    },
  })
}

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (itemId?: number | string) => shopApi.removeCartItem(itemId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.cart() })
      toast.success('Item removed from cart successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to remove item from cart'))
    },
  })
}

export const useInitiateCheckout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CheckoutInitiateRequestData) => shopApi.initiateCheckout(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.cart() })
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.checkout() })
      toast.success('Checkout initiated successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to initiate checkout'))
    },
  })
}

export const useGenerateRoutine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GenerateRoutineRequestData) => shopApi.generateRoutine(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHOP_KEYS.routine() })
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to generate routine'))
    },
  })
}

export const useChatHistory = (enabled = true) => {
  return useQuery({
    queryKey: SHOP_KEYS.chatHistory(),
    queryFn: () => shopApi.getChatHistory(),
    enabled,
    select: (response) => response.data.data,
  })
}
