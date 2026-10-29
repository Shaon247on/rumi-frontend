'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'

import { useRemoveCartItem, useUpdateCartItem } from '@/api/api-hooks/shop.api-hooks'
import { CartItem } from '@/api/query-list/shop.query'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import { Link } from '@/i18n/navigation'
import { formatSAR } from '@/lib/price'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

interface Props extends React.ComponentProps<'div'> {
  item: CartItem
}

export const CartsItems = ({ item }: Props) => {
  const t = useTranslations('shared.cartDrawer')
  const checkoutT = useTranslations('shared.checkoutItem')
  const locale = useLocale()
  const { mutateAsync: removeItem, isPending: isRemoving } = useRemoveCartItem()
  const { mutateAsync: updateItem, isPending: isUpdating } = useUpdateCartItem()
  const quantity = item.quantity ?? 1
  const stock = item.product?.stock
  const isBusy = isRemoving || isUpdating || !item.id
  const productId = item.product?.id ?? item.product_id

  const changeQuantity = (next: number) => {
    if (!item.id || next < 1) return
    void updateItem({ itemId: item.id, data: { quantity: next } }).catch(() => undefined)
  }

  return (
    <article className="flex items-start gap-3 rounded-2xl border border-[#e5e0d9] bg-white p-3">
      <Link
        href={`/products/${productId}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-ivory"
      >
        <Image
          src={item.product?.images?.[0]?.image || productFallbackImage}
          alt={item.product?.title || t('fallbackProduct')}
          fill
          sizes="64px"
          className="object-contain p-1.5"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${productId}`}
            className="line-clamp-2 text-sm leading-5 font-medium text-charcoal hover:underline"
          >
            {item.product?.title || t('fallbackProduct')}
          </Link>
          <span className="shrink-0 text-sm font-medium text-charcoal">
            {formatSAR(item.subtotal ?? 0, locale)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center rounded-full border border-[#e5dfd5] bg-ivory">
            <button
              type="button"
              aria-label="-"
              disabled={isBusy || quantity <= 1}
              onClick={() => changeQuantity(quantity - 1)}
              className="flex size-7 items-center justify-center text-[#68706a] disabled:opacity-40"
            >
              <Minus className="size-3" />
            </button>
            <span className="min-w-6 text-center text-xs font-medium text-charcoal">{quantity}</span>
            <button
              type="button"
              aria-label="+"
              disabled={isBusy || (stock !== undefined && quantity >= stock)}
              onClick={() => changeQuantity(quantity + 1)}
              className="flex size-7 items-center justify-center text-[#68706a] disabled:opacity-40"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <button
            type="button"
            disabled={isBusy}
            aria-label={checkoutT('remove')}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-[#68706a] transition-colors hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              if (!item.id) return
              void removeItem(item.id).catch(() => undefined)
            }}
          >
            <Trash2 className="size-3.5" />
            <span>{checkoutT('remove')}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
