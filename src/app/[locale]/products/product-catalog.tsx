'use client'

import { useCategories } from '@/api/api-hooks/category.api-hook'
import { useProducts } from '@/api/api-hooks/product.api-hook'
import {
  PRODUCT_SKIN_TYPES,
  type ProductOrdering,
  type ProductSkinType,
} from '@/api/query-list/product.query'
import { CatalogProductCard } from '@/components/product-experience/catalog-product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useDeferredValue, useMemo, useState } from 'react'

const PAGE_SIZE = 12

// Footer links use ?filter=best-sellers / new-arrivals
const FILTER_TO_ORDERING: Record<string, ProductOrdering> = {
  'best-sellers': 'best',
  'new-arrivals': 'new',
}

const SORT_OPTIONS = ['featured', 'best', 'new', 'price_asc', 'price_desc'] as const
type SortOption = (typeof SORT_OPTIONS)[number]

const slugify = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-')

const selectClass =
  'h-11 rounded-none border border-[#E6DFD5] bg-white px-3 text-sm text-charcoal focus:border-charcoal focus:outline-none'

export const ProductCatalog = () => {
  const t = useTranslations('productsPage.catalog')
  const locale = useLocale()
  const isAR = locale === 'ar'
  const searchParams = useSearchParams()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [skinType, setSkinType] = useState<ProductSkinType>('all')
  const [sort, setSort] = useState<SortOption>(
    () => FILTER_TO_ORDERING[searchParams.get('filter') ?? ''] ?? 'featured'
  )
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const deferredSearch = useDeferredValue(search.trim())

  const { data: categories } = useCategories()

  // ?category=<slug> from footer links, until the user picks a category themselves
  const categoryFromUrl = useMemo(() => {
    const slug = searchParams.get('category')
    if (!slug || !Array.isArray(categories)) return undefined
    return categories.find((category) => slugify(category.name) === slug)?.id
  }, [categories, searchParams])
  const [hasPickedCategory, setHasPickedCategory] = useState(false)
  const activeCategory = hasPickedCategory ? categoryId : categoryFromUrl

  const filters = useMemo(
    () => ({
      page,
      page_size: PAGE_SIZE,
      search: deferredSearch || undefined,
      skin_type: skinType,
      category: activeCategory,
      ordering: sort === 'featured' ? undefined : sort,
    }),
    [activeCategory, deferredSearch, page, skinType, sort]
  )

  const { data, error, isLoading, isFetching, refetch } = useProducts(filters)
  const products = data?.items ?? []
  const totalPages = data?.totalPages ?? 1

  const pickCategory = (id: number | undefined) => {
    setHasPickedCategory(true)
    setCategoryId(id)
    setPage(1)
  }

  const clearFilters = () => {
    setSearch('')
    setSkinType('all')
    setSort('featured')
    pickCategory(undefined)
  }

  return (
    <section className={cn('px-4 pt-32 pb-24 sm:px-6 md:pt-40 lg:px-12', isAR && 'font-arabic')}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] tracking-[0.3em] text-[#8C8275] uppercase">{t('eyebrow')}</p>
          <h1
            className="mt-3 text-4xl font-extralight text-[#1A1918] md:text-6xl"
            style={{
              fontFamily: isAR ? 'var(--font-amiri), serif' : 'var(--font-cormorant-garamond), serif',
            }}
          >
            {t('title')}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#5C564E] md:text-base">
            {t('description')}
          </p>
        </header>

        {/* Category tabs */}
        {Array.isArray(categories) && categories.length > 0 ? (
          <nav className="mt-12 -mx-4 overflow-x-auto px-4">
            <ul className="flex min-w-max justify-start gap-6 border-b border-[#E6DFD5] md:justify-center">
              {[{ id: undefined, name: t('allCategories') }, ...categories].map((category) => {
                const isActive = activeCategory === category.id
                return (
                  <li key={category.id ?? 'all'}>
                    <button
                      type="button"
                      onClick={() => pickCategory(category.id)}
                      className={cn(
                        '-mb-px border-b pb-3 text-xs tracking-[0.2em] uppercase transition-colors',
                        isActive
                          ? 'border-charcoal text-charcoal'
                          : 'border-transparent text-[#8C8275] hover:text-charcoal'
                      )}
                    >
                      {category.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        ) : null}

        {/* Toolbar */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1 md:max-w-sm">
            <span className="sr-only">{t('searchPlaceholder')}</span>
            <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#8C8275]" />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              placeholder={t('searchPlaceholder')}
              className="h-11 w-full border border-[#E6DFD5] bg-white ps-9 pe-3 text-sm text-charcoal placeholder:text-[#A39B90] focus:border-charcoal focus:outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3 md:ms-auto md:flex">
            <label className="sr-only" htmlFor="catalog-skin-type">
              {t('skinTypeLabel')}
            </label>
            <select
              id="catalog-skin-type"
              value={skinType}
              onChange={(event) => {
                setSkinType(event.target.value as ProductSkinType)
                setPage(1)
              }}
              className={selectClass}
            >
              {PRODUCT_SKIN_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`skinTypes.${type}`)}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="catalog-sort">
              {t('sortLabel')}
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortOption)
                setPage(1)
              }}
              className={selectClass}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {t(`sort.${option}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="mt-6 text-xs text-[#8C8275]" aria-live="polite">
          {data ? t('results', { count: data.count }) : ' '}
          {isFetching && !isLoading ? ' …' : null}
        </p>

        {/* Grid */}
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index}>
                  <Skeleton className="aspect-4/5 rounded-none bg-[#EFEAE2]" />
                  <Skeleton className="mt-4 h-5 w-3/4 bg-[#EFEAE2]" />
                  <Skeleton className="mt-2 h-4 w-1/3 bg-[#EFEAE2]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border border-[#E6DFD5] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#5C564E]">{t('error')}</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-5 border border-charcoal px-6 py-3 text-xs tracking-[0.2em] text-charcoal uppercase hover:bg-charcoal hover:text-white"
              >
                {t('retry')}
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="border border-[#E6DFD5] bg-white px-6 py-16 text-center">
              <p className="text-sm text-[#5C564E]">{t('empty')}</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 border border-charcoal px-6 py-3 text-xs tracking-[0.2em] text-charcoal uppercase hover:bg-charcoal hover:text-white"
              >
                {t('clearFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
              {products.map((product) => (
                <CatalogProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && products.length > 0 ? (
          <nav className="mt-16 flex items-center justify-center gap-4" aria-label="pagination">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="inline-flex size-11 items-center justify-center border border-[#E6DFD5] bg-white text-charcoal transition-colors hover:border-charcoal disabled:opacity-40"
              aria-label={t('previous')}
            >
              <ChevronLeft className="size-4 rtl:rotate-180" />
            </button>
            <span className="text-xs tracking-[0.15em] text-[#5C564E] uppercase">
              {t('page', { page, total: totalPages })}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="inline-flex size-11 items-center justify-center border border-[#E6DFD5] bg-white text-charcoal transition-colors hover:border-charcoal disabled:opacity-40"
              aria-label={t('next')}
            >
              <ChevronRight className="size-4 rtl:rotate-180" />
            </button>
          </nav>
        ) : null}
      </div>
    </section>
  )
}
