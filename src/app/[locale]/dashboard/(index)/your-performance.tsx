'use client'

import type { DashboardSummary } from '@/api/query-list/admin/dashboard-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Package, Store, Truck } from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'

const chartConfig = {
  value: { label: 'Value' },
} satisfies ChartConfig

export const YourPerformance = ({
  performance,
}: {
  performance: DashboardSummary['performance']
}) => {
  const items = [
    {
      id: 'processing',
      icon: Store,
      count: `${performance.new_orders} new orders`,
      status: 'Processing',
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
    {
      id: 'shipped',
      icon: Package,
      count: `${performance.shipped_orders} orders`,
      status: 'Shipped',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500',
    },
    {
      id: 'delivered',
      icon: Truck,
      count: `${performance.delivered_orders} orders`,
      status: 'Delivered',
      bgColor: 'bg-cyan-100',
      iconColor: 'text-cyan-500',
    },
  ]

  const segments = [
    { name: 'shipped', value: performance.shipped_orders, color: '#f97316' },
    { name: 'processing', value: performance.new_orders, color: '#4a5c4a' },
    { name: 'delivered', value: performance.delivered_orders, color: '#5eead4' },
    { name: 'cancelled', value: performance.cancelled_orders, color: '#e5e5e5' },
  ]
  // A flat grey arc keeps the gauge visible in a week with no orders
  const gaugeData =
    performance.total > 0 ? segments : [{ name: 'empty', value: 1, color: '#e5e5e5' }]

  return (
    <Card className="border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Your Performance</CardTitle>
        <p className="text-muted-foreground text-sm">Last 7 days</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          {/* Left side - Order stats */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${item.bgColor}`}>
                  <item.icon className={`size-5 ${item.iconColor}`} />
                </div>
                <div>
                  <p className="font-medium">{item.count}</p>
                  <p className="text-muted-foreground text-sm">{item.status}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - Gauge chart */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <ChartContainer config={chartConfig} className="h-[140px] w-[140px]">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="70%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={50}
                  outerRadius={65}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {gaugeData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="-mt-4 text-center">
              <p className="text-3xl font-semibold">{performance.total}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Orders placed in
                <br />
                the last 7 days
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
