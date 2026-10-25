import { axiosClient } from '@/lib/axios'

export interface Category {
  id: number
  name: string
  image: string | null
  created_at: string
  updated_at: string
}

export interface CategoriesResponse {
  success: boolean
  message: string
  data: Category[]
}

export interface SingleCategoryResponse {
  success: boolean
  message: string
  data: Category
}

export const categoryApi = {
  getCategories: () => axiosClient.get<CategoriesResponse>('/userapi/categories/'),

  getCategoryById: (id: number | string) =>
    axiosClient.get<SingleCategoryResponse>(`/userapi/categories/${id}/`),
}
