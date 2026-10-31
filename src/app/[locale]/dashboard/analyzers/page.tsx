'use client'

import { useAdminAnalyzers, useDeleteAnalyses } from '@/api/api-hooks/admin/dashboard.api-hooks'
import { adminAnalyzerApi } from '@/api/query-list/admin/dashboard-query'
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
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import { useState } from 'react'
import { ViewAnalyzer } from './view-analyzer'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const formatDate = (value: string) => format(new Date(value), 'dd MMM, yyyy')

const Analyzer = () => {
  const { search, setSearch, filter, setFilter, page, setPage, deferredSearch } = useTableFilters()
  const [viewing, setViewing] = useState<number | null>(null)
  const filters = { page, page_size: TABLE_PAGE_SIZE, search: deferredSearch, status: filter }
  const { data, isLoading, isError, refetch } = useAdminAnalyzers(filters)
  const { mutateAsync: deleteAnalyses } = useDeleteAnalyses()
  const users = data?.results ?? []
  const selection = useRowSelection(users.map((user) => user.id))

  const loadExportRows = async () => {
    const all = await adminAnalyzerApi.getAnalyzers({
      ...filters,
      page: 1,
      page_size: EXPORT_PAGE_SIZE,
    })
    return all.results
      .filter((user) => selection.selected.length === 0 || selection.isSelected(user.id))
      .map((user) => ({
        'Customer Name': user.full_name ?? '',
        Email: user.email,
        'Join Date': formatDate(user.join_date),
        Status: user.active_status,
      }))
  }

  return (
    <div className="space-y-6">
      {/* Header with button */}
      <div className="flex items-center justify-end">
        <ExportButton
          filename="analyzers"
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
      <div className="overflow-hidden rounded-xl bg-white">
        <Table>
          <TableHeader className="bg-[#f5f4f3]">
            <TableRow className="border-b-0">
              <TableHead className="w-12">
                <SelectCheckbox
                  checked={selection.allSelected}
                  onToggle={selection.toggleAll}
                  label="Select all users"
                />
              </TableHead>
              <TableHead className="text-main-button font-medium">Customer Name</TableHead>
              <TableHead className="text-main-button font-medium">Email</TableHead>
              <TableHead className="text-main-button font-medium">Join Date</TableHead>
              <TableHead className="text-main-button font-medium">Status</TableHead>
              <TableHead className="text-main-button text-right font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableState
              colSpan={6}
              isLoading={isLoading}
              isError={isError}
              isEmpty={users.length === 0}
              emptyText="No skin analyses yet."
              onRetry={() => void refetch()}
            />
            {users.map((user) => (
              <TableRow key={user.id} className="border-b border-gray-100">
                <TableCell>
                  <SelectCheckbox
                    checked={selection.isSelected(user.id)}
                    onToggle={() => selection.toggle(user.id)}
                    label={`Select ${user.full_name ?? user.email}`}
                  />
                </TableCell>
                <TableCell className="text-main-button font-medium">
                  {user.full_name || '-'}
                </TableCell>
                <TableCell className="text-main-button">{user.email}</TableCell>
                <TableCell className="text-main-button">{formatDate(user.join_date)}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'rounded-full px-4 py-1 text-xs font-medium',
                      user.active_status === 'active'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-500'
                    )}
                  >
                    {user.active_status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`View ${user.full_name ?? user.email}`}
                      className="text-main-button/60 hover:text-main-button p-1"
                      onClick={() => setViewing(user.id)}
                    >
                      <Eye className="size-4" />
                    </button>
                    <ConfirmDelete
                      title="Delete these skin analyses?"
                      description="This removes this user's saved skin analyses. Their account and orders stay. This can't be undone."
                      onConfirm={() => deleteAnalyses(user.id)}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {viewing !== null ? <ViewAnalyzer id={viewing} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Analyzer
