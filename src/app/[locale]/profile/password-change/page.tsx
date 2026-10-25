'use client'

import { usePasswordChange } from '@/api/api-hooks/profile.api-hook'
import { AuthInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Pencil } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const PasswordChange = () => {
  const t = useTranslations('profile.passwordChange')

  const passwordChangeSchema = z
    .object({
      old_password: z
        .string()
        .min(1, t('validation.oldPasswordRequired'))
        .min(8, t('validation.passwordMin')),
      new_password: z
        .string()
        .min(1, t('validation.newPasswordRequired'))
        .min(8, t('validation.passwordMin')),
      confirm_password: z.string().min(1, t('validation.confirmPasswordRequired')),
      date_of_birth: z.string().min(1, t('validation.dobRequired')),
      contact_number: z
        .string()
        .min(1, t('validation.contactNumberRequired'))
        .min(8, t('validation.contactNumberMin')),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t('validation.passwordMismatch'),
      path: ['confirm_password'],
    })

  type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  })

  const { mutateAsync: changePassword } = usePasswordChange()

  const onSubmit = async (data: PasswordChangeFormData) => {
    await changePassword(data)
  }

  return (
    <div className="bg-brand-shade-10 rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-main-primary-base_light mb-2 text-4xl leading-none font-normal">
            {t('title')}
          </h2>
          <p className="text-main-button text-sm">{t('subtitle')}</p>
        </div>
        <div className="border-main-button/20 bg-main-button/10 flex size-12 items-center justify-center rounded-full border">
          <Lock className="text-main-button size-5" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          label={t('oldPasswordPlaceholder')}
          placeholder={t('oldPasswordPlaceholder')}
          type="password"
          autoComplete="current-password"
          variant="default"
          labelClassName="text-main-button pb-4!"
          className="placeholder:text-main-button text-main-button text-sm"
          error={errors.old_password?.message}
          {...register('old_password')}
        />

        <AuthInput
          label={t('newPasswordPlaceholder')}
          placeholder={t('newPasswordPlaceholder')}
          type="password"
          autoComplete="new-password"
          variant="default"
          labelClassName="text-main-button pb-4!"
          className="placeholder:text-main-button text-main-button text-sm"
          error={errors.new_password?.message}
          {...register('new_password')}
        />

        <AuthInput
          label={t('confirmPasswordPlaceholder')}
          placeholder={t('confirmPasswordPlaceholder')}
          type="password"
          autoComplete="new-password"
          variant="default"
          labelClassName="text-main-button pb-4!"
          className="placeholder:text-main-button text-main-button text-sm"
          error={errors.confirm_password?.message}
          {...register('confirm_password')}
        />

        <AuthInput
          label={t('dateOfBirthPlaceholder')}
          placeholder={t('dateOfBirthPlaceholder')}
          type="date"
          autoComplete="bday"
          variant="default"
          labelClassName="text-main-button pb-4!"
          className="placeholder:text-main-button text-main-button text-sm"
          error={errors.date_of_birth?.message}
          {...register('date_of_birth')}
        />

        <AuthInput
          label={t('contactNumberPlaceholder')}
          placeholder={t('contactNumberPlaceholder')}
          type="tel"
          autoComplete="tel"
          variant="default"
          labelClassName="text-main-button pb-4!"
          className="placeholder:text-main-button text-main-button text-sm"
          error={errors.contact_number?.message}
          {...register('contact_number')}
        />

        <Button
          type="submit"
          variant="outline"
          className="text-main-button! mt-2 rounded-md border border-[#E0E0E0] bg-[#FFF] px-12 py-5 font-bold"
          disabled={isSubmitting}
          style={{
            boxShadow: `0 4px 4px 0 rgba(255, 255, 255, 0.25) inset, 0 -4px 5.1px 0 rgba(0, 0, 0, 0.20) inset`,
          }}
        >
          <Pencil className="text-main-button! size-4" />
          {isSubmitting ? t('submitting') : t('submitButton')}
        </Button>
      </form>
    </div>
  )
}

export default PasswordChange
