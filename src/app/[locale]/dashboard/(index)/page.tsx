'use client'

import { useDashboardSummary } from '@/api/api-hooks/admin/dashboard.api-hooks'
import type { SummaryFilters } from '@/api/query-list/admin/dashboard-query'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { AdminCustomersCharts } from './admin-customers-charts'
import { AdminStates } from './admin-states'
import { MostlyOrderedArea } from './mostly-ordered-area'
import { OrdersList } from './orders-list'
import { RecentTransactions } from './recent-transactions'
import { SaleCards } from './sale-cards'
import { TopProductsList } from './top-products-list'
import { YourPerformance } from './your-performance'

const DashboardIndexPage = () => {
  const [filters, setFilters] = useState<SummaryFilters>({ range: 'year' })
  const { data, isLoading, isError, refetch } = useDashboardSummary(filters)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded-xl bg-white/10" />
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center gap-3 text-white">
        <p>Could not load the dashboard.</p>
        <button type="button" onClick={() => void refetch()} className="text-sm underline">
          Try again
        </button>
      </div>
    )
  }

  return (
    <div>
      <AdminStates data={data} />

      <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <SaleCards chart={data.sale_chart} filters={filters} onFiltersChange={setFilters} />
        <AdminCustomersCharts chart={data.customer_chart} />
        <YourPerformance performance={data.performance} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2">
        <TopProductsList products={data.top_products} />
        <MostlyOrderedArea areas={data.top_areas} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2">
        <RecentTransactions transactions={data.recent_transactions} />
        <OrdersList orders={data.recent_orders} />
      </div>
    </div>
  )
}

export default DashboardIndexPage
