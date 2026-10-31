'use client'

import { useAdminAnalyzer } from '@/api/api-hooks/admin/dashboard.api-hooks'
import type { AdminRoutine, AdminRoutineStep } from '@/api/query-list/admin/dashboard-query'
import { Card, CardContent } from '@/components/ui/card'
import { DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { format, formatDistanceToNow } from 'date-fns'
import { UserRound } from 'lucide-react'
import Image from 'next/image'

const StepList = ({ title, steps }: { title: string; steps?: AdminRoutineStep[] }) => (
  <div>
    <p className="text-dashboard text-sm font-medium">{title}</p>
    <ul className="text-dashboard/80 mt-1 space-y-1 text-sm">
      {(steps ?? []).map((step, index) => (
        <li key={`${title}-${index}`}>
          {step.step ? `${step.step}: ` : ''}
          {step.product_name}
        </li>
      ))}
    </ul>
  </div>
)

const RoutineEntry = ({ routine }: { routine: AdminRoutine }) => {
  const profile = routine.skin_profile

  return (
    <div className="rounded-lg bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-dashboard font-medium capitalize">
          {profile?.skin_type ?? 'Skin analysis'}
          {profile?.age ? ` · ${profile.age} years` : ''}
        </p>
        <p className="text-dashboard/80 text-xs">
          {format(new Date(routine.created_at), 'dd MMM yyyy, h:mm a')}
        </p>
      </div>
      {profile?.concerns?.length ? (
        <p className="text-dashboard/80 mt-1 text-sm">Concerns: {profile.concerns.join(', ')}</p>
      ) : null}
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <StepList title="Morning" steps={routine.routine_data?.am_routine} />
        <StepList title="Evening" steps={routine.routine_data?.pm_routine} />
      </div>
    </div>
  )
}

export const ViewAnalyzer = ({ id }: { id: number }) => {
  const { data: analyzer, isLoading, isError } = useAdminAnalyzer(id)

  return (
    <div className="space-y-6">
      <DialogTitle className="sr-only">Analyzer details</DialogTitle>
      {isLoading ? (
        <Skeleton className="h-40 rounded-xl" />
      ) : isError || !analyzer ? (
        <p className="py-10 text-center">Could not load this user.</p>
      ) : (
        <Card className="border-0 bg-[#f5f4f3]">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-lg bg-gray-200">
                {analyzer.image ? (
                  <Image
                    src={analyzer.image}
                    alt={analyzer.full_name ?? analyzer.email}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <UserRound className="text-dashboard/80 size-8" />
                )}
              </div>
              <div>
                <h2 className="text-dashboard text-xl font-semibold">
                  {analyzer.full_name || analyzer.email}
                </h2>
                {analyzer.location ? (
                  <p className="text-dashboard/80 text-sm">{analyzer.location}</p>
                ) : null}
                <p className="text-dashboard/80 text-sm">{analyzer.order_count} Orders</p>
                <p className="text-dashboard/80 text-sm">
                  User for {formatDistanceToNow(new Date(analyzer.join_date))}
                </p>
              </div>
            </div>
            <div className="mt-6 border-t border-gray-300" />
            <h3 className="text-dashboard mt-6 mb-3 font-semibold">
              Analyze History ({analyzer.routines.length})
            </h3>
            <div className="max-h-[50vh] space-y-3 overflow-y-auto">
              {analyzer.routines.map((routine) => (
                <RoutineEntry key={routine.id} routine={routine} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
