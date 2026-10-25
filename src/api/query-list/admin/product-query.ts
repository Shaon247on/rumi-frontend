import { axiosClient } from '@/lib/axios'
import { appendFormDataValue, appendFormDataValues } from '@/lib/api-form-data'

export interface AdminProductImage {
  id: number
  image: string
}

export interface AdminProduct {
  id: number
  category: number
  category_name?: string
  title: string
  sub_title: string
  skin_type: string
  description: string
  key_ingredients: string
  how_to_use: string
  key_benefits: string
  size?: string
  sku: string
  price: string
  discount?: string
  stock?: number
  reserved_stock?: number
  is_available?: boolean
  video?: string
  images: AdminProductImage[]
  created_at?: string
  updated_at?: string
}

export interface BaseAdminProductRequestData {
  category?: number
  description?: string
  how_to_use?: string
  is_available?: boolean
  key_benefits?: string
  key_ingredients?: string
  price?: string
  reserved_stock?: number
  size?: string
  skin_type?: string
  sku?: string
  stock?: number
  sub_title?: string
  title?: string
  discount?: string
  video?: File | string
  images?: File[]
}

export interface CreateAdminProductRequestData extends BaseAdminProductRequestData {
  category: number
  description: string
  how_to_use: string
  key_benefits: string
  key_ingredients: string
  price: string
  skin_type: string
  sku: string
  sub_title: string
  title: string
}

export type UpdateAdminProductRequestData = BaseAdminProductRequestData

const createProductFormData = (
  data: CreateAdminProductRequestData | UpdateAdminProductRequestData
) => {
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
  getProducts: () => axiosClient.get<AdminProduct[]>('/adminapi/product/'),

  createProduct: (data: CreateAdminProductRequestData) =>
    axiosClient.post<AdminProduct>('/adminapi/product/', createProductFormData(data), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  getProductById: (id: number | string) =>
    axiosClient.get<AdminProduct>(`/adminapi/products/${id}/`),

  updateProduct: (id: number | string, data: UpdateAdminProductRequestData) =>
    axiosClient.patch<AdminProduct>(`/adminapi/products/${id}/`, createProductFormData(data), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteProduct: (id: number | string) => axiosClient.delete<void>(`/adminapi/products/${id}/`),
}
