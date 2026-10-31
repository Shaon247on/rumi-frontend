'use client'

import type { DashboardSummary, SummaryFilters } from '@/api/query-list/admin/dashboard-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { formatSAR } from '@/lib/price'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

type SaleCardsProps = {
  chart: DashboardSummary['sale_chart']
  filters: SummaryFilters
  onFiltersChange: (filters: SummaryFilters) => void
}

export const SaleCards = ({ chart, filters, onFiltersChange }: SaleCardsProps) => {
  const isYearView = chart.range === 'year'
  const currentLabel = isYearView ? String(chart.year) : 'This Period'
  const previousLabel = isYearView ? String(chart.year - 1) : 'Previous Period'

  const chartConfig = {
    thisMonth: {
      label: currentLabel,
      color: '#22c55e',
    },
    lastMonth: {
      label: previousLabel,
      color: '#f97316',
    },
  } satisfies ChartConfig

  const changeYear = (delta: number) => onFiltersChange({ range: 'year', year: chart.year + delta })

  return (
    <Card className="border-0">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Sale</CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous year"
              className="text-dashboard hover:text-foreground"
              onClick={() => changeYear(-1)}
            >
              <ChevronLeft className="size-5" />
            </button>
            <span className="font-medium">{chart.year}</span>
            <button
              type="button"
              aria-label="Next year"
              className="text-dashboard hover:text-foreground disabled:opacity-60"
              disabled={chart.year >= new Date().getFullYear()}
              onClick={() => changeYear(1)}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          <select
            aria-label="Sales period"
            className="text-muted-foreground border-none bg-transparent text-sm outline-none"
            value={filters.range ?? 'year'}
            onChange={(event) =>
              onFiltersChange({ range: event.target.value as SummaryFilters['range'] })
            }
          >
            <option value="year">12 months</option>
            <option value="30">30 days</option>
            <option value="7">7 days</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={chart.points} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillThisMonth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              minTickGap={16}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : String(value))}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
              formatter={(value) => formatSAR(Number(value))}
            />
            <Area
              type="monotone"
              dataKey="thisMonth"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#fillThisMonth)"
            />
            <Area
              type="monotone"
              dataKey="lastMonth"
              stroke="#f97316"
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="transparent"
            />
          </AreaChart>
        </ChartContainer>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-green-500" />
            <span className="text-sm">{currentLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-orange-500" />
            <span className="text-sm">{previousLabel}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
