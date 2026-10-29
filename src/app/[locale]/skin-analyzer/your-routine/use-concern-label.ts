import { useTranslations } from 'next-intl'
import { useCallback } from 'react'

/** Turns stored concern keys (e.g. "darkSpots") into translated labels; free text passes through. */
export const useConcernLabel = () => {
  const t = useTranslations('skinAnalyzerAnalysis.form.concerns.options')

  return useCallback((concern: string) => (t.has(concern) ? t(concern) : concern), [t])
}
