'use client'

import { useTranslations, useLocale } from 'next-intl'
import LegalPageWrapper from '@/components/shared/legal-page-wrapper'

export default function TermsConditions() {
  const t = useTranslations('terms')
  const locale = useLocale()
  const isAR = locale === 'ar'

  let sections: Array<{ title: string; content: string; list?: string[] }> = []
  try {
    sections = t.raw('sections')
  } catch {
    sections = []
  }

  return (
    <LegalPageWrapper
      title={t('title')}
      updatedText={isAR ? 'تحديث: يوليو ٢٠٢٦' : 'UPDATED: JULY 2026'}
      intro={t('intro')}
      sections={sections}
      pageSlug="terms-conditions"
    />
  )
}
