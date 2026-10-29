'use client'

import { useAiRoutineHistory } from '@/api/api-hooks/ai-routine.hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'
import { useConcernLabel } from './use-concern-label'

/** Concerns from the user's most recent skin analysis. */
export const LatestConcerns = () => {
  const t = useTranslations('yourRoutine')
  const getConcernLabel = useConcernLabel()
  const { data, isLoading } = useAiRoutineHistory()

  const routines = Array.isArray(data) ? data : []
  const latest = [...routines].sort(
    (a, b) => Date.parse(String(b.created_at ?? '')) - Date.parse(String(a.created_at ?? ''))
  )[0]
  const concerns = Array.isArray(latest?.skin_profile?.concerns)
    ? latest.skin_profile.concerns.filter((item): item is string => typeof item === 'string')
    : []

  return (
    <div className="mx-auto max-w-4xl px-6">
      <div className="rounded-2xl border border-[#E6DFD5] bg-white p-5 md:p-6">
        <h3 className="text-[11px] font-medium tracking-[0.2em] text-[#8C8275] uppercase">
          {t('skinConcerns.title')}
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </>
          ) : concerns.length > 0 ? (
            concerns.map((concern) => (
              <span
                key={concern}
                className="rounded-full border border-[#E6DFD5] bg-ivory px-3 py-1.5 text-sm text-[#2B2B2B]"
              >
                {getConcernLabel(concern)}
              </span>
            ))
          ) : (
            <p className="text-sm text-[#5C564E]">{t('skinConcerns.empty')}</p>
          )}
        </div>
      </div>
    </div>
  )
}
