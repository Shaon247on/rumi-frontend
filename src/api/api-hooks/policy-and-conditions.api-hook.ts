import { useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { getApiErrorMessage } from '@/lib/api-error'
import toast from 'react-hot-toast'
import { policyAndConditionsApi } from '../query-list/policy-and-conditions.query'

// ─── Query keys ────────────────────────────────────────────────────────────────

const POLICY_KEYS = {
  all: () => ['policy-and-conditions'] as const,
  privacyPolicy: () => ['policy-and-conditions', 'privacy-policy'] as const,
  termsAndConditions: () => ['policy-and-conditions', 'terms-and-conditions'] as const,
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

export const usePrivacyPolicy = () => {
  return useQuery({
    queryKey: POLICY_KEYS.privacyPolicy(),
    queryFn: () => policyAndConditionsApi.getPrivacyPolicy(),
    select: (response) => response.data.data,

    throwOnError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to load Privacy Policy'))
      return false
    },
  })
}

export const useTermsAndConditions = () => {
  return useQuery({
    queryKey: POLICY_KEYS.termsAndConditions(),
    queryFn: () => policyAndConditionsApi.getTermsAndConditions(),
    select: (response) => response.data.data,

    throwOnError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, 'Failed to load Terms and Conditions'))
      return false
    },
  })
}
