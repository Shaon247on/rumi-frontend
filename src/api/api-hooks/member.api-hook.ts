import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import {
  memberApi,
  type CreateTempInfoData,
  type TempInfoFilters,
} from '../query-list/member.query'

// ============================================
// 1. Query Keys (Centralized)
// ============================================

const MEMBER_KEYS = {
  all: (filters?: TempInfoFilters) => ['temp-info', filters] as const,
  tempInfo: () => ['temp-info'] as const,
}

// ============================================
// 2. Query Hooks (GET)
// ============================================

export const useTempInfoList = (filters?: TempInfoFilters) => {
  return useQuery({
    queryKey: MEMBER_KEYS.all(filters),
    queryFn: () => memberApi.getAll(filters),
    select: (response) => response.data,
  })
}

// ============================================
// 3. Mutation Hooks (POST)
// ============================================

export const useCreateTempInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTempInfoData) => memberApi.createTempInfo(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['temp-info'] })
    },

    onError: (error: AxiosError<{ message?: string; detail?: string }>) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to submit information'
      console.log('🚀 ~ useCreateTempInfo ~ message:', message)
      //   toast.error(message)
    },
  })
}

export const useDeleteTempInfo = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => memberApi.deleteTempInfo(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['temp-info'] })
    },

    onError: (error: AxiosError<{ message?: string; detail?: string }>) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Failed to delete information'
      console.log('🚀 ~ useDeleteTempInfo ~ message:', message)
      // toast.error(message)
    },
  })
}
