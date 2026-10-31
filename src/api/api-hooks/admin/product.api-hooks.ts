import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getApiErrorMessage } from '@/lib/api-error'
import toast from 'react-hot-toast'
import {
  adminProductApi,
  type AdminProductRequestData,
  type ProductAdminFilters,
} from '../../query-list/admin/product-query'

// Saving a product also changes the public catalog and the dashboard figures
const REFRESH_KEYS = [['admin'], ['products']]

const useRefresh = () => {
  const queryClient = useQueryClient()
  return () => {
    REFRESH_KEYS.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }))
  }
}

export const useAdminProducts = (filters: ProductAdminFilters) => {
  return useQuery({
    queryKey: ['admin', 'products', 'list', filters],
    queryFn: () => adminProductApi.getProducts(filters),
    placeholderData: keepPreviousData,
  })
}

export const useCreateAdminProduct = () => {
  const refresh = useRefresh()

  return useMutation({
    mutationFn: (data: AdminProductRequestData) => adminProductApi.createProduct(data),

    onSuccess: () => {
      refresh()
      toast.success('Product created successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to create product'))
    },
  })
}

export const useUpdateAdminProduct = () => {
  const refresh = useRefresh()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AdminProductRequestData }) =>
      adminProductApi.updateProduct(id, data),

    onSuccess: () => {
      refresh()
      toast.success('Product updated successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to update product'))
    },
  })
}

export const useDeleteAdminProduct = () => {
  const refresh = useRefresh()

  return useMutation({
    mutationFn: (id: number) => adminProductApi.deleteProduct(id),

    onSuccess: () => {
      refresh()
      toast.success('Product deleted successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete product'))
    },
  })
}
