import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getApiErrorMessage } from '@/lib/api-error'
import toast from 'react-hot-toast'
import {
  adminProductApi,
  type CreateAdminProductRequestData,
  type UpdateAdminProductRequestData,
} from '../../query-list/admin/product-query'

const ADMIN_PRODUCT_KEYS = {
  all: () => ['admin', 'products'] as const,
  lists: () => ['admin', 'products', 'list'] as const,
  detail: (id: number | string) => ['admin', 'products', 'detail', id] as const,
}

export const useAdminProducts = () => {
  return useQuery({
    queryKey: ADMIN_PRODUCT_KEYS.lists(),
    queryFn: () => adminProductApi.getProducts(),
    select: (response) => response.data,
  })
}

export const useAdminProduct = (id?: number | string) => {
  return useQuery({
    queryKey: ADMIN_PRODUCT_KEYS.detail(id ?? 'unknown'),
    queryFn: async () => {
      if (id === undefined) {
        throw new Error('Product id is required')
      }

      return adminProductApi.getProductById(id)
    },
    enabled: id !== undefined,
    select: (response) => response.data,
  })
}

export const useCreateAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAdminProductRequestData) => adminProductApi.createProduct(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCT_KEYS.all() })
      toast.success('Product created successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to create product'))
    },
  })
}

export const useUpdateAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateAdminProductRequestData }) =>
      adminProductApi.updateProduct(id, data),

    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCT_KEYS.all() })
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCT_KEYS.detail(variables.id) })
      toast.success('Product updated successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to update product'))
    },
  })
}

export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => adminProductApi.deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCT_KEYS.all() })
      toast.success('Product deleted successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete product'))
    },
  })
}
