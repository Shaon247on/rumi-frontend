import type { DashboardSummary } from '@/api/query-list/admin/dashboard-query'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatSAR } from '@/lib/price'
import { format } from 'date-fns'
import Image from 'next/image'
import { getOrderStatusLabel, getOrderStatusStyles } from '../orders/order-status'

export const OrdersList = ({ orders }: { orders: DashboardSummary['recent_orders'] }) => {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Orders</CardTitle>
        <p className="text-muted-foreground text-sm">Last 1 Month Report</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-muted-foreground border-b border-gray-200 text-left text-sm">
              <th className="pb-4 font-normal">Id</th>
              <th className="pb-4 font-normal">Product</th>
              <th className="pb-4 font-normal">Qty</th>
              <th className="pb-4 font-normal">Order Date</th>
              <th className="pb-4 font-normal">Status</th>
              <th className="pb-4 font-normal">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-gray-100">
                <td className="py-4 font-medium">#{order.id}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={order.image || productFallbackImage}
                      alt={order.product}
                      width={32}
                      height={32}
                      unoptimized
                      className="size-8 rounded object-contain"
                    />
                    <div>
                      <p className="font-medium">
                        {order.product}
                        {order.extra_items > 0 ? ` +${order.extra_items}` : ''}
                      </p>
                      {order.sku ? (
                        <p className="text-muted-foreground text-xs">{order.sku}</p>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="py-4">{order.quantity}</td>
                <td className="py-4">{format(new Date(order.date), 'dd.MM.yyyy')}</td>
                <td className="py-4">
                  <span
                    className={`rounded px-3 py-1 text-sm ${getOrderStatusStyles(order.status)}`}
                  >
                    {getOrderStatusLabel(order.status)}
                  </span>
                </td>
                <td className="py-4">{formatSAR(order.amount)}</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-muted-foreground py-8 text-center text-sm">
                  No orders in the last month.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
