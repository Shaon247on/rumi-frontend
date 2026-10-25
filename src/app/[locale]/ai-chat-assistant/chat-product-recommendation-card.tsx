'use client'

import { Button } from '@/components/ui/button'
import type { ChatMessage } from '@/components/socket'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export const ChatProductRecommendationCard = ({
  product,
}: {
  product: NonNullable<ChatMessage['product']>
}) => {
  const t = useTranslations('aiChatAssistant')

  return (
    <div className="mt-4 max-w-60 overflow-hidden rounded-2xl bg-white text-[#363739]">
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          width={320}
          height={180}
          className="h-36 w-full object-cover"
        />
      ) : null}

      <div className="p-3">
        <h4 className="text-sm font-semibold">{product.name}</h4>
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="text-xs">{product.brand || 'Glowmi'}</span>
          {product.price ? <span className="text-sm font-semibold">{product.price}</span> : null}
        </div>
        <Button type="button" className="mt-3 w-full !rounded-lg">
          {t('product.viewDetails')}
        </Button>
      </div>
    </div>
  )
}
