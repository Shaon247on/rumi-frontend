import { getApiErrorMessage } from '@/lib/api-error'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import {
  forgetPasswordApi,
  type ResetForgetPasswordRequestData,
  type SendForgetPasswordOtpRequestData,
  type VerifyForgetPasswordOtpRequestData,
} from '../query-list/forget-password.query'

const FORGET_PASSWORD_KEYS = {
  all: () => ['forget-password'] as const,
  sendOtp: () => ['forget-password', 'send-otp'] as const,
  verifyOtp: () => ['forget-password', 'verify-otp'] as const,
  reset: () => ['forget-password', 'reset'] as const,
}

export const useSendForgetPasswordOtp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SendForgetPasswordOtpRequestData) => forgetPasswordApi.sendOtp(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: FORGET_PASSWORD_KEYS.all() })
      toast.success(response.data.message || 'OTP sent successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to send OTP'))
    },
  })
}

export const useVerifyForgetPasswordOtp = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VerifyForgetPasswordOtpRequestData) => forgetPasswordApi.verifyOtp(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: FORGET_PASSWORD_KEYS.all() })
      toast.success(response.data.message || 'OTP verified successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to verify OTP'))
    },
  })
}

export const useResetForgetPassword = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ResetForgetPasswordRequestData) => forgetPasswordApi.resetPassword(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: FORGET_PASSWORD_KEYS.all() })
      toast.success(response.data.message || 'Password reset successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to reset password'))
    },
  })
}
