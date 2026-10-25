import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  normalizeProductsResponse,
  productApi,
  type ProductDetails,
  type ProductFilters,
} from '../query-list/product.query'

const PRODUCT_KEYS = {
  all: () => ['products'] as const,
  lists: () => ['products', 'list'] as const,
  detail: (id: number | string) => ['products', 'detail', id] as const,
  best: () => ['products', 'best'] as const,
  userLists: (filters?: ProductFilters) => ['products', 'user', 'list', filters ?? {}] as const,
  userDetail: (id: number | string) => ['products', 'user', 'detail', id] as const,
}

const createUserProductsQuery = (filters?: ProductFilters) => ({
  queryKey: PRODUCT_KEYS.userLists(filters),
  queryFn: () => productApi.getUserProducts(filters),
  placeholderData: keepPreviousData,
  select: (response: Awaited<ReturnType<typeof productApi.getUserProducts>>) =>
    normalizeProductsResponse(response.data, filters),
})

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    ...createUserProductsQuery(filters),
  })
}

export const useProduct = (id?: number | string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id ?? 'unknown'),
    queryFn: async () => {
      if (id === undefined) {
        throw new Error('Product id is required')
      }

      return productApi.getProductById(id)
    },
    enabled: id !== undefined,
    select: (response: Awaited<ReturnType<typeof productApi.getProductById>>): ProductDetails =>
      response.data.data,
  })
}

export const useBestProducts = () => {
  return useQuery({
    queryKey: PRODUCT_KEYS.best(),
    queryFn: () => productApi.getBestProducts(),
    select: (response) => response.data,
  })
}

export const useUserProduct = (id?: number | string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.userDetail(id ?? 'unknown'),
    queryFn: async () => {
      if (id === undefined) {
        throw new Error('Product id is required')
      }

      return productApi.getUserProductById(id)
    },
    enabled: id !== undefined,
    select: (response: Awaited<ReturnType<typeof productApi.getUserProductById>>): ProductDetails =>
      response.data.data,
  })
}
