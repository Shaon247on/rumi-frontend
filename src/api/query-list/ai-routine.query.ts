/* eslint-disable @typescript-eslint/no-empty-object-type */
import { axiosClient } from '@/lib/axios'

export interface AiRoutineSkinProfile {
  age?: number
  additional_details?: string
  allergies?: string[]
  concerns?: string[]
  is_pregnant?: boolean
  language?: string
  skin_type?: string
}

export interface AiRoutineStep {
  brand?: string
  brand_type?: string
  category?: string
  has_opening?: boolean
  how_to_use?: string
  image_url?: string
  medical_disclaimer?: boolean
  price?: number
  product_id?: number
  product_name?: string
  product_url?: string
  rationale?: string
  step?: string
}

export interface AiRoutineData {
  am_routine?: AiRoutineStep[]
  pm_routine?: AiRoutineStep[]
}

export interface AiRoutineHistoryItem {
  created_at?: string
  id?: number | string
  routine_data?: AiRoutineData
  routine_id?: number | string
  skin_profile?: AiRoutineSkinProfile
  updated_at?: string
  [key: string]: unknown
}

export interface AiRoutineHistoryData {
  routines: AiRoutineHistoryItem[]
}

export interface AiRoutineResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface AiRoutineHistoryListResponse extends AiRoutineResponse<AiRoutineHistoryData> {}

export interface AiRoutineHistoryDetailResponse extends AiRoutineResponse<AiRoutineHistoryItem> {}

export const aiRoutineApi = {
  getHistory: () => axiosClient.get<AiRoutineHistoryListResponse>('/shop/routine/history/'),

  getHistoryById: (routineId: number | string) =>
    axiosClient.get<AiRoutineHistoryDetailResponse>(`/shop/routine/history/${routineId}/`),

  deleteHistory: (routineId: number | string) =>
    axiosClient.delete<AiRoutineResponse<Record<string, never>>>(
      `/shop/routine/history/${routineId}`
    ),
}
