import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getApiErrorMessage } from '@/lib/api-error'
import toast from 'react-hot-toast'
import {
  authApi,
  type LoginRequestData,
  type PasswordChangeRequestData,
  type RefreshTokenRequestData,
  type RegisterRequestData,
  type VerifyRegistrationRequestData,
} from '../query-list/auth.query'

const AUTH_KEYS = {
  all: () => ['auth'] as const,
  login: () => ['auth', 'login'] as const,
  register: () => ['auth', 'register'] as const,
  refresh: () => ['auth', 'refresh'] as const,
  passwordChange: () => ['auth', 'password-change'] as const,
  verifyRegistration: () => ['auth', 'verify-registration'] as const,
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: LoginRequestData) => authApi.login(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all() })
      toast.success(response.data.message || 'Logged in successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to login'))
    },
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterRequestData) => authApi.register(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all() })
      toast.success(response.data.message || 'Registered successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to register'))
    },
  })
}

export const useRefreshToken = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RefreshTokenRequestData) => authApi.refresh(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all() })
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to refresh token'))
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all() })
      toast.success('Logged out successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to logout'))
    },
  })
}

export const usePasswordChange = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PasswordChangeRequestData) => authApi.changePassword(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all() })
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.passwordChange() })
      toast.success(response.data.message || 'Password updated successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to update password'))
    },
  })
}

export const useVerifyRegistration = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: VerifyRegistrationRequestData) => authApi.verifyRegistration(data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all() })
      toast.success(response.data.message || 'OTP verified successfully')
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to verify OTP'))
    },
  })
}
