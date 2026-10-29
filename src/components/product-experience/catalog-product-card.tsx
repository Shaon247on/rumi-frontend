'use client'

import type { Product } from '@/api/query-list/product.query'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import { useAddToBag } from '@/hooks/use-add-to-bag'
import { Link } from '@/i18n/navigation'
import { formatSAR, getProductPricing } from '@/lib/price'
import { cn } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'

export const CatalogProductCard = ({ product }: { product: Product }) => {
  const t = useTranslations('productsPage.catalog')
  const locale = useLocale()
  const isAR = locale === 'ar'
  const { addToBag, isAdding } = useAddToBag()
  const { basePrice, finalPrice, hasDiscount } = getProductPricing(product)
  const isOutOfStock = (product.stock ?? 0) <= 0
  const href = `/products/${product.id}`

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={href}
        className="relative block aspect-4/5 overflow-hidden border-[0.5px] border-[#E6DFD5] bg-white"
      >
        <Image
          src={product.images?.[0]?.image || productFallbackImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-[1.03]"
        />
        {product.category_name ? (
          <span className="absolute start-3 top-3 bg-ivory/90 px-2.5 py-1 text-[10px] tracking-[0.2em] text-[#8C8275] uppercase">
            {product.category_name}
          </span>
        ) : null}
        {isOutOfStock ? (
          <span className="absolute end-3 top-3 bg-charcoal px-2.5 py-1 text-[10px] tracking-[0.15em] text-ivory uppercase">
            {t('outOfStock')}
          </span>
        ) : null}
      </Link>

      <div className="mt-4 flex grow flex-col">
        <Link href={href} className="block">
          <h3
            className="line-clamp-2 text-xl leading-tight font-light text-[#1A1918]"
            style={{
              fontFamily: isAR ? 'var(--font-amiri), serif' : 'var(--font-cormorant-garamond), serif',
            }}
          >
            {product.title}
          </h3>
          {product.sub_title ? (
            <p className="mt-1 line-clamp-1 text-xs text-[#8C8275]">{product.sub_title}</p>
          ) : null}
        </Link>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-sm font-medium text-[#1A1918]">{formatSAR(finalPrice, locale)}</span>
          {hasDiscount ? (
            <span className="text-xs text-[#A39B90] line-through">
              {formatSAR(basePrice, locale)}
            </span>
          ) : null}
          {product.size ? <span className="ms-auto text-xs text-[#A39B90]">{product.size}</span> : null}
        </div>

        <button
          type="button"
          disabled={isOutOfStock || isAdding}
          onClick={() => void addToBag(product.id)}
          className={cn(
            'mt-4 h-11 w-full border text-[11px] font-medium transition-colors duration-150 disabled:cursor-not-allowed',
            !isAR && 'tracking-[0.15em] uppercase',
            isOutOfStock
              ? 'border-[#E6DFD5] text-[#A39B90]'
              : 'border-charcoal text-charcoal hover:bg-charcoal hover:text-white disabled:opacity-60'
          )}
        >
          {isOutOfStock ? t('outOfStock') : t('addToBag')}
        </button>
      </div>
    </article>
  )
}
