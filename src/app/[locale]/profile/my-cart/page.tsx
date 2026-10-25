'use client'

import { useCart } from '@/api/api-hooks/shop.api-hooks'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { CheckoutFormView } from './checkout-form-view'
import { CartStatusCard } from './cart-status-card'
import { CartSummaryView } from './cart-summary-view'
import { MyCartSkeleton } from './my-cart-skeleton'

const MyCart = () => {
  const t = useTranslations('profile.myCart')
  const locale = useLocale()
  const { data: cart, error, isLoading, refetch } = useCart(true)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const items = Array.isArray(cart?.items) ? cart.items : []
  const subtotal = cart?.total_price

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-main-primary-base_medium text-xl font-bold">{t('title')}</h2>
        <p className="text-main-button/70 text-sm">{t('subtitle')}</p>
      </div>

      {isLoading ? (
        <MyCartSkeleton />
      ) : error ? (
        <CartStatusCard title={t('error')} actionLabel={t('retry')} onAction={() => refetch()} />
      ) : items.length === 0 ? (
        <CartStatusCard
          title={t('empty')}
          actionHref="/products"
          actionLabel={t('browseProducts')}
        />
      ) : isCheckoutOpen ? (
        <CheckoutFormView onBack={() => setIsCheckoutOpen(false)} />
      ) : (
        <CartSummaryView
          items={items}
          locale={locale}
          subtotal={subtotal}
          onContinue={() => setIsCheckoutOpen(true)}
          t={t}
        />
      )}
    </div>
  )
}

export default MyCart
