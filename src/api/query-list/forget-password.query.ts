import { axiosClient } from '@/lib/axios'
import { appendFormDataValue } from '@/lib/api-form-data'

export interface ForgetPasswordMessageResponse {
  success: boolean
  message: string
  data: Record<string, never>
}

export interface SendForgetPasswordOtpRequestData {
  email: string
}

export interface VerifyForgetPasswordOtpRequestData {
  email: string
  otp: string
}

export interface ResetForgetPasswordRequestData {
  email: string
  new_password: string
}

const createForgetPasswordFormData = (
  data:
    | SendForgetPasswordOtpRequestData
    | VerifyForgetPasswordOtpRequestData
    | ResetForgetPasswordRequestData
) => {
  const formData = new FormData()

  for (const [key, value] of Object.entries(data)) {
    appendFormDataValue(formData, key, value)
  }

  return formData
}

export const forgetPasswordApi = {
  sendOtp: (data: SendForgetPasswordOtpRequestData) =>
    axiosClient.post<ForgetPasswordMessageResponse>(
      '/forget-password/send-otp/',
      createForgetPasswordFormData(data),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  verifyOtp: (data: VerifyForgetPasswordOtpRequestData) =>
    axiosClient.post<ForgetPasswordMessageResponse>(
      '/forget-password/verify-otp/',
      createForgetPasswordFormData(data),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  resetPassword: (data: ResetForgetPasswordRequestData) =>
    axiosClient.post<ForgetPasswordMessageResponse>(
      '/forget-password/reset/',
      createForgetPasswordFormData(data),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    ),
}
