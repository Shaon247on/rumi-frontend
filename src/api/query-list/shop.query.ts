import { appendFormDataValue, appendFormDataValues } from '@/lib/api-form-data'
import { axiosClient } from '@/lib/axios'

export type ShopSkinType = 'oily' | 'dry' | 'normal' | 'combination' | 'sensitive'

export type CheckoutPaymentBrand =
  'VISA' | 'MASTER' | 'MADA' | 'APPLEPAY' | 'TABBY' | 'TAMARA' | 'COD'

export interface ShopProductImage {
  id?: number
  image?: string
}

export interface ShopProduct {
  id?: number
  category: number
  category_name?: string
  title: string
  sub_title?: string
  skin_type?: ShopSkinType | null
  description?: string
  key_ingredients?: string
  how_to_use?: string
  key_benefits?: string
  size?: string
  price: string
  discount?: string
  stock?: number
  images?: ShopProductImage[]
  order_count?: number
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  id?: number
  product?: ShopProduct | null
  product_id: number
  quantity?: number
  subtotal?: string
}

export interface Cart {
  id?: number
  items?: CartItem[]
  total_price?: string
  updated_at?: string
}

export interface ShopResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface AddCartItemRequestData {
  product_id: number
  quantity?: number
}

export interface UpdateCartItemRequestData {
  quantity: number
}

export interface CheckoutInitiateRequestData {
  address_line1: string
  city: string
  full_name: string
  payment_brand: CheckoutPaymentBrand
  phone: string
  postal_code: string
  address_line2?: string
  country?: string
  state?: string
}

export type CheckoutInitiateResponseData = CheckoutInitiateRequestData

export interface GenerateRoutineRequestData {
  age: number
  skin_type: ShopSkinType
  additional_details?: string
  concerns: string[]
  photo?: File
}

export interface GenerateRoutineRecommendation {
  step: string
  product_id: number
  product_name: string
  rationale: string
  medical_disclaimer: boolean
  image_url: string
  product_url: string
  price: number
}

export interface GenerateRoutineResponseData {
  am_routine: GenerateRoutineRecommendation[]
  pm_routine: GenerateRoutineRecommendation[]
}

export interface ShopChatHistoryMessage {
  content: string
  created_at: string
  id: number
  is_for_friend: boolean
  role: 'assistant' | 'user'
}

export interface ShopChatHistoryResponseData {
  messages: ShopChatHistoryMessage[]
}

const createGenerateRoutineFormData = (data: GenerateRoutineRequestData) => {
  const formData = new FormData()

  appendFormDataValue(formData, 'age', data.age)
  appendFormDataValue(formData, 'skin_type', data.skin_type)
  appendFormDataValue(formData, 'additional_details', data.additional_details)
  appendFormDataValues(formData, 'concerns', data.concerns)
  appendFormDataValue(formData, 'photo', data.photo)

  return formData
}

const getCartEndpoint = (itemId?: number | string) => {
  if (itemId === undefined) {
    return '/shop/cart/'
  }

  return `/shop/cart/items/${itemId}/`
}

export const shopApi = {
  getCart: (itemId?: number | string) =>
    axiosClient.get<ShopResponse<Cart>>(getCartEndpoint(itemId)),

  addCartItem: (data: AddCartItemRequestData, itemId?: number | string) =>
    axiosClient.post<ShopResponse<CartItem>>(getCartEndpoint(itemId), data),

  updateCartItem: (data: UpdateCartItemRequestData, itemId?: number | string) =>
    axiosClient.patch<ShopResponse<CartItem>>(getCartEndpoint(itemId), data),

  removeCartItem: (itemId?: number | string) => axiosClient.delete<void>(getCartEndpoint(itemId)),

  initiateCheckout: (data: CheckoutInitiateRequestData) =>
    axiosClient.post<ShopResponse<CheckoutInitiateResponseData>>('/shop/checkout/initiate/', data),

  generateRoutine: (data: GenerateRoutineRequestData) =>
    axiosClient.post<ShopResponse<GenerateRoutineResponseData>>(
      '/shop/generate-routine/',
      createGenerateRoutineFormData(data),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  getChatHistory: () =>
    axiosClient.get<ShopResponse<ShopChatHistoryResponseData>>('/shop/chat/history/'),
}
