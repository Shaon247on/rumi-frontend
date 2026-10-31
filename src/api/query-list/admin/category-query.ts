import { appendFormDataValue } from '@/lib/api-form-data'
import { axiosClient } from '@/lib/axios'
import { fetchAdminList, type ApiEnvelope, type ListFilters } from './dashboard-query'

export interface AdminCategory {
  id: number
  name: string
  image: string | null
  created_at: string
  updated_at: string
  product_count: number
  quantity: number
  sale: number
}

export interface AdminCategoryRequestData {
  name?: string
  image?: File
}

const multipart = { headers: { 'Content-Type': 'multipart/form-data' } }

const createCategoryFormData = (data: AdminCategoryRequestData) => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    appendFormDataValue(formData, key, value)
  }

  return formData
}

export const adminCategoryApi = {
  getCategories: (filters: ListFilters) =>
    fetchAdminList<AdminCategory>('/adminapi/category/', filters),

  createCategory: (data: AdminCategoryRequestData) =>
    axiosClient.post<ApiEnvelope<AdminCategory>>(
      '/adminapi/category/',
      createCategoryFormData(data),
      multipart
    ),

  updateCategory: (id: number, data: AdminCategoryRequestData) =>
    axiosClient.patch<ApiEnvelope<AdminCategory>>(
      `/adminapi/categories/${id}/`,
      createCategoryFormData(data),
      multipart
    ),

  deleteCategory: (id: number) => axiosClient.delete(`/adminapi/categories/${id}/`),
}
