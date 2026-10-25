'use client'

import { useCart } from '@/api/api-hooks/shop.api-hooks'
import { buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { ArrowRight, LockKeyhole, ShoppingBag } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { CartsItems } from './carts-items'

export const ShowCardList = () => {
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const t = useTranslations('shared.cartDrawer')
  const user = useAuthStore((state) => state.user)
  const accessToken = useAuthStore((state) => state.token.accessToken)
  const isAuthenticated = Boolean(user && accessToken)
  const { data: cardList } = useCart(isAuthenticated)
  const items = cardList?.items ?? []
  const totalPrice = cardList?.total_price || '0.00'
  const itemCount = items.length

  const triggerCount = isAuthenticated && itemCount > 0 ? String(itemCount) : undefined

  return (
    <Sheet>
      <SheetTrigger
        className="relative inline-flex items-center justify-center text-[#363739] transition-colors"
        aria-label={t('trigger')}
      >
        <ShoppingBag className="size-4" strokeWidth={1.5} />
        {triggerCount ? (
          <span className="absolute -top-1 -right-1 inline-flex min-w-5 items-center justify-center rounded-full bg-[#1a2e1a] px-1.5 py-0.5 text-[10px] font-medium text-white">
            {triggerCount}
          </span>
        ) : null}
      </SheetTrigger>

      <SheetContent
        className={cn(
          'flex w-full flex-col gap-0 border-l border-[#e8e6e3] bg-[#f7f4ef] p-0 sm:max-w-md',
          isRTL && 'border-r border-l-0'
        )}
      >
        {isAuthenticated ? (
          <>
            <SheetHeader className="border-b border-black/5 px-5 py-4 text-start">
              <SheetTitle className="text-[1rem] font-semibold text-[#1a2e1a]">
                {t('title')}
              </SheetTitle>
              <SheetDescription className="text-xs text-[#5c605b]">
                {t('subtitle', { count: itemCount })}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item) => (
                    <CartsItems key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-[#d8d1c6] bg-[#fbfaf7] px-6 py-10 text-center">
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#1a2e1a]/8 text-[#1a2e1a]">
                    <ShoppingBag className="size-6" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1f2b1f]">{t('emptyTitle')}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#667067]">
                    {t('emptyDescription')}
                  </p>
                </div>
              )}
            </div>

            <SheetFooter className="border-t border-black/5 bg-white px-5 py-4">
              <div className="flex w-full items-center justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.2em] text-[#7a7d77] uppercase">
                    {t('totalLabel')}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#1a2e1a]">{totalPrice}</p>
                </div>

                <SheetClose
                  render={
                    <Link
                      href="/profile/my-cart"
                      className={buttonVariants({
                        size: 'sm',
                      })}
                    />
                  }
                >
                  <span>{t('viewCart')}</span>
                  <ArrowRight className={cn('size-4', isRTL && 'rotate-180')} />
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex h-full flex-col justify-between">
            <div className="px-5 py-4">
              <SheetHeader className="text-start">
                <SheetTitle className="text-[1rem] font-semibold text-[#1a2e1a]">
                  {t('loginTitle')}
                </SheetTitle>
                <SheetDescription className="mt-2 text-sm leading-6 text-[#61655f]">
                  {t('loginDescription')}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 rounded-3xl border border-[#e5dfd5] bg-white p-5 shadow-[0_12px_40px_rgba(26,46,26,0.06)]">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#1a2e1a] text-white">
                    <LockKeyhole className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-[#223022]">{t('loginCardTitle')}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#667067]">{t('loginCardBody')}</p>
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="border-t border-black/5 bg-white px-5 py-4">
              <SheetClose
                render={
                  <Link
                    href="/login"
                    className={buttonVariants({
                      size: 'sm',
                      className: 'w-full justify-between',
                    })}
                  />
                }
              >
                <span>{t('loginButton')}</span>
                <ArrowRight className={cn('size-4', isRTL && 'rotate-180')} />
              </SheetClose>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
