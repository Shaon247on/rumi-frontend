import { SiteHeading } from '@/components/shared'
import { ProductCard } from '@/components/shared/product-card-main'
import { useTranslations } from 'next-intl'
import type { Product } from '../../../../../api/query-list/product.query'

type Props = {
  relatedProducts?: Product[]
}

export const RelatedProductsFromProductDetails = ({ relatedProducts }: Props) => {
  const t = useTranslations('productDetails')
  const items = Array.isArray(relatedProducts) ? relatedProducts : []

  if (items.length === 0) {
    return null
  }

  return (
    <div className="mx-auto mt-8 max-w-5xl px-6">
      <SiteHeading heading={t('relatedProducts')} showWave />

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} viewDetailsLabel={t('viewDetails')} />
        ))}
      </div>
    </div>
  )
}
