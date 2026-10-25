import { useQuery } from '@tanstack/react-query'
import { categoryApi } from '../query-list/category.query'

const CATEGORY_KEYS = {
  all: () => ['categories'] as const,
  lists: () => ['categories', 'list'] as const,
  detail: (id: number | string) => ['categories', 'detail', id] as const,
}

export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORY_KEYS.lists(),
    queryFn: () => categoryApi.getCategories(),
    select: (response) => response.data.data,
  })
}

export const useCategory = (id?: number | string) => {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id ?? 'unknown'),
    queryFn: async () => {
      if (id === undefined) {
        throw new Error('Category id is required')
      }

      return categoryApi.getCategoryById(id)
    },
    enabled: id !== undefined,
    select: (response) => response.data.data,
  })
}
