'use client'

import { useUpdateOrderStatus } from '@/api/api-hooks/admin/dashboard.api-hooks'
import type { AdminOrder } from '@/api/query-list/admin/dashboard-query'
import { Button } from '@/components/ui'
import { DialogTitle } from '@/components/ui/dialog'
import { formatSAR } from '@/lib/price'
import { useState } from 'react'
import { ORDER_STATUS_OPTIONS } from './order-status'

export const EditOrder = ({ order, onDone }: { order: AdminOrder; onDone: () => void }) => {
  const [status, setStatus] = useState(order.status)
  const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatus()
  const isCancelled = order.status === 'cancelled'
  const address = [order.address_line1, order.address_line2, order.city, order.state, order.postal_code]
    .filter(Boolean)
    .join(', ')

  const handleSave = async () => {
    try {
      await updateStatus({ id: order.id, status })
      onDone()
    } catch {
      // The mutation hook already shows the error toast
    }
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <DialogTitle className="text-2xl font-medium text-white">Order #{order.id}</DialogTitle>
        <p className="text-sm text-white/60">
          {order.full_name} · {order.user_email} · {order.phone}
        </p>
        <p className="text-sm text-white/60">{address}</p>
      </div>

      <ul className="divide-y divide-white/10 rounded-lg bg-white/5 px-4">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
            <span>
              {item.product_name} × {item.quantity}
            </span>
            <span>{formatSAR(Number(item.price) * item.quantity)}</span>
          </li>
        ))}
        <li className="flex items-center justify-between gap-4 py-3 text-sm font-medium">
          <span>Total ({order.payment_method})</span>
          <span>{formatSAR(order.total_amount)}</span>
        </li>
      </ul>

      <div className="space-y-1.5">
        <label htmlFor="order-status" className="text-sm font-medium">
          Order Status
        </label>
        <select
          id="order-status"
          value={status}
          disabled={isCancelled}
          onChange={(event) => setStatus(event.target.value)}
          className="text-dashboard h-11 w-full rounded-md bg-[#F8F5EE] px-3 text-sm outline-none disabled:opacity-60"
        >
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isCancelled ? (
          <p className="text-xs text-white/60">Cancelled orders can&apos;t be reopened.</p>
        ) : status === 'cancelled' ? (
          <p className="text-xs text-white/60">Cancelling returns the items to stock.</p>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          className="text-dashboard bg-white px-10 hover:bg-white/90"
          disabled={isPending || isCancelled || status === order.status}
          onClick={() => void handleSave()}
        >
          {isPending ? 'SAVING...' : 'SAVE'}
        </Button>
      </div>
    </div>
  )
}
