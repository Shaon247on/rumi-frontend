'use client'

import { AuthInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ResetPassword = () => {
  const t = useTranslations('auth.resetPassword')

  const resetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(1, t('validation.passwordRequired'))
        .min(8, t('validation.passwordMin')),
      confirmPassword: z.string().min(1, t('validation.confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    })

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    // TODO: API integration
    console.log(data)
  }

  return (
    <div className="auth-container">
      <Link href="/login" className="auth-back-btn">
        <ArrowLeft className="size-5" />
      </Link>

      <div className="mb-8 text-center">
        <h1 className="auth-heading">{t('title')}</h1>
        <p className="auth-subheading">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AuthInput
          icon={Lock}
          placeholder={t('passwordPlaceholder')}
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />
        <AuthInput
          icon={Lock}
          placeholder={t('confirmPasswordPlaceholder')}
          type="password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" className="auth-action-btn" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submitButton')}
        </Button>
      </form>
    </div>
  )
}

export default ResetPassword
