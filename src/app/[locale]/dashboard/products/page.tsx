'use client'

import { useAdminProducts, useDeleteAdminProduct } from '@/api/api-hooks/admin/product.api-hooks'
import { adminProductApi, type AdminProduct } from '@/api/query-list/admin/product-query'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import {
  ConfirmDelete,
  ExportButton,
  EXPORT_PAGE_SIZE,
  FilterSelect,
  ProductView,
  SearchBox,
  SelectCheckbox,
  TablePagination,
  TableState,
  TABLE_PAGE_SIZE,
  useRowSelection,
  useTableFilters,
  greenPanelClassName,
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
import { formatSAR, getProductPricing } from '@/lib/price'
import { cn } from '@/lib/utils'
import { Eye, Pencil } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { AddProduct } from './add-product'

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'in-stock', label: 'In Stock' },
  { value: 'out-of-stock', label: 'Out of Stock' },
]

const Products = () => {
  const { search, setSearch, filter, setFilter, page, setPage, deferredSearch } = useTableFilters()
  const [isAdding, setIsAdding] = useState(false)
  const [viewing, setViewing] = useState<AdminProduct | null>(null)
  const [editing, setEditing] = useState<AdminProduct | null>(null)
  const filters = { page, page_size: TABLE_PAGE_SIZE, search: deferredSearch, stock: filter }
  const { data, isLoading, isError, refetch } = useAdminProducts(filters)
  const { mutateAsync: deleteProduct } = useDeleteAdminProduct()
  const products = data?.results ?? []
  const selection = useRowSelection(products.map((product) => product.id))

  const loadExportRows = async () => {
    const all = await adminProductApi.getProducts({
      ...filters,
      page: 1,
      page_size: EXPORT_PAGE_SIZE,
    })
    return all.results
      .filter((product) => selection.selected.length === 0 || selection.isSelected(product.id))
      .map((product) => ({
        Product: product.title,
        'Product ID': product.sku ?? product.id,
        Price: product.price,
        Discount: product.discount,
        Stock: product.stock,
        Sold: product.order_count,
        Category: product.category_name ?? '',
      }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-3">
        <ExportButton
          filename="products"
          loadRows={loadExportRows}
          selectedCount={selection.selected.length}
        />

        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger
            className={buttonVariants({
              variant: 'outline',
              className: 'text-dashboard border-white/30 bg-white',
            })}
          >
            ADD PRODUCT
          </DialogTrigger>
          <DialogContent className={cn(greenPanelClassName, 'max-h-[90vh] max-w-4xl! overflow-y-auto')}>
            <AddProduct onDone={() => setIsAdding(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SearchBox value={search} onChange={setSearch} />
        <FilterSelect value={filter} onChange={setFilter} options={FILTER_OPTIONS} />
      </div>

      <div className="overflow-hidden rounded-xl bg-white">
        <Table>
          <TableHeader className="bg-[#f5f4f3]">
            <TableRow className="border-b-0">
              <TableHead className="w-12">
                <SelectCheckbox
                  checked={selection.allSelected}
                  onToggle={selection.toggleAll}
                  label="Select all products"
                />
              </TableHead>
              <TableHead className="text-dashboard font-medium">Products</TableHead>
              <TableHead className="text-dashboard font-medium">Product ID</TableHead>
              <TableHead className="text-dashboard font-medium">Price</TableHead>
              <TableHead className="text-dashboard font-medium">Stock</TableHead>
              <TableHead className="text-dashboard font-medium">Category</TableHead>
              <TableHead className="text-dashboard text-right font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableState
              colSpan={7}
              isLoading={isLoading}
              isError={isError}
              isEmpty={products.length === 0}
              emptyText="No products found."
              onRetry={() => void refetch()}
            />
            {products.map((product) => (
              <TableRow key={product.id} className="border-b border-gray-100">
                <TableCell>
                  <SelectCheckbox
                    checked={selection.isSelected(product.id)}
                    onToggle={() => selection.toggle(product.id)}
                    label={`Select ${product.title}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={product.images[0]?.image || productFallbackImage}
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <span className="text-dashboard max-w-[220px] font-medium whitespace-normal">
                      {product.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-dashboard">{product.sku || `#${product.id}`}</TableCell>
                <TableCell className="text-dashboard">
                  {formatSAR(getProductPricing(product).finalPrice)}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs',
                      product.stock > 0
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    )}
                  >
                    {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
                  </span>
                </TableCell>
                <TableCell className="text-dashboard">{product.category_name}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      aria-label={`View ${product.title}`}
                      className="text-dashboard/60 hover:text-dashboard p-1"
                      onClick={() => setViewing(product)}
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Edit ${product.title}`}
                      className="text-dashboard/60 hover:text-dashboard p-1"
                      onClick={() => setEditing(product)}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <ConfirmDelete
                      title={`Delete ${product.title}?`}
                      description="Products with orders can't be deleted; set their stock to 0 instead. This can't be undone."
                      onConfirm={() => deleteProduct(product.id)}
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
        <DialogContent className={cn(greenPanelClassName, 'max-h-[90vh] max-w-7xl! overflow-y-auto')}>
          {viewing ? (
            <ProductView
              product={viewing}
              onEdit={() => {
                setEditing(viewing)
                setViewing(null)
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className={cn(greenPanelClassName, 'max-h-[90vh] max-w-4xl! overflow-y-auto')}>
          {editing ? (
            <AddProduct key={editing.id} product={editing} onDone={() => setEditing(null)} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Products
