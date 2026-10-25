import { Skeleton } from '@/components/ui/skeleton'

export function ProductDetailsSkeleton() {
  return (
    <div className="bg-background min-h-screen px-6 py-12 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-lg" />

        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-11 w-24 rounded-md" />
            <Skeleton className="h-11 w-40 rounded-md" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-10/12" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
