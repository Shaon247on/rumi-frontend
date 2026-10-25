import type { RefreshTokenResponse } from '@/api/query-list/auth.query'
import { appendFormDataValue } from '@/lib/api-form-data'
import { useAuthStore } from '@/store/auth.store'
import axios, { type InternalAxiosRequestConfig } from 'axios'

// ─── Extend InternalAxiosRequestConfig to include _retry flag ─────────────────

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// ─── Axios client ──────────────────────────────────────────────────────────────

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

// ─── Request interceptor — attach access token ────────────────────────────────

axiosClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState()

    if (token.accessToken) {
      config.headers.Authorization = `Bearer ${token.accessToken}`
    }

    return config
  },
  (error: unknown) => Promise.reject(error)
)

// ─── Response interceptor — handle 401 with token refresh ────────────────────

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)

    const originalRequest = error.config as RetryableRequestConfig | undefined

    // Only attempt refresh on 401 and only once per request
    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    const { token, setToken, clearAuth } = useAuthStore.getState()

    if (!token.refreshToken) {
      clearAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    try {
      // Build FormData the same way authApi.refresh() does (multipart/form-data)
      const formData = new FormData()
      appendFormDataValue(formData, 'refresh', token.refreshToken)

      const response = await axios.post<RefreshTokenResponse>(
        `${process.env.NEXT_PUBLIC_BASE_URL}/refresh/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      // The API returns { access, refresh } — mirror RefreshTokenResponse
      const newAccessToken = response.data.access ?? ''

      // Persist the new access token via the store (keeps refreshToken intact)
      setToken({ accessToken: newAccessToken, refreshToken: token.refreshToken })

      // Retry the original request with the updated token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return axiosClient(originalRequest)
    } catch (refreshError: unknown) {
      // Refresh failed — sign the user out and redirect
      clearAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      return Promise.reject(refreshError)
    }
  }
)
