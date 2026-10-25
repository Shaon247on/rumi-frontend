import type { AxiosError } from 'axios'

export type ApiErrorValue = string | string[] | { message?: string } | Record<string, unknown>

export interface ApiErrorResponse {
  message?: ApiErrorValue
  detail?: ApiErrorValue
  error?: ApiErrorValue
  [key: string]: unknown
}

export const getApiErrorMessage = (error: AxiosError<unknown>, fallbackMessage: string) => {
  const responseData = error.response?.data

  if (typeof responseData === 'object' && responseData !== null) {
    const apiError = responseData as ApiErrorResponse

    const extracted = apiError.message ?? apiError.detail ?? apiError.error ?? fallbackMessage

    if (typeof extracted === 'string') {
      return extracted
    }

    if (Array.isArray(extracted)) {
      return extracted.join(', ')
    }

    if (typeof extracted === 'object' && extracted !== null) {
      // If it's an object with a message property (e.g. { type: 'error', message: '...' })
      const errorObj = extracted as Record<string, unknown>
      if ('message' in errorObj && typeof errorObj.message === 'string') {
        return errorObj.message
      }
      return JSON.stringify(extracted)
    }

    return String(extracted)
  }

  return fallbackMessage
}
