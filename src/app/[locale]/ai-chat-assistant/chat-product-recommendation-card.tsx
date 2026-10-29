'use client'

import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import type { ChatProductRecommendation } from '@/components/socket'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export const ChatProductRecommendationCard = ({
  product,
}: {
  product: ChatProductRecommendation
}) => {
  const t = useTranslations('aiChatAssistant')
  const href = product.id ? `/products/${product.id}` : product.href || '/products'

  return (
    <Link
      href={href}
      className="group flex w-full max-w-sm items-center gap-4 rounded-2xl border border-[#E6DFD5] bg-ivory p-3 transition-colors hover:border-[#1C1C1A]/30"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-white">
        <Image
          src={product.image || productFallbackImage}
          alt={product.name}
          fill
          sizes="64px"
          className="object-contain p-1.5"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="line-clamp-2 text-sm font-medium text-[#1C1C1A]">{product.name}</h4>
        {product.price ? <p className="mt-1 text-xs text-[#5C564E]">{product.price}</p> : null}
        <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#1C1C1A]">
          {t('product.viewDetails')}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180" />
        </span>
      </div>
    </Link>
  )
}
