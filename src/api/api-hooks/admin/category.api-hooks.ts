import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getApiErrorMessage } from '@/lib/api-error'
import toast from 'react-hot-toast'
import {
  adminCategoryApi,
  type AdminCategoryRequestData,
} from '../../query-list/admin/category-query'
import type { ListFilters } from '../../query-list/admin/dashboard-query'

const useRefresh = () => {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['admin'] })
    queryClient.invalidateQueries({ queryKey: ['categories'] })
  }
}

export const useAdminCategories = (filters: ListFilters) => {
  return useQuery({
    queryKey: ['admin', 'categories', 'list', filters],
    queryFn: () => adminCategoryApi.getCategories(filters),
    placeholderData: keepPreviousData,
  })
}

export const useCreateAdminCategory = () => {
  const refresh = useRefresh()

  return useMutation({
    mutationFn: (data: AdminCategoryRequestData) => adminCategoryApi.createCategory(data),

    onSuccess: () => {
      refresh()
      toast.success('Category created successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to create category'))
    },
  })
}

export const useUpdateAdminCategory = () => {
  const refresh = useRefresh()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminCategoryRequestData }) =>
      adminCategoryApi.updateCategory(id, data),

    onSuccess: () => {
      refresh()
      toast.success('Category updated successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to update category'))
    },
  })
}

export const useDeleteAdminCategory = () => {
  const refresh = useRefresh()

  return useMutation({
    mutationFn: (id: number) => adminCategoryApi.deleteCategory(id),

    onSuccess: () => {
      refresh()
      toast.success('Category deleted successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete category'))
    },
  })
}
