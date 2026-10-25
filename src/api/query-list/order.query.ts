import { axiosClient } from '@/lib/axios'

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  id?: number
  price: string
  product: number
  product_name?: string
  quantity: number
}

export interface Order {
  address_line1: string
  address_line2?: string
  city: string
  country?: string
  created_at?: string
  full_name: string
  id?: number
  items?: OrderItem[]
  phone: string
  postal_code: string
  state?: string
  status?: OrderStatus | string
  total_amount: string
  user?: number
}

export interface OrderListApiResponse {
  success: boolean
  message: string
  data: Order[]
}

export type OrderListResponse = Order[]

export const orderApi = {
  getHistory: () => axiosClient.get<OrderListApiResponse>('/shop/orders/'),
}
