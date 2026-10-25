import { getApiErrorMessage } from '@/lib/api-error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import {
  adminCategoryApi,
  type CreateAdminCategoryRequestData,
  type UpdateAdminCategoryRequestData,
} from '../../query-list/admin/category-query'

const ADMIN_CATEGORY_KEYS = {
  all: () => ['admin', 'categories'] as const,
  lists: () => ['admin', 'categories', 'list'] as const,
  detail: (id: number | string) => ['admin', 'categories', 'detail', id] as const,
}

export const useAdminCategories = () => {
  return useQuery({
    queryKey: ADMIN_CATEGORY_KEYS.lists(),
    queryFn: () => adminCategoryApi.getCategories(),
    select: (response) => response.data,
  })
}

export const useAdminCategory = (id?: number | string) => {
  return useQuery({
    queryKey: ADMIN_CATEGORY_KEYS.detail(id ?? 'unknown'),
    queryFn: async () => {
      if (id === undefined) {
        throw new Error('Category id is required')
      }

      return adminCategoryApi.getCategoryById(id)
    },
    enabled: id !== undefined,
    select: (response) => response.data,
  })
}

export const useCreateAdminCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAdminCategoryRequestData) => adminCategoryApi.createCategory(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORY_KEYS.all() })
      toast.success('Category created successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to create category'))
    },
  })
}

export const useUpdateAdminCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateAdminCategoryRequestData }) =>
      adminCategoryApi.updateCategory(id, data),

    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORY_KEYS.all() })
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORY_KEYS.detail(variables.id) })
      toast.success('Category updated successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to update category'))
    },
  })
}

export const useDeleteAdminCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => adminCategoryApi.deleteCategory(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORY_KEYS.all() })
      toast.success('Category deleted successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete category'))
    },
  })
}
