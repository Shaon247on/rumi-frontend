import { NewFooter } from '@/components/shared/new-footer'
import { NewNav } from '@/components/shared/new-nav'
import { Suspense } from 'react'
import { ProductCatalog } from './product-catalog'

export default function ShopPage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-ivory">
      <NewNav />
      <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
        <ProductCatalog />
      </Suspense>
      <NewFooter />
    </main>
  )
}
