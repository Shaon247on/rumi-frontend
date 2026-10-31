'use client'

import { useAdminCustomers, useDeleteAdminUser } from '@/api/api-hooks/admin/dashboard.api-hooks'
import { adminUserApi } from '@/api/query-list/admin/dashboard-query'
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
import { buttonVariants } from '@/components/ui'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatSAR } from '@/lib/price'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import { AddCustomer } from './add-customer'
import { ViewCustomer } from './view-customer'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'high-orders', label: 'High Orders' },
  { value: 'low-orders', label: 'Low Orders' },
]

const Customer = () => {
  const { search, setSearch, filter, setFilter, page, setPage, deferredSearch } = useTableFilters()
  const [isAdding, setIsAdding] = useState(false)
  const [viewing, setViewing] = useState<string | null>(null)
  const filters = { page, page_size: TABLE_PAGE_SIZE, search: deferredSearch, sort: filter }
  const { data, isLoading, isError, refetch } = useAdminCustomers(filters)
  const { mutateAsync: deleteUser } = useDeleteAdminUser()
  const customers = data?.results ?? []
  const selection = useRowSelection(customers.map((customer) => customer.membership_id))

  const loadExportRows = async () => {
    const all = await adminUserApi.getCustomers({
      ...filters,
      page: 1,
      page_size: EXPORT_PAGE_SIZE,
    })
    return all.results
      .filter(
        (customer) =>
          selection.selected.length === 0 || selection.isSelected(customer.membership_id)
      )
      .map((customer) => ({
        'Customer Name': customer.customer_name ?? '',
        ID: customer.id_format,
        Location: customer.location,
        Orders: customer.orders,
        'Total Spent': customer.total_spent,
        'Phone Number': customer.phone_number,
      }))
  }

  return (
    <div className="space-y-6">
      {/* Header with buttons */}
      <div className="flex items-center justify-end gap-3">
        <ExportButton
          filename="customers"
          loadRows={loadExportRows}
          selectedCount={selection.selected.length}
        />
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger className={buttonVariants({ variant: 'outline' })}>
            ADD CUSTOMER
          </DialogTrigger>
          <DialogContent className="bg-main-button! border-2 border-black/30 sm:min-w-xl">
            <AddCustomer onDone={() => setIsAdding(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <SearchBox value={search} onChange={setSearch} />
        <FilterSelect value={filter} onChange={setFilter} options={FILTER_OPTIONS} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white">
        <Table>
          <TableHeader className="bg-[#f5f4f3]">
            <TableRow className="border-b-0">
              <TableHead className="w-12">
                <SelectCheckbox
                  checked={selection.allSelected}
                  onToggle={selection.toggleAll}
                  label="Select all customers"
                />
              </TableHead>
              <TableHead className="text-main-button font-medium">Customer Name</TableHead>
              <TableHead className="text-main-button font-medium">ID</TableHead>
              <TableHead className="text-main-button font-medium">Location</TableHead>
              <TableHead className="text-main-button font-medium">Orders</TableHead>
              <TableHead className="text-main-button font-medium">Total Spent</TableHead>
              <TableHead className="text-main-button font-medium">Phone Number</TableHead>
              <TableHead className="text-main-button text-right font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableState
              colSpan={8}
              isLoading={isLoading}
              isError={isError}
              isEmpty={customers.length === 0}
              emptyText="No customers found."
              onRetry={() => void refetch()}
            />
            {customers.map((customer) => (
              <TableRow key={customer.id} className="border-b border-gray-100">
                <TableCell>
                  <SelectCheckbox
                    checked={selection.isSelected(customer.membership_id)}
                    onToggle={() => selection.toggle(customer.membership_id)}
                    label={`Select ${customer.customer_name ?? customer.id_format}`}
                  />
                </TableCell>
                <TableCell className="text-main-button font-medium">
                  {customer.customer_name || '-'}
                </TableCell>
                <TableCell className="text-main-button">{customer.id_format}</TableCell>
                <TableCell className="text-main-button max-w-[250px] whitespace-normal">
                  {customer.location || '-'}
                </TableCell>
                <TableCell className="text-main-button">{customer.orders}</TableCell>
                <TableCell className="text-main-button">{formatSAR(customer.total_spent)}</TableCell>
                <TableCell className="text-main-button">{customer.phone_number || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`View ${customer.customer_name ?? customer.id_format}`}
                      className="text-main-button/60 hover:text-main-button p-1"
                      onClick={() => setViewing(customer.membership_id)}
                    >
                      <Eye className="size-4" />
                    </button>
                    <ConfirmDelete
                      title="Delete this customer?"
                      description={`This permanently deletes the account and their ${customer.orders} order(s), which also removes them from your sales figures. This can't be undone.`}
                      onConfirm={() => deleteUser(customer.membership_id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination page={page} count={data?.count ?? 0} onPageChange={setPage} />

      <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent
          showCloseButton={false}
          className="bg-main-button max-h-[90vh] max-w-5xl! overflow-y-auto"
        >
          {viewing ? (
            <ViewCustomer membershipId={viewing} onClose={() => setViewing(null)} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Customer
