'use client'

import { useProduct } from '@/api/api-hooks/product.api-hook'
import type { Order, OrderItem } from '@/api/query-list/order.query'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { CalendarDays } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

type TranslationFn = ReturnType<typeof useTranslations>

const ORDER_STATUS_STYLES: Record<string, string> = {
  cancelled: 'border-zinc-500/20 bg-zinc-500/10 text-zinc-700 dark:text-zinc-200',
  delivered: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
  failed: 'border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-200',
  paid: 'border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-200',
  pending: 'border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-200',
  shipped: 'border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-200',
  default: 'border-main-button/20 bg-main-button/10 text-main-button',
}

const getOrderItems = (order: Order) => (Array.isArray(order.items) ? order.items : [])

const formatDate = (value: string | undefined, locale: string, fallback: string) => {
  if (!value) {
    return fallback
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const formatAmount = (value: string | undefined, locale: string, fallback: string) => {
  if (!value) {
    return fallback
  }

  const amount = Number.parseFloat(value)

  if (Number.isNaN(amount)) {
    return fallback
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SAR',
  }).format(amount)
}

const prettifyStatus = (status: string) =>
  status.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase())

const getOrderStatusLabel = (status: string | undefined, t: TranslationFn) => {
  const normalizedStatus = (status ?? '').toLowerCase()

  switch (normalizedStatus) {
    case 'pending':
      return t('statuses.pending')
    case 'paid':
      return t('statuses.paid')
    case 'failed':
      return t('statuses.failed')
    case 'shipped':
      return t('statuses.shipped')
    case 'delivered':
      return t('statuses.delivered')
    case 'cancelled':
      return t('statuses.cancelled')
    default:
      return normalizedStatus ? prettifyStatus(normalizedStatus) : t('statusUnavailable')
  }
}

const getOrderStatusClassName = (status: string | undefined) => {
  const normalizedStatus = (status ?? '').toLowerCase()

  return ORDER_STATUS_STYLES[normalizedStatus] ?? ORDER_STATUS_STYLES.default
}

const getItemLabel = (item: OrderItem, index: number, t: TranslationFn) =>
  item.product_name || t('itemFallback', { index: index + 1 })

const getTimeline = (order: Order, t: TranslationFn, locale: string) => {
  const status = (order.status ?? '').toLowerCase()
  const placedLabel = formatDate(order.created_at, locale, t('dateUnavailable'))
  const isShippedOrLater = ['shipped', 'delivered'].includes(status)
  const isDelivered = status === 'delivered'

  return [
    {
      active: true,
      date: placedLabel,
      title: t('timeline.orderPlaced'),
    },
    {
      active: ['paid', 'shipped', 'delivered'].includes(status),
      date: isShippedOrLater ? t('statuses.shipped') : t('timeline.awaitingUpdate'),
      title: t('timeline.shipped'),
    },
    {
      active: isShippedOrLater,
      date: isDelivered ? t('statuses.delivered') : t('timeline.awaitingUpdate'),
      title: t('timeline.delivered'),
    },
  ]
}

const OrderStatusBadge = ({ status, t }: { status: string | undefined; t: TranslationFn }) => {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-6 border-transparent px-2 text-[10px] font-medium',
        getOrderStatusClassName(status)
      )}
    >
      {getOrderStatusLabel(status, t)}
    </Badge>
  )
}

