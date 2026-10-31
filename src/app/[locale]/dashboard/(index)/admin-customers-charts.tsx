'use client'

import type { WeeklyChart } from '@/api/query-list/admin/dashboard-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Line, LineChart } from 'recharts'

const chartConfig = {
  thisWeek: {
    label: 'This Week',
    color: '#14b8a6',
  },
  lastWeek: {
    label: 'Last Week',
    color: '#4a5c4a',
  },
} satisfies ChartConfig

export const AdminCustomersCharts = ({ chart }: { chart: WeeklyChart }) => {
  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl font-medium">Customers</CardTitle>
            <p className="text-muted-foreground text-sm">Last 7 days</p>
          </div>
          <span
            className={`text-lg font-medium ${chart.change < 0 ? 'text-red-500' : 'text-teal-500'}`}
          >
            {chart.change > 0 ? '+' : ''}
            {chart.change}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={chart.points} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
            <Line type="monotone" dataKey="thisWeek" stroke="#14b8a6" strokeWidth={2} dot={false} />
            <Line
              type="monotone"
              dataKey="lastWeek"
              stroke="#4a5c4a"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-teal-500" />
              <span className="text-sm">{chart.range_label}</span>
            </div>
            <span className="font-medium">{chart.this_week.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-main-button size-3 rounded-full" />
              <span className="text-sm">Last Week</span>
            </div>
            <span className="font-medium">{chart.last_week.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
