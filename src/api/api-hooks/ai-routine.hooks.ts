import { getApiErrorMessage } from '@/lib/api-error'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { aiRoutineApi } from '../query-list/ai-routine.query'

const AI_ROUTINE_KEYS = {
  all: () => ['ai-routine'] as const,
  history: () => ['ai-routine', 'history'] as const,
  historyDetail: (routineId: number | string) => ['ai-routine', 'history', routineId] as const,
}

export const useAiRoutineHistory = () => {
  return useQuery({
    queryKey: AI_ROUTINE_KEYS.history(),
    queryFn: () => aiRoutineApi.getHistory(),
    select: (response) => response.data.data.routines ?? [],
  })
}

export const useAiRoutineHistoryById = (routineId?: number | string) => {
  return useQuery({
    queryKey: AI_ROUTINE_KEYS.historyDetail(routineId ?? 'unknown'),
    queryFn: async () => {
      if (routineId === undefined) {
        throw new Error('Routine id is required')
      }

      return aiRoutineApi.getHistoryById(routineId)
    },
    enabled: routineId !== undefined,
    select: (response) => response.data.data,
  })
}

export const useDeleteAiRoutineHistory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (routineId: number | string) => aiRoutineApi.deleteHistory(routineId),

    onSuccess: (_, routineId) => {
      queryClient.invalidateQueries({ queryKey: AI_ROUTINE_KEYS.all() })
      queryClient.invalidateQueries({ queryKey: AI_ROUTINE_KEYS.historyDetail(routineId) })
      toast.success('Routine deleted successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to delete routine'))
    },
  })
}