const OrderTimeline = ({
  locale,
  order,
  t,
}: {
  locale: string
  order: Order
  t: TranslationFn
}) => {
  const timeline = getTimeline(order, t, locale)

  return (
    <div className="flex h-full flex-col justify-between rounded-[28px] border border-[#ece7df] bg-[#F5F6F5] p-5 lg:p-6">
      <div className="relative pl-6">
        <div className="bg-main-button/20 absolute top-3 bottom-3 left-2 w-px" />

        <div className="space-y-8">
          {timeline.map((step, index) => (
            <div key={step.title} className="relative">
              <div
                className={cn(
                  'absolute top-1.5 -left-4.5 size-4 rounded-full border-[3px] border-[#f3f2ee]',
                  step.active ? 'bg-[#30322d]' : 'bg-[#a1a1b0]'
                )}
              />

              <div className="space-y-0.5">
                <p className="text-main-button text-[15px] leading-none font-medium">
                  {step.title}
                </p>
                <p className="text-main-button/60 text-[11px] leading-none">{step.date}</p>
                {index === 0 ? (
                  <p className="text-main-button/40 pt-1 text-[10px] tracking-[0.16em] uppercase">
                    {t('timeline.startingPoint')}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const OrderSummary = ({ locale, order, t }: { locale: string; order: Order; t: TranslationFn }) => {
  const items = getOrderItems(order)
  const featuredItem = items[0]
  const featuredProductId = featuredItem?.product
  const { data: product } = useProduct(featuredProductId)

  const productTitle =
    product?.title?.trim() || featuredItem?.product_name || t('itemFallback', { index: 1 })
  const productImage = product?.images?.[0]?.image || productFallbackImage
  const orderTotal = formatAmount(order.total_amount, locale, t('amountUnavailable'))
  const featuredPrice = formatAmount(featuredItem?.price, locale, t('amountUnavailable'))
  const locationLine = [order.address_line1, order.city, order.country].filter(Boolean).join(', ')
  const moreItems = Math.max(0, items.length - 1)

  return (
    <div className="rounded-[28px] border border-[#ece7df] bg-[#F5F6F5] p-5 lg:p-6">
      <div className="border-main-button/25 border-t pt-5" />

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-1">
            <p className="text-main-button/55 text-[11px] tracking-[0.18em] uppercase">
              #{String(order.id ?? '---')}
            </p>
            <h3 className="text-main-button text-[20px] leading-tight font-semibold">
              {productTitle}
            </h3>
          </div>

          <OrderStatusBadge status={order.status} t={t} />
        </div>

        <div className="grid gap-4 md:grid-cols-[96px_minmax(0,1fr)] md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F5F6F5] shadow-[inset_0_0_0_1px_rgba(26,46,26,0.06)]">
            <Image
              src={productImage}
              alt={productTitle}
              fill
              sizes="96px"
              className="object-contain p-4"
            />
          </div>

          <div className="space-y-2">
            <p className="text-main-button/85 text-[18px] font-medium">{featuredPrice}</p>
            <p className="text-main-button/70 text-sm leading-5">{locationLine}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full border border-[#d8d1c8] px-3 py-1 text-[11px] text-[#5f655c]">
                {t('itemCount', { count: items.length })}
              </span>
              {moreItems > 0 ? (
                <span className="rounded-full border border-[#d8d1c8] px-3 py-1 text-[11px] text-[#5f655c]">
                  +{moreItems} {t('items')}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-main-button/20 border-t pt-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-main-button/55 text-[11px] tracking-[0.18em] uppercase">
              {t('total')}
            </p>
            <p className="text-main-button text-[18px] font-semibold">{orderTotal}</p>
          </div>

          <div className="text-main-button/60 mt-2 flex items-center gap-2 text-xs">
            <CalendarDays className="size-3.5" />
            <span>{formatDate(order.created_at, locale, t('dateUnavailable'))}</span>
          </div>

          {moreItems > 0 ? (
            <div className="mt-3 space-y-2">
              {items.slice(1).map((item, index) => {
                const itemLabel = getItemLabel(item, index + 1, t)
                return (
                  <div
                    key={item.id ?? `${itemLabel}-${index}`}
                    className="flex items-center justify-between rounded-2xl bg-[#F5F6F5]/50 px-3 py-2"
                  >
                    <p className="text-main-button/80 truncate text-sm">{itemLabel}</p>
                    <p className="text-main-button/60 text-xs">
                      x{item.quantity} {formatAmount(item.price, locale, t('amountUnavailable'))}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export const OrderCard = ({
  locale,
  order,
  t,
}: {
  locale: string
  order: Order
  t: TranslationFn
}) => {
  return (
    <Card className="border-0 bg-transparent shadow-none">
      <CardContent>
        <div className="grid gap-5 xl:grid-cols-[240px_minmax(0,1fr)] xl:gap-6">
          <OrderTimeline locale={locale} order={order} t={t} />
          <OrderSummary locale={locale} order={order} t={t} />
        </div>
      </CardContent>
    </Card>
  )
}
