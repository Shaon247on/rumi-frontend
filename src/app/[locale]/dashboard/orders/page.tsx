'use client'

import { useAdminOrders, useDeleteOrder } from '@/api/api-hooks/admin/dashboard.api-hooks'
import { adminOrderApi, type AdminOrder } from '@/api/query-list/admin/dashboard-query'
import {
  ConfirmDelete,
  ExportButton,
  EXPORT_PAGE_SIZE,
  FilterSelect,
  SearchBox,
  SelectCheckbox,
  TablePagination,
  TableState,
  TABLE_PAGE_SIZE,
  useRowSelection,
  useTableFilters,
} from '@/components/dashboard'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatSAR } from '@/lib/price'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { EditOrder } from './edit-order'
import {
  getOrderStatusLabel,
  getOrderStatusStyles,
  getPaymentStatusStyles,
  ORDER_STATUS_OPTIONS,
} from './order-status'

const FILTER_OPTIONS = [{ value: 'all', label: 'All' }, ...ORDER_STATUS_OPTIONS]

const formatDate = (value: string) => format(new Date(value), 'dd MMM, h:mm a')

const Orders = () => {
  const { search, setSearch, filter, setFilter, page, setPage, deferredSearch } = useTableFilters()
  const [editing, setEditing] = useState<AdminOrder | null>(null)
  const filters = { page, page_size: TABLE_PAGE_SIZE, search: deferredSearch, status: filter }
  const { data, isLoading, isError, refetch } = useAdminOrders(filters)
  const { mutateAsync: deleteOrder } = useDeleteOrder()
  const orders = data?.results ?? []
  const selection = useRowSelection(orders.map((order) => order.id))

  const loadExportRows = async () => {
    const all = await adminOrderApi.getOrders({ ...filters, page: 1, page_size: EXPORT_PAGE_SIZE })
    return all.results
      .filter((order) => selection.selected.length === 0 || selection.isSelected(order.id))
      .map((order) => ({
        Order: order.id,
        Date: formatDate(order.created_at),
        Customer: order.full_name,
        Email: order.user_email,
        Phone: order.phone,
        City: order.city,
        'Payment Method': order.payment_method,
        'Payment Status': order.payment_status,
        Total: order.total_amount,
        'Order Status': getOrderStatusLabel(order.status),
      }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-3">
        <ExportButton
          filename="orders"
          loadRows={loadExportRows}
          selectedCount={selection.selected.length}
        />
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <SearchBox value={search} onChange={setSearch} />
        <FilterSelect value={filter} onChange={setFilter} options={FILTER_OPTIONS} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-sm bg-white">
        <Table>
          <TableHeader className="bg-[#f5f4f3]">
            <TableRow className="border-b-0">
              <TableHead className="w-12">
                <SelectCheckbox
                  checked={selection.allSelected}
                  onToggle={selection.toggleAll}
                  label="Select all orders"
                />
              </TableHead>
              <TableHead className="text-main-button font-medium">Order</TableHead>
              <TableHead className="text-main-button font-medium">Date & Time</TableHead>
              <TableHead className="text-main-button font-medium">Customer</TableHead>
              <TableHead className="text-main-button font-medium">Payment Status</TableHead>
              <TableHead className="text-main-button font-medium">Total</TableHead>
              <TableHead className="text-main-button font-medium">Order Status</TableHead>
              <TableHead className="text-main-button text-right font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableState
              colSpan={8}
              isLoading={isLoading}
              isError={isError}
              isEmpty={orders.length === 0}
              emptyText="No orders found."
              onRetry={() => void refetch()}
            />
            {orders.map((order) => (
              <TableRow key={order.id} className="border-b border-gray-100">
                <TableCell>
                  <SelectCheckbox
                    checked={selection.isSelected(order.id)}
                    onToggle={() => selection.toggle(order.id)}
                    label={`Select order ${order.id}`}
                  />
                </TableCell>
                <TableCell className="text-main-button font-medium">#{order.id}</TableCell>
                <TableCell className="text-main-button">{formatDate(order.created_at)}</TableCell>
                <TableCell className="text-main-button">{order.full_name}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'border px-3 py-1 text-xs capitalize',
                      getPaymentStatusStyles(order.payment_status)
                    )}
                  >
                    {order.payment_status}
                  </span>
                </TableCell>
                <TableCell className="text-main-button">{formatSAR(order.total_amount)}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'rounded px-3 py-1 text-xs font-medium',
                      getOrderStatusStyles(order.status)
                    )}
                  >
                    {getOrderStatusLabel(order.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`Edit order ${order.id}`}
                      className="text-main-button/60 hover:text-main-button p-1"
                      onClick={() => setEditing(order)}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <ConfirmDelete
                      title={`Delete order #${order.id}?`}
                      description="Only cancelled or failed orders can be deleted. This can't be undone."
                      onConfirm={() => deleteOrder(order.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination page={page} count={data?.count ?? 0} onPageChange={setPage} />

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="bg-main-button max-h-[90vh] overflow-y-auto sm:max-w-xl">
          {editing ? (
            <EditOrder key={editing.id} order={editing} onDone={() => setEditing(null)} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Orders
