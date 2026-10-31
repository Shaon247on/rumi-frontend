'use client'

import { useAiAnalytics } from '@/api/api-hooks/admin/dashboard.api-hooks'
import { Skeleton } from '@/components/ui/skeleton'
import { PerformanceByCategory } from './performance-by-category'
import { TrendAndFrequency } from './trend-and-frequency'

const AiAnalytics = () => {
  const { data, isLoading, isError, refetch } = useAiAnalytics()

  if (isLoading) {
    return <Skeleton className="h-96 rounded-xl bg-white/10" />
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-white">
        <p>Could not load analytics.</p>
        <button type="button" onClick={() => void refetch()} className="text-sm underline">
          Try again
        </button>
      </div>
    )
  }

  return (
    <main className="space-y-5">
      <TrendAndFrequency products={data.products} />
      <PerformanceByCategory categories={data.performance_by_category} />
    </main>
  )
}

export default AiAnalytics
