'use client'

import { useSendForgetPasswordOtp } from '@/api/api-hooks/forget-password.api-hook'
import { AuthInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  onSuccess: (email: string) => void
}

export const SendForgetPasswordOtp = ({ onSuccess }: Props) => {
  const t = useTranslations('auth.forgetPassword')

  const forgetPasswordSchema = z.object({
    email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
  })

  type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPasswordFormData>({
    resolver: zodResolver(forgetPasswordSchema),
  })

  const { mutateAsync: sendOtp } = useSendForgetPasswordOtp()

  const onSubmit = async (data: ForgetPasswordFormData) => {
    await sendOtp(data)
    onSuccess(data.email)
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="auth-heading">{t('title')}</h1>
        <p className="auth-subheading">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AuthInput
          icon={Mail}
          placeholder={t('emailPlaceholder')}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" className="auth-action-btn" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submitButton')}
        </Button>
      </form>
    </>
  )
}
