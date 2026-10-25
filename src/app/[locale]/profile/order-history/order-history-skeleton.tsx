import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const OrderHistorySkeleton = () => {
  return (
    <div className="space-y-3">
      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="bg-[#efeeeb] p-4 sm:p-5 lg:p-6">
          <div className="grid gap-5 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-6">
            <div className="flex h-full flex-col justify-between rounded-[28px] border border-[#ece7df] bg-[#f3f2ee] p-5 lg:p-6">
              <div className="space-y-8">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 bg-white/10" />
                  <Skeleton className="h-3 w-20 bg-white/10" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                  <Skeleton className="h-3 w-20 bg-white/10" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-white/10" />
                  <Skeleton className="h-3 w-20 bg-white/10" />
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-[#ece7df] bg-[#f3f2ee] p-5 lg:p-6">
              <div className="space-y-4">
                <Skeleton className="h-px w-full bg-white/20" />
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24 bg-white/10" />
                    <Skeleton className="h-6 w-52 bg-white/10" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                </div>

                <div className="grid gap-4 md:grid-cols-[96px_minmax(0,1fr)] md:items-center">
                  <Skeleton className="aspect-square rounded-2xl bg-white/10" />
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-32 bg-white/10" />
                    <Skeleton className="h-4 w-full bg-white/10" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20 rounded-full bg-white/10" />
                      <Skeleton className="h-6 w-24 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>

                <Skeleton className="h-px w-full bg-white/20" />
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-3 w-24 bg-white/10" />
                  <Skeleton className="h-6 w-24 bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
