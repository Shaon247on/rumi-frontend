import { NewFooter } from '@/components/shared/new-footer'
import { NewNav } from '@/components/shared/new-nav'
import { ProductDetail } from './product-detail'

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-ivory">
      <NewNav />
      <ProductDetail productId={id} />
      <NewFooter />
    </main>
  )
}
