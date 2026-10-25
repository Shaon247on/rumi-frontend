'use client'

import { useInitiateCheckout } from '@/api/api-hooks/shop.api-hooks'
import type { CheckoutInitiateRequestData, CheckoutPaymentBrand } from '@/api/query-list/shop.query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CheckoutField } from './checkout-field'

type TranslationFn = ReturnType<typeof useTranslations>

const PAYMENT_BRAND_VALUES = [
  'VISA',
  'MASTER',
  'MADA',
  'APPLEPAY',
  'TABBY',
  'TAMARA',
  'COD',
] as const satisfies readonly CheckoutPaymentBrand[]

const createCheckoutSchema = (t: TranslationFn) =>
  z.object({
    payment_brand: z.enum(PAYMENT_BRAND_VALUES),
    full_name: z.string().trim().min(1, t('checkout.validation.fullNameRequired')),
    phone: z
      .string()
      .trim()
      .min(1, t('checkout.validation.phoneRequired'))
      .regex(/^\+?[0-9()\-\s]{7,20}$/, t('checkout.validation.phoneInvalid')),
    address_line1: z.string().trim().min(1, t('checkout.validation.addressLine1Required')),
    address_line2: z.string().trim().optional(),
    city: z.string().trim().min(1, t('checkout.validation.cityRequired')),
    state: z.string().trim().optional(),
    postal_code: z.string().trim().min(1, t('checkout.validation.postalCodeRequired')),
    country: z.string().trim().min(1, t('checkout.validation.countryRequired')),
  })

type CheckoutFormValues = z.infer<ReturnType<typeof createCheckoutSchema>>

type CheckoutFormViewProps = {
  onBack: () => void
}

export const CheckoutFormView = ({ onBack }: CheckoutFormViewProps) => {
  const t = useTranslations('profile.myCart')
  const checkoutT = useTranslations('profile.myCart.checkout')
  const { mutateAsync: initiateCheckout, isPending } = useInitiateCheckout()
  const checkoutSchema = useMemo(() => createCheckoutSchema(t), [t])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment_brand: 'COD',
      full_name: '',
      phone: '',
      address_line1: '',
      address_line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'SA',
    },
  })

  const onSubmit = async (values: CheckoutFormValues) => {
    const payload: CheckoutInitiateRequestData = {
      payment_brand: values.payment_brand,
      full_name: values.full_name.trim(),
      phone: values.phone.trim(),
      address_line1: values.address_line1.trim(),
      address_line2: values.address_line2?.trim() || undefined,
      city: values.city.trim(),
      state: values.state?.trim() || undefined,
      postal_code: values.postal_code.trim(),
      country: values.country.trim() || 'SA',
    }

    await initiateCheckout(payload)
    reset()
  }

  const busy = isSubmitting || isPending

  return (
    <Card className="border-main-button/20 bg-brand-shade-10">
      <CardContent className="space-y-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-main-primary-base_medium text-xl font-bold">
              {checkoutT('title')}
            </h2>
            <p className="text-main-button/70 text-sm">{checkoutT('subtitle')}</p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="border-main-button text-main-button rounded-full px-4 py-2"
            onClick={onBack}
          >
            {checkoutT('backToCart')}
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <CheckoutField
            id="payment_brand"
            label={checkoutT('paymentBrand')}
            error={errors.payment_brand?.message}
            {...register('payment_brand')}
            value={'Cash on Delivery'}
            disabled
          />

          <div className="grid gap-4 md:grid-cols-2">
            <CheckoutField
              id="full_name"
              label={checkoutT('fullName')}
              placeholder={checkoutT('fullNamePlaceholder')}
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <CheckoutField
              id="phone"
              label={checkoutT('phone')}
              placeholder={checkoutT('phonePlaceholder')}
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>

          <CheckoutField
            id="address_line1"
            label={checkoutT('addressLine1')}
            placeholder={checkoutT('addressLine1Placeholder')}
            error={errors.address_line1?.message}
            {...register('address_line1')}
          />

          <CheckoutField
            id="address_line2"
            label={checkoutT('addressLine2')}
            placeholder={checkoutT('addressLine2Placeholder')}
            error={errors.address_line2?.message}
            {...register('address_line2')}
          />

          <div className="grid gap-4 md:grid-cols-3">
            <CheckoutField
              id="city"
              label={checkoutT('city')}
              placeholder={checkoutT('cityPlaceholder')}
              error={errors.city?.message}
              {...register('city')}
            />
            <CheckoutField
              id="state"
              label={checkoutT('state')}
              placeholder={checkoutT('statePlaceholder')}
              error={errors.state?.message}
              {...register('state')}
            />
            <CheckoutField
              id="postal_code"
              label={checkoutT('postalCode')}
              placeholder={checkoutT('postalCodePlaceholder')}
              error={errors.postal_code?.message}
              {...register('postal_code')}
            />
          </div>

          <CheckoutField
            id="country"
            label={checkoutT('country')}
            placeholder={checkoutT('countryPlaceholder')}
            helperText={checkoutT('countryHint')}
            error={errors.country?.message}
            {...register('country')}
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              type="submit"
              className="bg-main-button text-background w-full rounded-full px-5 py-6 text-base font-medium sm:flex-1"
              disabled={busy}
            >
              {busy ? checkoutT('submitting') : checkoutT('submitButton')}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-main-button text-main-button w-full rounded-full px-5 py-6 sm:w-auto"
              onClick={onBack}
            >
              {checkoutT('backToCart')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
