'use client'

import { useAiRoutineHistory } from '@/api/api-hooks/ai-routine.hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { RoutineCard } from './routine-card'

type UnknownRecord = Record<string, unknown>

export type RoutineStep = {
  brand?: string
  brandType?: string
  category?: string
  howToUse?: string
  imageUrl?: string
  medicalDisclaimer?: boolean
  price?: number | string
  productName?: string
  productUrl?: string
  rationale?: string
  step?: string
}

export type RoutineHistorySummary = {
  additionalDetails: string | undefined
  concerns: string[]
  createdAt: string | undefined
  id: string
  eveningRoutine: RoutineStep[]
  morningRoutine: RoutineStep[]
  skinType: string | undefined
}

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const toStringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((item): item is string => typeof item === 'string')
}

const normalizeRoutineStep = (value: unknown): RoutineStep | null => {
  if (!isRecord(value)) {
    return null
  }

  const productName = typeof value.product_name === 'string' ? value.product_name : undefined
  const step = typeof value.step === 'string' ? value.step : undefined
  const productUrl = typeof value.product_url === 'string' ? value.product_url : undefined
  const imageUrl = typeof value.image_url === 'string' ? value.image_url : undefined

  if (!productName && !step && !productUrl && !imageUrl) {
    return null
  }

  return {
    brand: typeof value.brand === 'string' ? value.brand : undefined,
    brandType: typeof value.brand_type === 'string' ? value.brand_type : undefined,
    category: typeof value.category === 'string' ? value.category : undefined,
    howToUse: typeof value.how_to_use === 'string' ? value.how_to_use : undefined,
    imageUrl,
    medicalDisclaimer: Boolean(value.medical_disclaimer),
    price:
      typeof value.price === 'number' || typeof value.price === 'string' ? value.price : undefined,
    productName,
    productUrl,
    rationale: typeof value.rationale === 'string' ? value.rationale : undefined,
    step,
  }
}

const normalizeStepList = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  const steps: RoutineStep[] = []

  for (const item of value) {
    const normalizedStep = normalizeRoutineStep(item)

    if (normalizedStep) {
      steps.push(normalizedStep)
    }
  }

  return steps
}

const extractRoutineItems = (history: unknown) => {
  if (Array.isArray(history)) {
    return { items: history, knownShape: true }
  }

  if (isRecord(history) && Array.isArray(history.routines)) {
    return { items: history.routines, knownShape: true }
  }

  return { items: [], knownShape: false }
}

const normalizeRoutines = (history: unknown) => {
  const { items, knownShape } = extractRoutineItems(history)

  const routines: RoutineHistorySummary[] = []

  for (const item of items) {
    if (!isRecord(item)) {
      continue
    }

    const routineData = isRecord(item.routine_data) ? item.routine_data : item
    const morningRoutine = normalizeStepList(routineData.am_routine)
    const eveningRoutine = normalizeStepList(routineData.pm_routine)

    const idValue = item.id ?? item.routine_id
    const id = typeof idValue === 'string' || typeof idValue === 'number' ? String(idValue) : ''

    if (!id) {
      continue
    }

    routines.push({
      additionalDetails:
        isRecord(item.skin_profile) && typeof item.skin_profile.additional_details === 'string'
          ? item.skin_profile.additional_details
          : undefined,
      concerns:
        isRecord(item.skin_profile) && Array.isArray(item.skin_profile.concerns)
          ? toStringArray(item.skin_profile.concerns)
          : [],
      createdAt: typeof item.created_at === 'string' ? item.created_at : undefined,
      id,
      eveningRoutine,
      morningRoutine,
      skinType:
        isRecord(item.skin_profile) && typeof item.skin_profile.skin_type === 'string'
          ? item.skin_profile.skin_type
          : undefined,
    })
  }

  const hasInvalidItems = items.length > 0 && routines.length === 0

  return { hasInvalidItems, knownShape, routines }
}

const RoutineSkeleton = () => {
  return (
    <div className="bg-brand-shade-10 rounded-2xl p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-9 w-56 bg-white/10" />
          <Skeleton className="h-4 w-72 bg-white/10" />
        </div>
        <Skeleton className="size-12 rounded-full bg-white/10" />
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-7 w-32 bg-white/10" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`morning-skeleton-${index}`} className="flex items-start gap-4 pl-4">
              <Skeleton className="size-6 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-4/5 bg-white/10" />
              </div>
              <Skeleton className="h-40 w-32 rounded-lg bg-white/10" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Skeleton className="h-7 w-32 bg-white/10" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`evening-skeleton-${index}`} className="flex items-start gap-4 pl-4">
              <Skeleton className="size-6 rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-4/5 bg-white/10" />
              </div>
              <Skeleton className="h-40 w-32 rounded-lg bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="bg-brand-shade-10 rounded-2xl p-6 text-center">
      <p className="text-main-button text-base font-medium">{message}</p>
    </div>
  )
}

export const YourRoutinesContents = () => {
  const t = useTranslations('yourRoutine')
  const { data, error, isLoading, refetch } = useAiRoutineHistory()
console.log("the data:", data)
  const { hasInvalidItems, knownShape, routines } = useMemo(
    () => normalizeRoutines(data as unknown),
    [data]
  )

  if (isLoading) {
    return (
      <div className="mx-auto mt-8 max-w-4xl space-y-6 px-6">
        <RoutineSkeleton />
        <RoutineSkeleton />
      </div>
    )
  }

  if (error || (!knownShape && data !== undefined) || hasInvalidItems) {
    return (
      <div className="mx-auto mt-8 max-w-4xl px-6">
        <EmptyState
          message={
            error ? 'Failed to load routine history.' : 'Routine history data is unavailable.'
          }
        />
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => refetch()}
            className="bg-main-button text-background rounded-full px-5 py-2 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (routines.length === 0) {
    return (
      <div className="mx-auto mt-8 max-w-4xl px-6">
        <EmptyState message="No routine history found." />
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 max-w-4xl space-y-6 px-6">
      {routines.map((routine) => (
        <RoutineCard key={routine.id} routine={routine} t={t} />
      ))}
    </div>
  )
}
