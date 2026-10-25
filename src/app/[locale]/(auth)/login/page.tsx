'use client'

import { useLogin } from '@/api/api-hooks/auth.api-hook'
import { AuthInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { Link } from '@/i18n/navigation'
import { useAuthStore } from '@/store/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Lock, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const Login = () => {
  const t = useTranslations('auth.login')
  const router = useRouter()

  const loginSchema = z.object({
    email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
    password: z
      .string()
      .min(1, t('validation.passwordRequired'))
      .min(8, t('validation.passwordMin')),
  })

  type LoginFormData = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const { mutateAsync: login } = useLogin()

  const setUser = useAuthStore((state) => state.setUser)

  const setToken = useAuthStore((state) => state.setToken)

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data)
      const loginData = response.data?.data

      if (loginData) {
        setUser(loginData.user ?? null)
        setToken({ accessToken: loginData.access, refreshToken: loginData.refresh })
        router.push('/skin-analyzer/skin-intelligence')
      }
    } catch (error) {
      console.log('🚀 ~ onSubmit ~ error:', error)
    }
  }

  return (
    <div className="auth-container">
      <Link
        href="/"
        className="auth-back-btn"
        style={{
          boxShadow:
            '0 4.444px 6.667px -1.111px rgba(0, 0, 0, 0.10), 0 2.222px 4.444px -2.222px rgba(0, 0, 0, 0.10)',
        }}
      >
        <ArrowLeft className="size-5" />
      </Link>

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
        <div>
          <AuthInput
            icon={Lock}
            placeholder={t('passwordPlaceholder')}
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="mt-2 text-end">
            <Link href="/forget-password" className="text-main-button text-sm hover:underline">
              {t('forgetPassword')}
            </Link>
          </div>
        </div>

        <Button type="submit" className="auth-action-btn" disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submitButton')}
        </Button>

        <p className="text-muted-foreground text-center text-sm">
          {t('noAccount')}{' '}
          <Link href="/sign-up" className="text-foreground font-semibold hover:underline">
            {t('signUpLink')}
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
