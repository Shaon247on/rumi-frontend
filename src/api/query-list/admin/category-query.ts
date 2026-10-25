import { axiosClient } from '@/lib/axios'
import { appendFormDataValue } from '@/lib/api-form-data'

export interface AdminCategory {
  id: number
  name: string
  image: string
  created_at: string
  updated_at: string
}

export interface CreateAdminCategoryRequestData {
  name: string
  image?: File | string
}

export interface UpdateAdminCategoryRequestData {
  name?: string
  image?: File | string
}

const createCategoryFormData = (
  data: CreateAdminCategoryRequestData | UpdateAdminCategoryRequestData
) => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    appendFormDataValue(formData, key, value)
  }

  return formData
}

export const adminCategoryApi = {
  getCategories: () => axiosClient.get<AdminCategory[]>('/adminapi/category/'),

  createCategory: (data: CreateAdminCategoryRequestData) =>
    axiosClient.post<AdminCategory>('/adminapi/category/', createCategoryFormData(data), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  getCategoryById: (id: number | string) =>
    axiosClient.get<AdminCategory>(`/adminapi/categories/${id}/`),

  updateCategory: (id: number | string, data: UpdateAdminCategoryRequestData) =>
    axiosClient.patch<AdminCategory>(`/adminapi/categories/${id}/`, createCategoryFormData(data), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteCategory: (id: number | string) => axiosClient.delete<void>(`/adminapi/categories/${id}/`),
}
