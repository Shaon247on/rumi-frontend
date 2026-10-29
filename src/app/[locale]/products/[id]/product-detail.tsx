'use client'

import { useProduct } from '@/api/api-hooks/product.api-hook'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import { CatalogProductCard } from '@/components/product-experience/catalog-product-card'
import { HeroClaims } from '@/components/product-experience/hero-claims'
import { ProductPurchase } from '@/components/product-experience/product-purchase'
import { Skeleton } from '@/components/ui/skeleton'
import { useAddToBag } from '@/hooks/use-add-to-bag'
import { Link } from '@/i18n/navigation'
import { formatSAR, getProductPricing } from '@/lib/price'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'

/** Split admin-entered text ("A, B, C" or one per line) into list items. */
const splitList = (value?: string | null) =>
  (value ?? '')
    .split(/\n|,|،|•/)
    .map((item) => item.replace(/^[-–\s]+/, '').trim())
    .filter(Boolean)

const splitParagraphs = (value?: string | null) =>
  (value ?? '')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

const DetailBlock = ({
  title,
  children,
  isAR,
}: {
  title: string
  children: React.ReactNode
  isAR: boolean
}) => (
  <div className="grid gap-4 border-t border-[#E6DFD5] py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12 md:py-14">
    <h2
      className="text-2xl font-light text-[#1A1918] md:text-3xl"
      style={{
        fontFamily: isAR ? 'var(--font-amiri), serif' : 'var(--font-cormorant-garamond), serif',
      }}
    >
      {title}
    </h2>
    <div className="text-sm leading-relaxed text-[#5C564E] md:text-base">{children}</div>
  </div>
)

export const ProductDetail = ({ productId }: { productId: string }) => {
  const t = useTranslations('productsPage.detail')
  const catalogT = useTranslations('productsPage.catalog')
  const locale = useLocale()
  const isAR = locale === 'ar'
  const { data: product, isLoading, isError, refetch } = useProduct(productId)
  const { addToBag } = useAddToBag()

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-32 pb-24 sm:px-6 md:pt-40 lg:flex-row lg:px-24">
        <Skeleton className="aspect-4/5 w-full flex-1 rounded-none bg-[#EFEAE2]" />
        <div className="w-full max-w-lg flex-1 space-y-4">
          <Skeleton className="h-4 w-24 bg-[#EFEAE2]" />
          <Skeleton className="h-12 w-3/4 bg-[#EFEAE2]" />
          <Skeleton className="h-5 w-1/2 bg-[#EFEAE2]" />
          <Skeleton className="h-14 w-full bg-[#EFEAE2]" />
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-xl px-6 pt-40 pb-32 text-center">
        <h1 className="text-2xl font-light text-[#1A1918]">
          {isError ? t('error') : t('notFoundTitle')}
        </h1>
        {!isError ? <p className="mt-3 text-sm text-[#5C564E]">{t('notFoundDescription')}</p> : null}
        <div className="mt-8 flex justify-center gap-3">
          {isError ? (
            <button
              type="button"
              onClick={() => void refetch()}
              className="border border-charcoal px-6 py-3 text-xs tracking-[0.2em] text-charcoal uppercase hover:bg-charcoal hover:text-white"
            >
              {catalogT('retry')}
            </button>
          ) : null}
          <Link
            href="/products"
            className="bg-charcoal px-6 py-3 text-xs tracking-[0.2em] text-ivory uppercase hover:bg-[#2C2A29]"
          >
            {t('backToCollection')}
          </Link>
        </div>
      </div>
    )
  }

  const { basePrice, finalPrice, hasDiscount, discountPercent } = getProductPricing(product)
  const images = product.images?.map((image) => image.image).filter(Boolean) ?? []
  const benefits = splitList(product.key_benefits)
  const ingredients = splitList(product.key_ingredients)
  const description = splitParagraphs(product.description)
  const howToUse = splitParagraphs(product.how_to_use)
  const related = product.related_products ?? []
  const skinTypeLabel = product.skin_type
    ? catalogT.has(`skinTypes.${product.skin_type}`)
      ? catalogT(`skinTypes.${product.skin_type}`)
      : product.skin_type
    : null

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-28 sm:px-6 md:pt-32 lg:px-24">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs tracking-[0.15em] text-[#8C8275] uppercase hover:text-charcoal"
        >
          <ArrowLeft className="size-3.5 rtl:rotate-180" />
          {t('backToCollection')}
        </Link>
      </div>

      <ProductPurchase
        title={product.title}
        volume={product.size ?? undefined}
        price={formatSAR(finalPrice, locale)}
        compareAtPrice={hasDiscount ? formatSAR(basePrice, locale) : undefined}
        tagline={product.sub_title ?? undefined}
        eyebrow={product.category_name ?? undefined}
        badge={hasDiscount ? t('save', { percent: Math.round(discountPercent) }) : undefined}
        quantityLabel={t('quantity')}
        addToBag={t('addToBag')}
        addingToBag={t('addingToBag')}
        addedToBag={t('addedToBag')}
        outOfStockLabel={t('outOfStock')}
        shippingNote={t('shippingNote')}
        testedNote={t('testedNote')}
        images={images.length > 0 ? images : [productFallbackImage]}
        stock={product.stock ?? 0}
        onAddToBag={(quantity) => addToBag(product.id, quantity)}
        isAR={isAR}
      />

      {benefits.length > 0 ? <HeroClaims claims={benefits.slice(0, 6)} isAR={isAR} /> : null}

      <section className={cn('bg-ivory px-4 py-12 sm:px-6 md:py-20 lg:px-24', isAR && 'font-arabic')}>
        <div className="mx-auto max-w-5xl">
          {description.length > 0 ? (
            <DetailBlock title={t('description')} isAR={isAR}>
              <div className="space-y-4">
                {description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </DetailBlock>
          ) : null}

          {ingredients.length > 0 ? (
            <DetailBlock title={t('ingredients')} isAR={isAR}>
              <ul className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="border border-[#E6DFD5] bg-white px-3 py-1.5 text-sm text-charcoal"
                  >
                    {ingredient}
                  </li>
                ))}
              </ul>
            </DetailBlock>
          ) : null}

          {howToUse.length > 0 ? (
            <DetailBlock title={t('howToUse')} isAR={isAR}>
              <div className="space-y-4">
                {howToUse.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </DetailBlock>
          ) : null}

          {skinTypeLabel ? (
            <DetailBlock title={t('skinType')} isAR={isAR}>
              <p className="capitalize">{skinTypeLabel}</p>
            </DetailBlock>
          ) : null}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="border-t border-[#E6DFD5] bg-ivory px-4 py-16 sm:px-6 md:py-24 lg:px-12">
          <div className="mx-auto max-w-7xl">
            <h2
              className="mb-10 text-center text-3xl font-light text-[#1A1918] md:text-4xl"
              style={{
                fontFamily: isAR ? 'var(--font-amiri), serif' : 'var(--font-cormorant-garamond), serif',
              }}
            >
              {t('related')}
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
              {related.slice(0, 4).map((item) => (
                <CatalogProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
