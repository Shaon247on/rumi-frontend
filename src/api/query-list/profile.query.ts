import { appendFormDataValue } from '@/lib/api-form-data'
import { axiosClient } from '@/lib/axios'

export type ProfileGender = 'male' | 'female' | 'other'

export interface Profile {
  full_name: string
  email: string
  role: 'admin' | 'customer'
  image: string | null
  gender: string | null
  date_of_birth: string | null
  contact_number: string
  skin_type: string | null
  analysis: number
  total_cart_product: number
  total_order_products: number
}

export interface ProfileResponse {
  success: boolean
  message: string
  data: Profile
}

export interface UpdateProfileRequestData {
  date_of_birth?: string
  email?: string
  full_name?: string
  gender?: ProfileGender
  image?: File | string
  skin_type?: string
}

export interface PasswordChangeRequestData {
  confirm_password: string
  new_password: string
  old_password: string
}

export interface ProfileMessageResponse {
  success: boolean
  message: string
  data: Record<string, never>
}

const createProfileFormData = (data: UpdateProfileRequestData) => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    appendFormDataValue(formData, key, value)
  }

  return formData
}

export const profileApi = {
  getProfile: () => axiosClient.get<ProfileResponse>('/profile/'),

  updateProfile: (data: UpdateProfileRequestData) =>
    axiosClient.patch<ProfileResponse>('/profile/', createProfileFormData(data), {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  changePassword: (data: PasswordChangeRequestData) =>
    axiosClient.post<ProfileMessageResponse>('/accountapi/password-change/', data),
}
