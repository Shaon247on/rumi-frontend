'use client'

import type { AiAnalytics } from '@/api/query-list/admin/dashboard-query'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useState } from 'react'

export const TrendAndFrequency = ({ products }: { products: AiAnalytics['products'] }) => {
  const [search, setSearch] = useState('')
  const query = search.trim().toLowerCase()
  const visibleProducts = products.filter((item) => item.product_name.toLowerCase().includes(query))

  return (
    <div className="rounded-xl bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-dashboard text-xl font-semibold">Trend & Frequency</h2>
        <div className="w-48">
          <InputGroup className="border-gray-200 bg-gray-50">
            <InputGroupAddon>
              <Search className="size-4 text-gray-500" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search products..."
              aria-label="Search products"
              className="bg-transparent text-sm placeholder:text-gray-500"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 border-b border-gray-100 pb-3">
        <div className="text-dashboard/80 text-sm font-medium">Product</div>
        <div className="text-dashboard/80 text-sm font-medium">Category</div>
        <div className="text-dashboard/80 text-sm font-medium">AI Recommendations</div>
        <div className="text-dashboard/80 text-right text-sm font-medium">Trend</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {visibleProducts.map((item) => (
          <div key={item.id} className="grid grid-cols-4 py-4">
            <div>
              <p className="text-dashboard text-sm font-medium">{item.product_name}</p>
              {item.top_for ? (
                <p className="text-dashboard/80 text-xs">Top for: {item.top_for}</p>
              ) : null}
            </div>
            <div className="flex items-center">
              <span className="text-dashboard/80 text-sm">{item.category}</span>
            </div>
            <div className="flex items-center">
              <span className="text-dashboard text-sm">{item.recommendations}</span>
            </div>
            <div className="flex items-center justify-end">
              <span
                className={cn(
                  'text-sm font-medium',
                  item.trend.startsWith('-') ? 'text-red-600' : 'text-green-700'
                )}
              >
                {item.trend}
              </span>
            </div>
          </div>
        ))}
        {visibleProducts.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            {products.length === 0 ? 'No recommendations yet.' : 'No products match your search.'}
          </p>
        ) : null}
      </div>
    </div>
  )
}
