'use client'

import { useOrderHistory } from '@/api/api-hooks/order.api-hook'
import { Card, CardContent } from '@/components/ui/card'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { OrderCard } from './order-history-card'
import { OrderHistorySkeleton } from './order-history-skeleton'

const OrderHistory = () => {
  const t = useTranslations('profile.orderHistory')
  const locale = useLocale()
  const { data, error, isLoading, refetch } = useOrderHistory()

  const orders = useMemo(() => {
    const items = Array.isArray(data) ? data : []

    return [...items].sort((left, right) => {
      const leftTime = left.created_at ? new Date(left.created_at).getTime() : 0
      const rightTime = right.created_at ? new Date(right.created_at).getTime() : 0

      return rightTime - leftTime
    })
  }, [data])

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-main-primary-base_medium text-xl font-bold">{t('title')}</h2>
        <p className="text-main-button/70 text-sm">{t('subtitle')}</p>
      </div>

      {isLoading ? (
        <OrderHistorySkeleton />
      ) : error ? (
        <Card className="border-main-button/20 bg-[#F5F6F5]">
          <CardContent className="space-y-4 p-6 text-center">
            <p className="text-main-button text-sm">{t('error')}</p>
            <button
              type="button"
              className="bg-main-button text-background rounded-full px-5 py-2 text-sm font-medium"
              onClick={() => refetch()}
            >
              {t('retry')}
            </button>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="border-main-button/20 bg-brand-shade-10">
          <CardContent className="p-6 text-center">
            <p className="text-main-button text-sm">{t('empty')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            if (order.id === undefined || order.id === null) {
              return null
            }

            return <OrderCard key={String(order.id)} locale={locale} order={order} t={t} />
          })}
        </div>
      )}
    </div>
  )
}

export default OrderHistory
