'use client'

import { useVerifyRegistration } from '@/api/api-hooks/auth.api-hook'
import { Logo } from '@/components/shared/logo'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useAuthStore } from '@/store/auth.store'
import { MembershipModalStep, useMembershipModalStore } from '@/store/membership-modal.store'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import { getApiErrorMessage } from '@/lib/api-error'
import { REGEXP_ONLY_DIGITS } from 'input-otp'
import { Loader2 } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

type VerifyOtpMemberProps = {
  setCurrentStep: (step: MembershipModalStep) => void
}

export const VerifyOtpMember = ({ setCurrentStep }: VerifyOtpMemberProps) => {
  const t = useTranslations('home.verifyOtpDialog')
  const locale = useLocale()
  const isArabic = locale === 'ar'

  const registeredEmail = useMembershipModalStore((s) => s.registeredEmail)
  const auth = useAuthStore()

  const otpSchema = z.object({
    otp: z.string().min(6, t('validation.otpRequired')),
  })

  type OtpFormData = z.infer<typeof otpSchema>

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  const { mutateAsync: verifyRegistration } = useVerifyRegistration()

  const onSubmit = async (data: OtpFormData) => {
    if (!registeredEmail) {
      toast.error('Email not found. Please register again.')
      setCurrentStep('create-account')
      return
    }

    try {
      const response = await verifyRegistration({ email: registeredEmail, otp: data.otp })
      const authData = response.data?.data

      if (authData) {
        auth.setUser(authData.user ?? null)
        auth.setToken({
          accessToken: authData.access,
          refreshToken: authData.refresh,
        })
      }

      setCurrentStep('welcome')
    } catch (error) {
      const message = getApiErrorMessage(
        error as AxiosError,
        'Verification failed. Please try again.'
      )
      toast.error(message)
    }
  }

  const handleResend = () => {
    // TODO: wire up resend OTP API when available
    toast.success(t('resendSuccess'))
  }

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`relative flex min-h-121 flex-col bg-white px-6 pt-14 pb-12 sm:px-12 sm:pt-16 sm:pb-14 ${
        isArabic ? 'items-end text-right' : 'items-center text-center'
      }`}
    >
      {/* Subtle luxury background accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% 0%, #1a2e1a 0%, transparent 70%)',
        }}
      />

      <div
        className={`relative flex w-full max-w-190 flex-col gap-8 ${isArabic ? 'items-end' : 'items-center'}`}
      >
        {/* Logo */}
        <Logo className="h-14 w-14 animate-spin" style={{ animationDuration: '20s' }} />

        {/* Heading */}
        <div className={`flex flex-col gap-3 ${isArabic ? 'items-end' : 'items-center'}`}>
          <h2 className="text-primary text-3xl font-semibold sm:text-4xl">{t('title')}</h2>

          {registeredEmail && (
            <p className="text-primary/60 max-w-sm text-sm leading-relaxed sm:text-base">
              {t('subtitle')}
              <br />
              <span className="text-primary font-medium">{registeredEmail}</span>
            </p>
          )}

          {!registeredEmail && (
            <p className="text-primary/60 max-w-sm text-sm leading-relaxed sm:text-base">
              {t('subtitle')}
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <span className="bg-primary/20 h-px w-20 sm:w-28" />
          <span className="bg-primary/30 h-1.5 w-1.5 rounded-full" />
          <span className="bg-primary/20 h-px w-20 sm:w-28" />
        </div>

        {/* OTP Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex w-full flex-col gap-8 ${isArabic ? 'items-end' : 'items-center'}`}
        >
          {/* OTP Input */}
          <div className={`flex flex-col gap-3 ${isArabic ? 'items-end' : 'items-center'}`}>
            <Controller
              name="otp"
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={field.value}
                  onChange={field.onChange}
                  dir="ltr"
                >
                  <InputOTPGroup className="gap-2 sm:gap-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="text-primary size-11 rounded-full border border-black/10 bg-[#f5f4f3] text-base font-semibold shadow-none ring-0 transition-all focus:border-black/30 sm:size-13 sm:text-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            {errors.otp && (
              <p className="text-sm text-red-600" role="alert">
                {errors.otp.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary mx-auto flex h-9.5 w-64 cursor-pointer items-center justify-center rounded-full px-5 py-2 text-sm text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : t('cta')}
          </button>

          {/* Resend */}
          <p className="text-primary/50 text-sm">
            <button
              type="button"
              onClick={handleResend}
              onKeyUp={(e) => e.key === 'Enter' && handleResend()}
              className="text-primary cursor-pointer font-medium underline-offset-4 transition-all hover:underline focus:outline-none"
            >
              {t('resend')}
            </button>
          </p>
        </form>

        {/* Bottom brand divider */}
        <div className="mt-2 flex items-center gap-4">
          <span className="bg-primary h-px w-28 sm:w-36" />
          <span className="bg-primary h-2.5 w-2.5 rounded-full" />
          <span className="bg-primary h-px w-28 sm:w-36" />
        </div>
      </div>
    </div>
  )
}
