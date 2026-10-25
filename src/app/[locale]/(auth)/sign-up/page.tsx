'use client'

import { useRegister } from '@/api/api-hooks/auth.api-hook'
import { AuthInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { useAuthStore } from '@/store/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Lock, Mail, Phone, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const SignUp = () => {
  const t = useTranslations('auth.signUp')
  const router = useRouter()

  const signUpSchema = z.object({
    full_name: z.string().min(1, t('validation.fullNameRequired')).optional(),
    contact_number: z
      .string()
      .regex(/^\+?[0-9\s\-()]{7,20}$/, t('validation.contactNumberInvalid'))
      .optional()
      .or(z.literal('')),
    email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('validation.passwordRequired'))
      .min(8, t('validation.passwordMin')),
  })

  type SignUpFormData = z.infer<typeof signUpSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const { mutateAsync: registerUser } = useRegister()
  const setUser = useAuthStore((state) => state.setUser)
  const setToken = useAuthStore((state) => state.setToken)

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await registerUser(data)
      const registerData = response.data?.data

      if (registerData) {
        setUser(registerData.user ?? null)
        setToken({
          accessToken: registerData.access,
          refreshToken: registerData.refresh,
        })
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`)
      }
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error)
    }
  }

  return (
    <div className="auth-container">
      <Link href="/" className="auth-back-btn">
        <ArrowLeft className="size-5" />
      </Link>

      <div className="mb-8 text-center">
        <h1 className="auth-heading">{t('title')}</h1>
        <p className="auth-subheading">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AuthInput
          icon={User}
          placeholder={t('fullNamePlaceholder')}
          type="text"
          error={errors.full_name?.message}
          {...register('full_name')}
        />
        <AuthInput
          icon={Phone}
          placeholder={t('contactNumberPlaceholder')}
          type="tel"
          error={errors.contact_number?.message}
          {...register('contact_number')}
        />
        <AuthInput
          icon={Mail}
          placeholder={t('emailPlaceholder')}
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <AuthInput
          icon={Lock}
          placeholder={t('passwordPlaceholder')}
          type="password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" className="auth-action-btn" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submitButton')}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          {t('hasAccount')}{' '}
          <Link href="/login" className="text-foreground font-semibold hover:underline">
            {t('loginLink')}
          </Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp
