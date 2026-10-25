import type { ProductDetails } from '@/api/query-list/product.query'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import { UseQueryResult } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { AddToCartWithIncrement } from './add-to-cart-with-increment'
import { ProductDetailsMessage } from './product-details-message'
import { ProductDetailsSkeleton } from './product-details-skeleton'

type Props = {
  productAction: UseQueryResult<ProductDetails, Error>
  normalizedProductId: string | undefined
}

const SingleProductDetails = ({ productAction, normalizedProductId }: Props) => {
  const t = useTranslations('productDetails')

  const { data: product, isLoading, isError, refetch, isFetching } = productAction

  if (!normalizedProductId) {
    return <ProductDetailsMessage title={t('empty.title')} description={t('empty.description')} />
  }

  if (isLoading) return <ProductDetailsSkeleton />

  if (isError) {
    return (
      <ProductDetailsMessage
        title={t('error.title')}
        description={t('error.description')}
        actionLabel={t('retry')}
        busyLabel={t('loading')}
        isBusy={isFetching}
        onAction={() => {
          void refetch()
        }}
      />
    )
  }

  if (!product) {
    return (
      <ProductDetailsMessage
        title={t('empty.title')}
        description={t('empty.description')}
        actionLabel={t('retry')}
        busyLabel={t('loading')}
        onAction={() => {
          void refetch()
        }}
      />
    )
  }

  return (
    <div className="bg-background min-h-screen px-6 py-12 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left - Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg">
          <Image
            src={product.images?.[0]?.image || productFallbackImage}
            alt={product.title?.trim() || '-'}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="aspect-square object-contain p-8"
          />
          {product.category_name?.trim() ? (
            <span className="bg-main-button absolute top-4 left-4 rounded-full px-3 py-1 text-xs text-white">
              {product.category_name.trim()}
            </span>
          ) : null}
        </div>

        {/* Right - Product Details */}
        <div>
          <h1 className="text-main-button text-4xl font-normal">{product.title?.trim() || '-'}</h1>
          <p className="text-main-button/70 mt-1 text-sm">{product.sub_title?.trim() || '-'}</p>

          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            <span className="text-main-button text-2xl font-medium">
              {product.price?.trim() || '-'}
            </span>
            <span className="text-main-button/60 text-sm">{product.size?.trim() || '-'}</span>
          </div>

          <AddToCartWithIncrement productId={product.id} />

          <div className="mt-8">
            <h3 className="text-main-button text-lg font-semibold">{t('description.title')}</h3>
            <div className="text-main-button/80 mt-2 space-y-4 text-sm leading-relaxed">
              {splitParagraphs(product.description).length > 0 ? (
                splitParagraphs(product.description).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))
              ) : (
                <p>{t('description.paragraph1')}</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-main-button text-lg font-semibold italic">{t('skinType.title')}</h3>
            <p className="text-main-button/80 mt-2 text-sm">{product.skin_type?.trim() || '-'}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-main-button text-lg font-semibold italic">
              {t('keyIngredients.title')}
            </h3>
            <p className="text-main-button/80 mt-2 text-sm">
              {product.key_ingredients?.trim() || '-'}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-main-button text-lg font-semibold italic">
              {t('keyBenefits.title')}
            </h3>
            <p className="text-main-button/80 mt-2 text-sm">
              {product.key_benefits?.trim() || '-'}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-main-button text-lg font-semibold italic">{t('howToUse.title')}</h3>
            <p className="text-main-button/80 mt-2 text-sm">{product.how_to_use?.trim() || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleProductDetails

// Utils related this this page
function splitParagraphs(text?: string | null) {
  if (!text) {
    return []
  }

  return text.split(/\n\s*\n/).flatMap((paragraph) => {
    const trimmed = paragraph.trim()
    return trimmed ? [trimmed] : []
  })
}
