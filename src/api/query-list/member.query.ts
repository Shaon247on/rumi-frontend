import { axiosClient } from '@/lib/axios'

// ============================================
// 1. TypeScript Interfaces
// ============================================

export interface TempInfo {
  id?: number
  full_name: string
  email: string
  contact_number: string
  skin_type: string
  birthday?: string
  lean?: string
  created_at?: string
  updated_at?: string
}

export interface CreateTempInfoData {
  full_name: string
  email: string
  contact_number: string
  skin_type: string
  birthday?: string
  lean?: string
}

export interface TempInfoResponse {
  id: number
  full_name: string
  email: string
  contact_number: string
  skin_type: string
  birthday?: string
  lean?: string
  created_at?: string
  updated_at?: string
}

export interface TempInfoFilters {
  page?: number
  lean?: string
}

export interface TempInfoListResponse {
  count: number
  next: string | null
  previous: string | null
  results: {
    data?: TempInfoResponse[]
    message: string
    success: true
  }
}

export interface DeleteTempInfoResponse {
  detail?: string
}

// ============================================
// 2. API Object
// ============================================

export const memberApi = {
  // GET - Fetch all temp info with pagination
  getAll: (filters?: TempInfoFilters) => {
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.lean) params.append('lean', filters.lean)

    const queryString = params.toString()
    const url = queryString ? `/temp-info/?${queryString}` : '/temp-info/'

    return axiosClient.get<TempInfoListResponse>(url)
  },

  // POST - Create temp info
  createTempInfo: (data: CreateTempInfoData) => {
    const formData = new FormData()
    formData.append('full_name', data.full_name)
    formData.append('email', data.email)
    formData.append('contact_number', data.contact_number)
    formData.append('skin_type', data.skin_type)
    if (data.birthday) formData.append('birthday', data.birthday)
    if (data.lean) formData.append('lean', data.lean)

    return axiosClient.post<TempInfoResponse>('/temp-info/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // DELETE - Remove temp info by id
  deleteTempInfo: (id: number | string) => {
    return axiosClient.delete<DeleteTempInfoResponse>(`/temp-info/${id}/`)
  },
}
