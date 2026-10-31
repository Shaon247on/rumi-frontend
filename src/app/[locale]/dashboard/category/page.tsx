'use client'

import {
  useAdminCategories,
  useDeleteAdminCategory,
} from '@/api/api-hooks/admin/category.api-hooks'
import { adminCategoryApi, type AdminCategory } from '@/api/query-list/admin/category-query'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import {
  ConfirmDelete,
  ExportButton,
  EXPORT_PAGE_SIZE,
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
import { format } from 'date-fns'
import { Pencil } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { AddCategory } from './add-category'

const formatDate = (value: string) => format(new Date(value), 'dd MMM yyyy')

const CategoryPage = () => {
  const { search, setSearch, page, setPage, deferredSearch } = useTableFilters()
  const [isAdding, setIsAdding] = useState(false)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const filters = { page, page_size: TABLE_PAGE_SIZE, search: deferredSearch }
  const { data, isLoading, isError, refetch } = useAdminCategories(filters)
  const { mutateAsync: deleteCategory } = useDeleteAdminCategory()
  const categories = data?.results ?? []
  const selection = useRowSelection(categories.map((category) => category.id))

  const loadExportRows = async () => {
    const all = await adminCategoryApi.getCategories({
      ...filters,
      page: 1,
      page_size: EXPORT_PAGE_SIZE,
    })
    return all.results
      .filter((category) => selection.selected.length === 0 || selection.isSelected(category.id))
      .map((category) => ({
        Category: category.name,
        Products: category.product_count,
        Quantity: category.quantity,
        Sale: category.sale,
        'Start Date': formatDate(category.created_at),
      }))
  }

  return (
    <div className="space-y-6">
      {/* Header with buttons */}
      <div className="flex items-center justify-end gap-3">
        <ExportButton
          filename="categories"
          loadRows={loadExportRows}
          selectedCount={selection.selected.length}
        />
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger className={buttonVariants({ variant: 'outline' })}>
            ADD CATEGORY
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <AddCategory onDone={() => setIsAdding(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search bar */}
      <SearchBox value={search} onChange={setSearch} />

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white">
        <Table>
          <TableHeader className="bg-[#f5f4f3]">
            <TableRow className="border-b-0">
              <TableHead className="w-12">
                <SelectCheckbox
                  checked={selection.allSelected}
                  onToggle={selection.toggleAll}
                  label="Select all categories"
                />
              </TableHead>
              <TableHead className="text-dashboard font-medium">Category</TableHead>
              <TableHead className="text-dashboard font-medium">Quantity</TableHead>
              <TableHead className="text-dashboard font-medium">Sale</TableHead>
              <TableHead className="text-dashboard font-medium">Start Date</TableHead>
              <TableHead className="text-dashboard text-right font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableState
              colSpan={6}
              isLoading={isLoading}
              isError={isError}
              isEmpty={categories.length === 0}
              emptyText="No categories found."
              onRetry={() => void refetch()}
            />
            {categories.map((category) => (
              <TableRow key={category.id} className="border-b border-gray-100">
                <TableCell>
                  <SelectCheckbox
                    checked={selection.isSelected(category.id)}
                    onToggle={() => selection.toggle(category.id)}
                    label={`Select ${category.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={category.image || productFallbackImage}
                        alt={category.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <span className="text-dashboard font-medium">{category.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-dashboard">{category.quantity}</TableCell>
                <TableCell className="text-dashboard">{category.sale}</TableCell>
                <TableCell className="text-dashboard">{formatDate(category.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`Edit ${category.name}`}
                      className="text-dashboard/60 hover:text-dashboard p-1"
                      onClick={() => setEditing(category)}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <ConfirmDelete
                      title={`Delete ${category.name}?`}
                      description={`This also deletes its ${category.product_count} product(s). Categories with ordered products can't be deleted.`}
                      onConfirm={() => deleteCategory(category.id)}
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
        <DialogContent className="sm:max-w-[500px]">
          {editing ? (
            <AddCategory key={editing.id} category={editing} onDone={() => setEditing(null)} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CategoryPage
