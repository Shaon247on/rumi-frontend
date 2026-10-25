import { Skeleton } from '@/components/ui/skeleton'

export const MyCartSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-7 w-40 bg-white/10" />
      <Skeleton className="h-4 w-64 bg-white/10" />

      <div className="space-y-3">
        <Skeleton className="h-28 w-full rounded-2xl bg-white/10" />
        <Skeleton className="h-28 w-full rounded-2xl bg-white/10" />
      </div>

      <Skeleton className="h-28 w-full rounded-2xl bg-white/10" />
    </div>
  )
}
