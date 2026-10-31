'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import { Filter, Search } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useDeferredValue, useState } from 'react'

export const TABLE_PAGE_SIZE = 10

/** Search text, filter and page for one table; changing a filter returns to page 1. */
export const useTableFilters = (defaultFilter = 'all') => {
  const [search, setSearchValue] = useState('')
  const [filter, setFilterValue] = useState(defaultFilter)
  const [page, setPage] = useState(1)
  const deferredSearch = useDeferredValue(search.trim())

  return {
    search,
    filter,
    page,
    setPage,
    deferredSearch,
    setSearch: (value: string) => {
      setSearchValue(value)
      setPage(1)
    },
    setFilter: (value: string) => {
      setFilterValue(value)
      setPage(1)
    },
  }
}

/** Row checkboxes. Selected rows are what EXPORT downloads. */
export const useRowSelection = <T extends string | number>(pageIds: T[]) => {
  const [selected, setSelected] = useState<T[]>([])
  const allSelected = pageIds.length > 0 && pageIds.every((id) => selected.includes(id))

  return {
    selected,
    isSelected: (id: T) => selected.includes(id),
    allSelected,
    toggle: (id: T) =>
      setSelected((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      ),
    toggleAll: () =>
      setSelected((current) =>
        allSelected
          ? current.filter((id) => !pageIds.includes(id))
          : [...new Set([...current, ...pageIds])]
      ),
  }
}

export const SelectCheckbox = ({
  checked,
  onToggle,
  label,
}: {
  checked: boolean
  onToggle: () => void
  label: string
}) => <Checkbox checked={checked} onCheckedChange={onToggle} aria-label={label} />

export const SearchBox = ({
  value,
  onChange,
  placeholder = 'Search here',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) => (
  <div className="w-full sm:w-72">
    <InputGroup className="border-white/30 bg-white/10">
      <InputGroupAddon>
        <Search className="size-4 text-white/60" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder={placeholder}
        aria-label={placeholder}
        className="bg-transparent text-white placeholder:text-white/60"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </InputGroup>
  </div>
)

export const FilterSelect = ({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) => (
  <Select
    items={options}
    value={value}
    onValueChange={(next) => {
      if (next) onChange(next)
    }}
  >
    <SelectTrigger
      className="w-44 border-white/30 bg-white/10 text-white [&_svg]:text-white"
      aria-label="Filter"
    >
      <Filter className="mr-2 size-4" />
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

const getVisiblePages = (page: number, total: number) => {
  const pages = new Set([1, total, page - 1, page, page + 1])
  return [...pages].filter((item) => item >= 1 && item <= total).sort((a, b) => a - b)
}

export const TablePagination = ({
  page,
  count,
  onPageChange,
  pageSize = TABLE_PAGE_SIZE,
}: {
  page: number
  count: number
  onPageChange: (page: number) => void
  pageSize?: number
}) => {
  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  const visiblePages = getVisiblePages(page, totalPages)

  const go = (event: MouseEvent, next: number) => {
    event.preventDefault()
    if (next >= 1 && next <= totalPages) onPageChange(next)
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      {totalPages > 1 ? (
        <Pagination className="mx-0 w-auto justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => go(event, page - 1)}
                aria-disabled={page <= 1}
                className="border-white/30 text-white aria-disabled:opacity-40"
              />
            </PaginationItem>
            {visiblePages.map((item, index) => (
              <PaginationItem key={item} className="flex items-center">
                {index > 0 && item - visiblePages[index - 1] > 1 ? (
                  <PaginationEllipsis className="text-white/60" />
                ) : null}
                <PaginationLink
                  href="#"
                  isActive={item === page}
                  onClick={(event) => go(event, item)}
                  className={
                    item === page ? 'bg-white text-dashboard' : 'border-white/30 text-white'
                  }
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => go(event, page + 1)}
                aria-disabled={page >= totalPages}
                className="border-white/30 text-white aria-disabled:opacity-40"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : (
        <span />
      )}
      <span className="text-sm text-white/60">
        {count} {count === 1 ? 'item' : 'items'}
      </span>
    </div>
  )
}

/** Loading, error and empty states for a table body. Renders nothing when rows exist. */
export const TableState = ({
  colSpan,
  isLoading,
  isError,
  isEmpty,
  emptyText,
  onRetry,
}: {
  colSpan: number
  isLoading: boolean
  isError: boolean
  isEmpty: boolean
  emptyText: string
  onRetry?: () => void
}) => {
  if (!isLoading && !isError && !isEmpty) return null

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-32 text-center">
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="border-t-dashboard size-8 animate-spin rounded-full border-4 border-gray-200" />
          </div>
        ) : isError ? (
          <div className="space-y-2">
            <p className="text-red-500">Could not load this data.</p>
            {onRetry ? (
              <button type="button" onClick={onRetry} className="text-dashboard text-sm underline">
                Try again
              </button>
            ) : null}
          </div>
        ) : (
          <p className="text-gray-500">{emptyText}</p>
        )}
      </TableCell>
    </TableRow>
  )
}
