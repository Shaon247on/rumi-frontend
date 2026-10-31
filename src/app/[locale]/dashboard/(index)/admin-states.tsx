import type { DashboardSummary } from '@/api/query-list/admin/dashboard-query'
import { Card, CardContent } from '@/components/ui/card'
import { formatSAR } from '@/lib/price'
import { cn } from '@/lib/utils'
import { BarChart3, DollarSign, MessageSquare, ShoppingCart, Users } from 'lucide-react'

export const AdminStates = ({ data }: { data: DashboardSummary }) => {
  const stats = [
    {
      id: 'revenue',
      icon: DollarSign,
      label: 'Total Revenue',
      value: formatSAR(data.total_revenue),
      change: data.changes.revenue,
    },
    {
      id: 'orders',
      icon: ShoppingCart,
      label: 'Orders',
      value: data.total_orders.toLocaleString(),
      change: data.changes.orders,
    },
    {
      id: 'customers',
      icon: Users,
      label: 'Total Customer',
      value: data.total_customers.toLocaleString(),
      change: data.changes.customers,
    },
    {
      id: 'views',
      icon: BarChart3,
      label: 'Product Views',
      value: data.product_views.toLocaleString(),
      change: data.changes.views,
    },
    {
      id: 'conversion',
      icon: MessageSquare,
      label: 'Conversation rate',
      value: `${data.conversion_rate.toFixed(1)}%`,
      change: data.changes.conversion,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.id} className="border-0 bg-[#F7F5ED]">
          <CardContent className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="bg-main-button/10 rounded-lg p-2">
                <stat.icon className="text-main-button size-5" />
              </div>
              <span
                title="Compared to the previous 30 days"
                className={cn('text-xs', stat.change < 0 ? 'text-red-500' : 'text-muted-foreground')}
              >
                {stat.change > 0 ? '+' : ''}
                {stat.change}%
              </span>
            </div>
            <p className="text-muted-foreground text-sm">{stat.label}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
