'use client'

import { usePrivacyPolicy } from '@/api/api-hooks/policy-and-conditions.api-hook'
import { useTranslations, useLocale } from 'next-intl'
import LegalPageWrapper from '@/components/shared/legal-page-wrapper'
import { parsePolicySections } from '@/lib/policy-sections'

export default function PrivacyPolicy() {
  const t = useTranslations('privacy')
  const locale = useLocale()
  const isAR = locale === 'ar'
  const { data: savedPolicy } = usePrivacyPolicy()

  let sections: Array<{ title: string; content: string; list?: string[] }> = []
  try {
    sections = t.raw('sections')
  } catch {
    sections = []
  }

  // The dashboard text is a single language, so Arabic keeps its translated copy
  if (!isAR && savedPolicy?.content?.trim()) {
    sections = parsePolicySections(savedPolicy.content, 'Privacy Policy')
  }

  return (
    <LegalPageWrapper
      title={t('title')}
      updatedText={isAR ? 'تحديث: يوليو ٢٠٢٦' : 'UPDATED: JULY 2026'}
      intro={t('intro')}
      sections={sections}
      pageSlug="privacy-policy"
    />
  )
}
