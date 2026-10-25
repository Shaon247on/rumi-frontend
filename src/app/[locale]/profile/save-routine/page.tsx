'use client'

import { useAiRoutineHistory, useDeleteAiRoutineHistory } from '@/api/api-hooks/ai-routine.hooks'
import type { AiRoutineStep } from '@/api/query-list/ai-routine.query'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Moon, Sun, Trash2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeStepList = (value: unknown): AiRoutineStep[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is AiRoutineStep => isRecord(item))
}

const getStepTitle = (step: AiRoutineStep) => step.product_name || step.step || ''

const getStepMeta = (step: AiRoutineStep) =>
  [step.brand, step.brand_type, step.category].filter(Boolean).join(' • ')

const formatDate = (value: string | undefined, locale: string, fallback: string) => {
  if (!value) {
    return fallback
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const formatStepPrice = (price: AiRoutineStep['price']) => {
  if (price === undefined || price === null) {
    return null
  }

  return typeof price === 'number' ? `$${price.toFixed(2)}` : price
}

const RoutineSection = ({
  icon,
  getStepFallbackLabel,
  stepCountLabel,
  steps,
  title,
  emptyMessage,
}: {
  emptyMessage: string
  icon: ReactNode
  getStepFallbackLabel: (index: number) => string
  stepCountLabel: string
  steps: AiRoutineStep[]
  title: string
}) => {
  return (
    <div className="rounded-xl border border-white/10 bg-black/5 p-3">
      <div className="mb-3 flex items-center gap-2.5">
        {icon}
        <div>
          <h4 className="text-main-button text-sm font-semibold">{title}</h4>
          <p className="text-main-button/60 text-[11px]">{stepCountLabel}</p>
        </div>
      </div>

      {steps.length > 0 ? (
        <div className="space-y-2.5">
          {steps.map((step, index) => {
            const title = getStepTitle(step) || getStepFallbackLabel(index)
            const meta = getStepMeta(step)
            const price = formatStepPrice(step.price)

            return (
              <div key={`${title}-${index}`} className="rounded-lg bg-white/5 p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <p className="text-main-button text-[13px] font-medium">{title}</p>
                    {meta && <p className="text-main-button/60 text-[11px]">{meta}</p>}
                  </div>
                  {price && (
                    <Badge variant="outline" className="h-4 px-2 text-[10px]">
                      {price}
                    </Badge>
                  )}
                </div>

                {step.rationale && (
                  <p className="text-main-button/70 mt-1.5 text-[11px] leading-4">
                    {step.rationale}
                  </p>
                )}
                {step.how_to_use && (
                  <p className="text-main-button/60 mt-1.5 text-[11px] leading-4">
                    {step.how_to_use}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-main-button/60 text-[11px]">{emptyMessage}</p>
      )}
    </div>
  )
}

const RoutineSkeleton = () => {
  return (
    <Card className="border-main-button/20 bg-brand-shade-10">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="h-5 w-28 animate-pulse rounded bg-white/10" />
            <div className="h-8 w-72 max-w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-56 animate-pulse rounded bg-white/10" />
          </div>
          <div className="size-10 animate-pulse rounded-full bg-white/10" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="h-40 animate-pulse rounded-2xl bg-white/10" />
          <div className="h-40 animate-pulse rounded-2xl bg-white/10" />
        </div>
      </CardContent>
    </Card>
  )
}

const SaveRoutine = () => {
  const t = useTranslations('profile.saveRoutine')
  const locale = useLocale()
  const { data, error, isLoading, refetch } = useAiRoutineHistory()
  const { mutateAsync: deleteRoutine } = useDeleteAiRoutineHistory()
  const [pendingRoutineId, setPendingRoutineId] = useState<string | null>(null)
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(null)

  const routines = useMemo(() => {
    const items = Array.isArray(data) ? data : []

    return [...items].sort((left, right) => {
      const leftDate = left.created_at ? new Date(left.created_at).getTime() : 0
      const rightDate = right.created_at ? new Date(right.created_at).getTime() : 0

      return rightDate - leftDate
    })
  }, [data])

  const handleDelete = async (routineId: number | string) => {
    const confirmDelete = window.confirm(t('confirmDelete'))

    if (!confirmDelete) {
      return
    }

    setPendingRoutineId(String(routineId))

    try {
      await deleteRoutine(routineId)
    } finally {
      setPendingRoutineId(null)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-main-primary-base_medium text-xl font-bold">{t('title')}</h2>
      <div className="space-y-4">
        {isLoading ? (
          <>
            <RoutineSkeleton />
            <RoutineSkeleton />
          </>
        ) : error ? (
          <Card className="border-main-button/20 bg-brand-shade-10">
            <CardContent className="space-y-4 p-6 text-center">
              <p className="text-main-button text-sm">{t('error')}</p>
              <button
                type="button"
                className="bg-main-button text-background rounded-full px-5 py-2 text-sm font-medium"
                onClick={() => refetch()}
              >
                {t('retry')}
              </button>
            </CardContent>
          </Card>
        ) : routines.length === 0 ? (
          <Card className="border-main-button/20 bg-brand-shade-10">
            <CardContent className="p-6 text-center">
              <p className="text-main-button text-sm">{t('empty')}</p>
            </CardContent>
          </Card>
        ) : (
          routines.map((routine) => {
            const routineData = isRecord(routine.routine_data)
              ? routine.routine_data
              : (routine as UnknownRecord)
            const skinProfile = isRecord(routine.skin_profile) ? routine.skin_profile : undefined
            const routineId = routine.id ?? routine.routine_id

            if (routineId === undefined || routineId === null) {
              return null
            }

            const title =
              (typeof skinProfile?.skin_type === 'string' && skinProfile.skin_type) ||
              (typeof skinProfile?.additional_details === 'string' &&
                skinProfile.additional_details) ||
              t('routineFallback')
            const createdAt = formatDate(routine.created_at, locale, t('dateUnavailable'))
            const morningSteps = normalizeStepList(routineData.am_routine)
            const eveningSteps = normalizeStepList(routineData.pm_routine)
            const isPendingDelete = pendingRoutineId === String(routineId)
            const isExpanded = expandedRoutineId === String(routineId)

            return (
              <Card key={String(routineId)} className="border-main-button/20 bg-brand-shade-10">
                <CardContent className="space-y-3 p-4">
                  <div className="flex flex-col gap-3 border-b border-white/8 pb-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="border-main-button/20 h-6 px-2 text-[10px]"
                        >
                          {t('routineId')} #{String(routineId)}
                        </Badge>
                        <Badge variant="secondary" className="h-6 px-2 text-[10px]">
                          {createdAt}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-main-button/20 h-6 px-2 text-[10px]"
                        >
                          {morningSteps.length + eveningSteps.length} {t('totalSteps')}
                        </Badge>
                      </div>

                      <h3 className="text-main-button truncate text-lg leading-tight font-normal sm:text-xl">
                        {title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 self-start lg:self-center">
                      <button
                        type="button"
                        className="text-main-button/80 hover:text-main-button rounded-full border border-white/10 px-3 py-1.5 text-xs transition-colors"
                        onClick={() =>
                          setExpandedRoutineId((current) =>
                            current === String(routineId) ? null : String(routineId)
                          )
                        }
                        aria-expanded={isExpanded}
                        aria-controls={`routine-details-${String(routineId)}`}
                      >
                        {isExpanded ? t('hideRoutine') : t('viewRoutine')}
                      </button>

                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground rounded-full border border-white/10 p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label={`${t('deleteLabel')} ${title}`}
                        onClick={() => handleDelete(routineId)}
                        disabled={isPendingDelete}
                      >
                        <Trash2 className="size-4 text-[#58351B]" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div id={`routine-details-${String(routineId)}`} className="space-y-3 pt-1">
                      <div className="grid gap-3 lg:grid-cols-2">
                        <RoutineSection
                          icon={<Sun className="text-main-button size-4" />}
                          title={t('morningRoutine')}
                          emptyMessage={t('noMorningSteps')}
                          getStepFallbackLabel={(index) => t('stepFallback', { index: index + 1 })}
                          stepCountLabel={t('stepCount', { count: morningSteps.length })}
                          steps={morningSteps}
                        />
                        <RoutineSection
                          icon={<Moon className="text-main-button size-4" />}
                          title={t('eveningRoutine')}
                          emptyMessage={t('noEveningSteps')}
                          getStepFallbackLabel={(index) => t('stepFallback', { index: index + 1 })}
                          stepCountLabel={t('stepCount', { count: eveningSteps.length })}
                          steps={eveningSteps}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default SaveRoutine
