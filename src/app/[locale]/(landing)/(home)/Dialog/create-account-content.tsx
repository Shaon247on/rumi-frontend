'use client'

import { useRegister } from '@/api/api-hooks/auth.api-hook'
import type { AuthGender, RegisterRequestData } from '@/api/query-list/auth.query'
import createProfileBg from '@/assets/image/modals/complete-profile-image.png'
import { DatePicker } from '@/components/shared/date-picker'
import { MembershipModalStep, useMembershipModalStore } from '@/store/membership-modal.store'
import { zodResolver } from '@hookform/resolvers/zod'
import type { AxiosError } from 'axios'
import { format } from 'date-fns'
import { ChevronDown, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { getApiErrorMessage } from '@/lib/api-error'

type CreateAccountFormData = {
  fullName: string
  email: string
  contactNumber: string
  skinType: string
  birthday?: Date
  gender?: AuthGender
  password: string
}

type CreateAccountContentProps = {
  setCurrentStep: (step: MembershipModalStep) => void
}

export const CreateAccountContent = ({ setCurrentStep }: CreateAccountContentProps) => {
  const t = useTranslations('home.createAccountDialog')
  const SkinTypeOptions = [
    { value: 'normal', label: t('fields.skinTypeOptions.normal') },
    { value: 'dry', label: t('fields.skinTypeOptions.dry') },
    { value: 'oily', label: t('fields.skinTypeOptions.oily') },
    { value: 'combination', label: t('fields.skinTypeOptions.combination') },
    { value: 'sensitive', label: t('fields.skinTypeOptions.sensitive') },
  ]

  const maxBirthdayDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    d.setHours(0, 0, 0, 0)
    return d
  })()

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(
      z.object({
        fullName: z.string().min(2, t('validation.fullNameMin')),
        email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('validation.emailInvalid')),
        contactNumber: z.string().min(10, t('validation.contactNumberMin')),
        skinType: z.string().min(1, t('validation.skinTypeRequired')),
        birthday: z
          .date()
          .optional()
          .refine(
            (birthday) => {
              if (!birthday) return true
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              const birthDate = new Date(birthday)
              birthDate.setHours(0, 0, 0, 0)
              return birthDate < today
            },
            {
              message: t('validation.birthdayInvalid'),
            }
          ),
        gender: z.enum(['male', 'female', 'other']).optional(),
        password: z.string().min(8, t('validation.passwordMin')),
      })
    ),
    mode: 'onBlur',
  })

  const { mutateAsync: createRegistrationUser, isPending } = useRegister()
  const setRegisteredEmail = useMembershipModalStore((s) => s.setRegisteredEmail)

  const onFormSubmit = async (data: CreateAccountFormData) => {
    const birthday = data.birthday ? format(data.birthday as Date, 'yyyy-MM-dd') : undefined

    const payload: RegisterRequestData = {
      full_name: data.fullName,
      email: data.email,
      contact_number: data.contactNumber,
      skin_type: data.skinType,
      password: data.password,
    }

    if (birthday) payload.date_of_birth = birthday
    if (data.gender) payload.gender = data.gender

    await createRegistrationUser(payload, {
      onSuccess: () => {
        setRegisteredEmail(data.email)
        setCurrentStep('verify-otp')
      },
      onError: (error) => {
        console.log('createTempInfo Error: ', error)
        const errorMessage = getApiErrorMessage(
          error as AxiosError,
          'Something went wrong. Please try again.'
        )

        // Map common backend validation error messages to specific form fields
        const lowerMessage = errorMessage.toLowerCase()
        if (
          lowerMessage.includes('date of birth') ||
          lowerMessage.includes('birthday') ||
          lowerMessage.includes('birth date')
        ) {
          setError('birthday', { type: 'server', message: errorMessage })
        } else if (lowerMessage.includes('email')) {
          setError('email', { type: 'server', message: errorMessage })
        } else if (
          lowerMessage.includes('contact') ||
          lowerMessage.includes('phone') ||
          lowerMessage.includes('number')
        ) {
          setError('contactNumber', { type: 'server', message: errorMessage })
        } else if (lowerMessage.includes('name')) {
          setError('fullName', { type: 'server', message: errorMessage })
        } else if (lowerMessage.includes('password')) {
          setError('password', { type: 'server', message: errorMessage })
        } else if (lowerMessage.includes('skin')) {
          setError('skinType', { type: 'server', message: errorMessage })
        } else if (lowerMessage.includes('gender')) {
          setError('gender', { type: 'server', message: errorMessage })
        }

        toast.error(errorMessage)
      },
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="relative grid grid-cols-1 lg:grid-cols-12"
      style={{
        backgroundImage: `url(${createProfileBg.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="col-span-5 hidden lg:block"></div>
      {/* Form Content */}
      <div className="flex flex-col gap-6 bg-white/20 p-6 backdrop-blur-[1px] md:p-12 lg:col-span-7">
        {/* Header */}
        <div className="text-primary flex flex-col gap-8 text-center">
          <div className="text-xl">
            <p className="mb-0">{t('title')}</p>
            <p>{t('subtitle')}</p>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-2">
            {/* Full Name */}
            <div className="grid grid-cols-3 gap-2">
              <label htmlFor="fullName" className="text-primary min-w-24 text-base font-normal">
                {t('fields.fullName')}
              </label>
              <div className="col-span-2 flex flex-col">
                <input
                  type="text"
                  id="fullName"
                  placeholder={t('fields.fullNamePlaceholder')}
                  className="coming-create-modal-input"
                  {...register('fullName')}
                  aria-invalid={errors.fullName ? 'true' : 'false'}
                />
                {errors.fullName && (
                  <span className="mt-1 text-xs text-red-600" role="alert">
                    {errors.fullName.message}
                  </span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="grid grid-cols-3 gap-2">
              <label htmlFor="email" className="text-primary min-w-24 text-base">
                {t('fields.email')}
              </label>
              <div className="col-span-2 flex flex-col">
                <input
                  type="email"
                  id="email"
                  placeholder={t('fields.emailPlaceholder')}
                  className="coming-create-modal-input"
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && (
                  <span className="mt-1 text-xs text-red-600" role="alert">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            {/* Contact Number */}
            <div className="grid grid-cols-3 gap-2">
              <label htmlFor="contactNumber" className="text-primary min-w-32 text-base">
                {t('fields.contactNumber')}
              </label>
              <div className="col-span-2 flex flex-col">
                <input
                  type="tel"
                  id="contactNumber"
                  placeholder={t('fields.contactNumberPlaceholder')}
                  className="coming-create-modal-input"
                  {...register('contactNumber')}
                  aria-invalid={errors.contactNumber ? 'true' : 'false'}
                />
                {errors.contactNumber && (
                  <span className="mt-1 text-xs text-red-600" role="alert">
                    {errors.contactNumber.message}
                  </span>
                )}
              </div>
            </div>

            {/* Skin Type */}
            <div className="grid grid-cols-3 gap-2">
              <label htmlFor="skinType" className="text-primary min-w-24 text-base">
                {t('fields.skinType')}
              </label>
              <div className="col-span-2 flex flex-col">
                <div className="relative w-full">
                  <select
                    id="skinType"
                    className="text-primary h-9.5 w-full appearance-none rounded-full bg-white px-5 py-2 pr-10 text-sm focus:ring-2 focus:ring-black/20 focus:outline-none"
                    {...register('skinType')}
                    aria-invalid={errors.skinType ? 'true' : 'false'}
                  >
                    <option value="">{t('fields.skinTypePlaceholder')}</option>
                    {SkinTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="text-primary pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
                </div>
                {errors.skinType && (
                  <span className="mt-1 text-xs text-red-600" role="alert">
                    {errors.skinType.message}
                  </span>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="grid grid-cols-3 gap-2">
              <label htmlFor="gender" className="text-primary min-w-24 text-base">
                {t('fields.gender')}
              </label>
              <div className="col-span-2 flex flex-col">
                <div className="relative w-full">
                  <select
                    id="gender"
                    className="text-primary h-9.5 w-full appearance-none rounded-full bg-white px-5 py-2 pr-10 text-sm focus:ring-2 focus:ring-black/20 focus:outline-none"
                    {...register('gender')}
                    aria-invalid={errors.gender ? 'true' : 'false'}
                  >
                    <option value="">{t('fields.genderPlaceholder')}</option>
                    <option value="male">{t('fields.genderOptions.male')}</option>
                    <option value="female">{t('fields.genderOptions.female')}</option>
                    <option value="other">{t('fields.genderOptions.other')}</option>
                  </select>
                  <ChevronDown className="text-primary pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
                </div>
                {errors.gender && (
                  <span className="mt-1 text-xs text-red-600" role="alert">
                    {errors.gender.message}
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-3 gap-2">
              <label htmlFor="password" className="text-primary min-w-24 text-base">
                {t('fields.password')}
              </label>
              <div className="col-span-2 flex flex-col">
                <input
                  type="password"
                  id="password"
                  placeholder={t('fields.passwordPlaceholder')}
                  className="coming-create-modal-input"
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && (
                  <span className="mt-1 text-xs text-red-600" role="alert">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            {/* Birthday */}
            <div className="grid grid-cols-3 gap-2">
              <label className="text-primary min-w-24 text-base">{t('fields.birthday')}</label>
              <div className="col-span-2 flex flex-col">
                <Controller
                  control={control}
                  name="birthday"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      labelName={t('fields.SelectDateLabelName')}
                      maxDate={maxBirthdayDate}
                    />
                  )}
                />
                {errors.birthday && (
                  <span className="mt-1 text-xs text-red-600" role="alert">
                    {errors.birthday.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="submit"
          disabled={isPending}
          className="bg-primary mx-auto mt-4 flex h-9.5 w-64 cursor-pointer items-center justify-center rounded-full px-5 py-2 text-sm text-white transition-colors hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('cta')}
        </button>
      </div>
    </form>
  )
}
