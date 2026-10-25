'use client'

import { Package2, Trash2 } from 'lucide-react'

import { useRemoveCartItem } from '@/api/api-hooks/shop.api-hooks'
import { CartItem } from '@/api/query-list/shop.query'
import { useTranslations } from 'next-intl'
import React from 'react'

interface Props extends React.ComponentProps<'div'> {
  item: CartItem
}

export const CartsItems = ({ item }: Props) => {
  const t = useTranslations('shared.cartDrawer')
  const checkoutT = useTranslations('shared.checkoutItem')
  const { mutateAsync, isPending } = useRemoveCartItem()
  const isDisabled = isPending || !item.id

  return (
    <article className="group flex items-start gap-3 rounded-2xl border border-[#e5e0d9] bg-white px-3 py-3 shadow-[0_8px_30px_rgba(26,46,26,0.04)] transition-transform duration-200 hover:-translate-y-0.5">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#1a2e1a] via-[#2e4730] to-[#a7b399] text-white shadow-sm">
        <Package2 className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm leading-5 font-medium text-[#243224]">
            {item.product?.title || t('fallbackProduct')}
          </h3>
          <span className="shrink-0 rounded-full bg-[#f3efe9] px-2 py-1 text-[11px] font-medium text-[#546057]">
            x{item.quantity ?? 1}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-[#6b6f69]">
          <span>{t('itemSubtotal')}</span>
          <span className="font-medium text-[#1a2e1a]">{item.subtotal || '0.00'}</span>
        </div>

        <button
          type="button"
          disabled={isDisabled}
          aria-label={checkoutT('remove')}
          className="mt-3 inline-flex items-center gap-1 rounded-full border border-[#e5dfd5] bg-[#faf8f4] px-2.5 py-1 text-[11px] font-medium text-[#68706a] transition-colors hover:bg-[#f2ede4] disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (!item.id) return

            void mutateAsync(item.id)
          }}
        >
          <Trash2 className="size-3.5" />
          <span>{checkoutT('remove')}</span>
        </button>
      </div>
    </article>
  )
}
