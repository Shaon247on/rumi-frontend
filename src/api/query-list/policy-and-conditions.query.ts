import { axiosClient } from '@/lib/axios'

// ─── Response types ────────────────────────────────────────────────────────────

export interface PolicyContent {
  content: string
}

export interface PrivacyPolicyResponse {
  success: boolean
  message: string
  data: PolicyContent
}

export interface TermsAndConditionsResponse {
  success: boolean
  message: string
  data: PolicyContent
}

// ─── API object ────────────────────────────────────────────────────────────────

export const policyAndConditionsApi = {
  getPrivacyPolicy: () => axiosClient.get<PrivacyPolicyResponse>('/privacy-policy'),

  getTermsAndConditions: () => axiosClient.get<TermsAndConditionsResponse>('/terms-and-conditions'),
}
