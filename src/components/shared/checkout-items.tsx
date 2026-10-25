'use client'

import productImage from '@/assets/image/serum-drop-product.jpg'
import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export const CheckoutItems = () => {
  const t = useTranslations('shared.checkoutItem')

  return (
    <div className="flex items-start gap-10 border-b border-gray-200 py-6">
      <div className="flex">
        {/* Product Image */}
        <div className="relative size-32! shrink-0 overflow-hidden rounded-lg">
          <Image src={productImage} alt={t('productName')} fill className="object-contain p-2" />
        </div>
        {/* Product Info */}
        <div className="text-main-button flex-1">
          <h3 className="text-xl font-bold">{t('productName')}</h3>
          <p className="mt-1 text-xl font-semibold">{t('price')}</p>
          <button type="button" className="mt-2 text-sm">
            {t('remove')}
          </button>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="bg-main-button flex items-center gap-2 rounded-md border border-gray-300">
        <button type="button" className="p-2 hover:bg-gray-100">
          <Minus className="size-4 text-white" />
        </button>
        <span className="w-6 text-center text-sm text-white">1</span>
        <button type="button" className="p-2 hover:bg-gray-100">
          <Plus className="size-4 text-white" />
        </button>
      </div>
    </div>
  )
}
