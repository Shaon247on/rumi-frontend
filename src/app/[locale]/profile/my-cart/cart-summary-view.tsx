'use client'

import type { CartItem } from '@/api/query-list/shop.query'
import { CartsItems } from '@/components/shared/new-nav/carts-items'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

type TranslationFn = ReturnType<typeof useTranslations>

type CartSummaryViewProps = {
  items: CartItem[]
  locale: string
  onContinue: () => void
  subtotal?: string
  t: TranslationFn
}

const formatCurrency = (value: string | undefined, locale: string) => {
  const amount = Number.parseFloat(value ?? '')

  if (Number.isNaN(amount)) {
    return null
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

export const CartSummaryView = ({
  items,
  locale,
  subtotal,
  onContinue,
  t,
}: CartSummaryViewProps) => {
  const itemCount = items.reduce((total, item) => total + (item.quantity ?? 1), 0)
  const subtotalAmount = formatCurrency(subtotal, locale)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
      <div className="space-y-3">
        {items.map((item, index) => (
          <CartsItems key={item.id ?? `${item.product_id}-${index}`} item={item} />
        ))}
      </div>

      <Card className="border-main-button/20 bg-brand-shade-10">
        <CardContent className="space-y-5 p-6">
          <div className="space-y-2">
            <p className="text-main-button/50 text-[11px] tracking-[0.18em] uppercase">
              {t('summary')}
            </p>
            <div className="flex items-center justify-between gap-4">
              <span className="text-main-button text-sm">{t('items')}</span>
              <span className="text-main-button text-sm font-medium">
                {t('itemCount', { count: itemCount })}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-main-button text-sm">{t('subtotal')}</span>
              <span className="text-main-button text-lg font-semibold">
                {subtotalAmount ?? t('amountUnavailable')}
              </span>
            </div>
          </div>

          <Button
            type="button"
            className="bg-main-button text-background w-full rounded-full px-5 py-6 text-base font-medium"
            onClick={onContinue}
          >
            {t('continueToCheckout')}
          </Button>

          <Link
            href="/products"
            className="border-main-button text-main-button inline-flex w-full justify-center rounded-full border px-5 py-6 text-sm font-medium"
          >
            {t('browseProducts')}
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
