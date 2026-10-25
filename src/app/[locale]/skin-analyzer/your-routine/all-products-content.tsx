'use client'

import { useProducts } from '@/api/api-hooks/product.api-hook'
import { ProductCard } from '@/components/shared/product-card-main'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { useDeferredValue, useMemo, useState } from 'react'

const PAGE_SIZE = 6

const ProductSkeleton = () => {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-3/4 rounded-lg bg-[#e8e6e3]" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  )
}

const PaginationButton = ({
  children,
  disabled,
  onClick,
  active,
}: {
  active?: boolean
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-sm transition ${
        active
          ? 'bg-main-button border-main-button text-white'
          : 'border-[#d8d3cc] bg-white text-[#363739] hover:border-[#1a2e1a] hover:text-[#1a2e1a]'
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  )
}

export const AllProductsContent = () => {
  const t = useTranslations('productDetails')
  const [searchInput, setSearchInput] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const deferredSearch = useDeferredValue(searchInput.trim())
  const filters = useMemo(
    () => ({
      page: pageIndex,
      page_size: PAGE_SIZE,
      search: deferredSearch || undefined,
    }),
    [deferredSearch, pageIndex]
  )

  const { data, error, isLoading, isFetching } = useProducts(filters)

  const products = Array.isArray(data?.items) ? data.items : []
  const totalPages = data?.totalPages ?? 1

  const handlePrevPage = () => {
    setPageIndex((current) => Math.max(1, current - 1))
  }

  const handleNextPage = () => {
    setPageIndex((current) => Math.min(totalPages, current + 1))
  }

  const handlePageClick = (nextPage: number) => {
    setPageIndex(nextPage)
  }

  return (
    <div className="mx-auto mt-8 max-w-5xl space-y-6 px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="text-main-button/60 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value)
              setPageIndex(1)
            }}
            placeholder="Search products"
            className="border-[#d8d3cc] bg-white pl-9"
          />
        </div>

        {isFetching && !isLoading ? (
          <p className="text-main-button/60 text-sm">Updating results...</p>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <ProductSkeleton key={`product-skeleton-${index}`} />
          ))}
        </div>
      ) : error ? (
        <div className="bg-brand-shade-10 rounded-2xl p-6 text-center">
          <p className="text-main-button text-base font-medium">Failed to load products.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-brand-shade-10 rounded-2xl p-6 text-center">
          <p className="text-main-button text-base font-medium">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} viewDetailsLabel={t('viewDetails')} />
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap items-center justify-center gap-2 pt-2">
        <span className="text-main-button/60 mr-2 text-sm">{`Page ${pageIndex} of ${totalPages}`}</span>
        <PaginationButton onClick={handlePrevPage} disabled={pageIndex <= 1}>
          <ChevronLeft className="size-4" />
        </PaginationButton>

        {Array.from({ length: totalPages }).map((_, index) => {
          const nextPage = index + 1

          return (
            <PaginationButton
              key={`product-page-${nextPage}`}
              active={nextPage === pageIndex}
              onClick={() => handlePageClick(nextPage)}
            >
              {nextPage}
            </PaginationButton>
          )
        })}

        <PaginationButton onClick={handleNextPage} disabled={pageIndex >= totalPages}>
          <ChevronRight className="size-4" />
        </PaginationButton>
      </div>
    </div>
  )
}
