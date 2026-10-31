import { useQuery } from '@tanstack/react-query'
import { policyAndConditionsApi } from '../query-list/policy-and-conditions.query'

// ─── Query keys ────────────────────────────────────────────────────────────────

const POLICY_KEYS = {
  all: () => ['policy-and-conditions'] as const,
  privacyPolicy: () => ['policy-and-conditions', 'privacy-policy'] as const,
  termsAndConditions: () => ['policy-and-conditions', 'terms-and-conditions'] as const,
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────

// The API answers 404 until an admin saves a policy. That is expected: the page
// keeps showing its built-in text, so these queries neither retry nor raise a toast.

export const usePrivacyPolicy = () => {
  return useQuery({
    queryKey: POLICY_KEYS.privacyPolicy(),
    queryFn: () => policyAndConditionsApi.getPrivacyPolicy(),
    select: (response) => response.data.data,
    retry: false,
  })
}

export const useTermsAndConditions = () => {
  return useQuery({
    queryKey: POLICY_KEYS.termsAndConditions(),
    queryFn: () => policyAndConditionsApi.getTermsAndConditions(),
    select: (response) => response.data.data,
    retry: false,
  })
}
