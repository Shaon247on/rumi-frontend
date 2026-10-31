'use client'

import {
  useAdminCustomer,
  useDeleteAdminUser,
  useUpdateAdminCustomer,
} from '@/api/api-hooks/admin/dashboard.api-hooks'
import { ConfirmDelete } from '@/components/dashboard'
import { Button } from '@/components/ui'
import { DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
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
import { format, formatDistanceToNow } from 'date-fns'
import { UserRound, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { getOrderStatusLabel, getOrderStatusStyles } from '../orders/order-status'

export const ViewCustomer = ({
  membershipId,
  onClose,
}: {
  membershipId: string
  onClose: () => void
}) => {
  const { data: customer, isLoading, isError } = useAdminCustomer(membershipId)
  const { mutateAsync: updateCustomer, isPending: isSaving } = useUpdateAdminCustomer()
  const { mutateAsync: deleteUser } = useDeleteAdminUser()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ full_name: '', email: '', contact_number: '' })

  const startEditing = () => {
    setForm({
      full_name: customer?.name ?? '',
      email: customer?.email ?? '',
      contact_number: customer?.contact_number ?? '',
    })
    setIsEditing(true)
  }

  const saveChanges = async () => {
    try {
      await updateCustomer({ membershipId, data: form })
      setIsEditing(false)
    } catch {
      // The mutation hook already shows the error toast
    }
  }

  return (
    <div className="space-y-6">
      <DialogTitle className="sr-only">Customer details</DialogTitle>
      <div className="flex items-center justify-end">
        <button
          type="button"
          aria-label="Close"
          className="text-white hover:text-white/80"
          onClick={onClose}
        >
          <div className="rounded-md border border-white/30 p-2">
            <X className="size-5" />
          </div>
        </button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-xl bg-white/10" />
      ) : isError || !customer ? (
        <p className="py-10 text-center text-white">Could not load this customer.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          {/* Left Column */}
          <div className="min-w-0 space-y-6">
            {/* Customer Profile Card */}
            <div className="rounded-xl bg-white p-6">
              <div className="flex items-start gap-4">
                <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                  {customer.image ? (
                    <Image
                      src={customer.image}
                      alt={customer.name ?? customer.email}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <UserRound className="text-main-button/40 size-8" />
                  )}
                </div>
                <div>
                  <h2 className="text-main-button text-xl font-semibold">
                    {customer.name || customer.email}
                  </h2>
                  <p className="text-main-button/70 text-sm">#{customer.membership_id}</p>
                  <p className="text-main-button/70 text-sm">{customer.order_count} Orders</p>
                  <p className="text-main-button/70 text-sm">
                    Customer for {formatDistanceToNow(new Date(customer.join_date))}
                  </p>
                  <p className="text-main-button/70 text-sm">
                    Total spent {formatSAR(customer.total_spent)}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Orders Table */}
            <div className="rounded-xl bg-white p-6">
              <h3 className="text-main-button mb-4 text-lg font-semibold">Customer Orders</h3>
              <Table>
                <TableHeader>
                  <TableRow className="border-b-0">
                    <TableHead className="text-main-button/70 text-xs font-medium">Order</TableHead>
                    <TableHead className="text-main-button/70 text-xs font-medium">Date</TableHead>
                    <TableHead className="text-main-button/70 text-xs font-medium">
                      Order Status
                    </TableHead>
                    <TableHead className="text-main-button/70 text-xs font-medium">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.orders.map((order) => (
                    <TableRow key={order.id} className="border-b-0">
                      <TableCell className="text-main-button text-sm">#{order.id}</TableCell>
                      <TableCell className="text-main-button text-sm">
                        {format(new Date(order.created_at), 'MMM d, h:mm a')}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'rounded-full px-3 py-1 text-xs',
                            getOrderStatusStyles(order.status)
                          )}
                        >
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-main-button text-sm">
                        {formatSAR(order.total_amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {customer.orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-sm text-gray-500">
                        No orders yet.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Right Column - Overview Card */}
          <div className="rounded-xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-main-button text-lg font-semibold">Overview</h3>
              {!isEditing ? (
                <button
                  type="button"
                  className="text-sm text-blue-500 hover:underline"
                  onClick={startEditing}
                >
                  Edit
                </button>
              ) : null}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                {(
                  [
                    ['full_name', 'Name'],
                    ['email', 'Email Address'],
                    ['contact_number', 'Phone'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key}>
                    <label htmlFor={`customer-${key}`} className="text-main-button/50 text-xs">
                      {label}
                    </label>
                    <Input
                      id={`customer-${key}`}
                      value={form[key]}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, [key]: event.target.value }))
                      }
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    className="bg-main-button hover:bg-main-button/90 flex-1 text-white"
                    disabled={isSaving}
                    onClick={() => void saveChanges()}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-main-button/50 text-xs">Address</p>
                  <p className="text-main-button text-sm">{customer.address || '-'}</p>
                </div>

                <div>
                  <p className="text-main-button/50 text-xs">Email Address</p>
                  <p className="text-main-button text-sm break-all">{customer.email}</p>
                </div>

                <div>
                  <p className="text-main-button/50 text-xs">Phone</p>
                  <p className="text-main-button text-sm">{customer.contact_number || '-'}</p>
                </div>
              </div>
            )}

            <div className="mt-8">
              <ConfirmDelete
                title="Delete this customer?"
                description={`This permanently deletes the account and their ${customer.order_count} order(s), which also removes them from your sales figures. This can't be undone.`}
                onConfirm={async () => {
                  await deleteUser(membershipId)
                  onClose()
                }}
                trigger={
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    Delete Customer
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
