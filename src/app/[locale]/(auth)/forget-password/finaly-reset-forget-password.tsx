'use client'

import { useResetForgetPassword } from '@/api/api-hooks/forget-password.api-hook'
import { AuthInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  email: string
}

export const FinalyResetForgetPassword = ({ email }: Props) => {
  const t = useTranslations('auth.resetPassword')
  const router = useRouter()

  const resetPasswordSchema = z
    .object({
      new_password: z
        .string()
        .min(1, t('validation.passwordRequired'))
        .min(8, t('validation.passwordMin')),
      confirm_password: z.string().min(1, t('validation.confirmPasswordRequired')),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t('validation.passwordMismatch'),
      path: ['confirm_password'],
    })

  type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const { mutateAsync: resetPassword } = useResetForgetPassword()

  const onSubmit = async (data: ResetPasswordFormData) => {
    await resetPassword({ email, new_password: data.new_password })
    router.push('/login')
  }

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="auth-heading">{t('title')}</h1>
        <p className="auth-subheading">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AuthInput
          icon={Lock}
          placeholder={t('passwordPlaceholder')}
          type="password"
          error={errors.new_password?.message}
          {...register('new_password')}
        />

        <AuthInput
          icon={Lock}
          placeholder={t('confirmPasswordPlaceholder')}
          type="password"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        <Button type="submit" className="auth-action-btn" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submitButton')}
        </Button>
      </form>
    </>
  )
}
