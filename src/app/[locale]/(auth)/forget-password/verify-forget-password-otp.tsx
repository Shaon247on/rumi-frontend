'use client'

import { useVerifyForgetPasswordOtp } from '@/api/api-hooks/forget-password.api-hook'
import { Button } from '@/components/ui'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  email: string
  onSuccess: () => void
}

export const VerifyForgetPasswordOtp = ({ email, onSuccess }: Props) => {
  const t = useTranslations('auth.verifyOtp')

  const verifyOtpSchema = z.object({
    otp: z.string().min(6, t('validation.otpRequired')).max(6),
  })

  type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: '' },
  })

  const { mutateAsync: verifyOtp } = useVerifyForgetPasswordOtp()

  const onSubmit = async (data: VerifyOtpFormData) => {
    await verifyOtp({ email, otp: data.otp })
    onSuccess()
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="auth-heading">{t('title')}</h1>
        <p className="auth-subheading">{t('subtitle')}</p>
        <p className="auth-subheading">{t('subtitleContinue')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                value={field.value}
                onChange={field.onChange}
                aria-label={t('enterPin')}
                aria-invalid={!!errors.otp}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="size-12 text-lg" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.otp && <p className="text-destructive text-sm">{errors.otp.message}</p>}
        </div>

        <Button type="submit" className="auth-action-btn" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submitButton')}
        </Button>
      </form>
    </>
  )
}
