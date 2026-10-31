import type { AiAnalytics } from '@/api/query-list/admin/dashboard-query'

export const PerformanceByCategory = ({
  categories,
}: {
  categories: AiAnalytics['performance_by_category']
}) => {
  // Round the scale up to a multiple of 4 so the axis labels stay whole numbers
  const highest = Math.max(4, ...categories.flatMap((item) => [item.current, item.previous]))
  const maxValue = Math.ceil(highest / 4) * 4
  const ticks = [1, 0.75, 0.5, 0.25, 0].map((share) => maxValue * share)

  return (
    <div className="rounded-xl bg-[#f5f4f3] p-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-dashboard text-xl font-semibold">Performance by Category</h2>
        <div className="text-dashboard/80 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="bg-dashboard size-3 rounded-sm" /> Last 30 days
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-[#4a3f35]/50" /> Previous 30 days
          </span>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">No recommendations yet.</p>
      ) : (
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute top-0 left-0 flex h-64 flex-col justify-between text-right">
            {ticks.map((tick) => (
              <span key={tick} className="text-dashboard/80 text-xs">
                {tick}
              </span>
            ))}
          </div>

          {/* Chart area */}
          <div className="ml-10">
            <div className="border-dashboard/20 relative h-64 border-b border-l border-dashed">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="border-dashboard/20 border-t border-dashed" />
                <div className="border-dashboard/20 border-t border-dashed" />
                <div className="border-dashboard/20 border-t border-dashed" />
                <div className="border-dashboard/20 border-t border-dashed" />
              </div>

              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-around px-8">
                {categories.map((item) => (
                  <div key={item.category} className="flex h-full items-end gap-2">
                    <div
                      className="bg-dashboard w-12 rounded-t"
                      title={`Last 30 days: ${item.current}`}
                      style={{ height: `${(item.current / maxValue) * 100}%` }}
                    />
                    <div
                      className="w-12 rounded-t bg-[#4a3f35]/50"
                      title={`Previous 30 days: ${item.previous}`}
                      style={{ height: `${(item.previous / maxValue) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* X-axis labels */}
            <div className="mt-4 flex justify-around px-8">
              {categories.map((item) => (
                <span key={item.category} className="text-dashboard/80 text-sm">
                  {item.category}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
