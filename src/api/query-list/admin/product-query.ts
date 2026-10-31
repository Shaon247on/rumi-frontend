import { appendFormDataValue, appendFormDataValues } from '@/lib/api-form-data'
import { axiosClient } from '@/lib/axios'
import { cleanParams, type ApiEnvelope, type ListFilters, type Paginated } from './dashboard-query'

export interface AdminProductImage {
  id: number
  image: string
}

export interface AdminProduct {
  id: number
  category: number
  category_name?: string
  title: string
  sub_title: string | null
  skin_type: string | null
  description: string | null
  key_ingredients: string | null
  how_to_use: string | null
  key_benefits: string | null
  size: string | null
  sku: string | null
  price: string
  discount: string
  stock: number
  images: AdminProductImage[]
  order_count: number
  created_at: string
}

export interface AdminProductRequestData {
  category?: number
  title?: string
  sub_title?: string
  sku?: string
  price?: string
  size?: string
  discount?: string
  stock?: number
  skin_type?: string
  description?: string
  key_ingredients?: string
  key_benefits?: string
  how_to_use?: string
  images?: File[]
}

export interface ProductAdminFilters extends ListFilters {
  stock?: string
  category?: number
}

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

const createProductFormData = (data: AdminProductRequestData) => {
  const formData = new FormData()
  const { images, ...rest } = data

  for (const [key, value] of Object.entries(rest)) {
    appendFormDataValue(formData, key, value)
  }

  if (images && images.length > 0) {
    appendFormDataValues(formData, 'images', images)
  }

  return formData
}

export const adminProductApi = {
  getProducts: async (filters: ProductAdminFilters) => {
    const response = await axiosClient.get<ApiEnvelope<Paginated<AdminProduct>>>(
      '/adminapi/product/',
      { params: cleanParams(filters) }
    )
    return response.data.data
  },

  createProduct: (data: AdminProductRequestData) =>
    axiosClient.post<ApiEnvelope<AdminProduct>>(
      '/adminapi/product/',
      createProductFormData(data),
      multipart
    ),

  updateProduct: (id: number, data: AdminProductRequestData) =>
    axiosClient.patch<ApiEnvelope<AdminProduct>>(
      `/adminapi/products/${id}/`,
      createProductFormData(data),
      multipart
    ),

  deleteProduct: (id: number) => axiosClient.delete(`/adminapi/products/${id}/`),
}
