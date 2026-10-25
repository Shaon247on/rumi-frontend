'use client'

import defaultUserImage from '@/assets/image/default-avatar.png'
import { useProfile, useUpdateProfile } from '@/api/api-hooks/profile.api-hook'
import { AuthInput } from '@/components/shared'
import { Button } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, ImagePlus, Pencil, X } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const genderValues = ['male', 'female', 'other'] as const
const skinTypeValues = ['normal', 'dry', 'oily', 'combination', 'sensitive'] as const

type GenderValue = (typeof genderValues)[number]
type SkinTypeValue = (typeof skinTypeValues)[number]

const isGenderValue = (value: string | null | undefined): value is GenderValue =>
  genderValues.includes(value as GenderValue)

const isSkinTypeValue = (value: string | null | undefined): value is SkinTypeValue =>
  skinTypeValues.includes(value as SkinTypeValue)

const Settings = () => {
  const t = useTranslations('profile.settings')
  const homeTranslations = useTranslations('home.createAccountDialog')
  const { data: userProfile } = useProfile()
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const genderOptions: { value: GenderValue; label: string }[] = [
    { value: 'male', label: t('genderOptions.male') },
    { value: 'female', label: t('genderOptions.female') },
    { value: 'other', label: t('genderOptions.other') },
  ]

  const skinTypeOptions: { value: SkinTypeValue; label: string }[] = [
    { value: 'normal', label: homeTranslations('fields.skinTypeOptions.normal') },
    { value: 'dry', label: homeTranslations('fields.skinTypeOptions.dry') },
    { value: 'oily', label: homeTranslations('fields.skinTypeOptions.oily') },
    { value: 'combination', label: homeTranslations('fields.skinTypeOptions.combination') },
    { value: 'sensitive', label: homeTranslations('fields.skinTypeOptions.sensitive') },
  ]

  const settingsSchema = z.object({
    name: z.string().min(1, t('errors.nameRequired')),
    gender: z.string().min(1, t('errors.genderRequired')),
    skinType: z.string().min(1, t('errors.skinTypeRequired')),
  })

  type SettingsFormData = z.infer<typeof settingsSchema>

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      gender: '',
      skinType: '',
    },
  })

  useEffect(() => {
    if (!userProfile) {
      return
    }

    reset({
      name: userProfile.full_name || '',
      gender: isGenderValue(userProfile.gender) ? userProfile.gender : '',
      skinType: isSkinTypeValue(userProfile.skin_type) ? userProfile.skin_type : '',
    })
  }, [reset, userProfile])

  const selectedImagePreview = useMemo(() => {
    if (!selectedImage) {
      return null
    }

    return URL.createObjectURL(selectedImage)
  }, [selectedImage])

  useEffect(() => {
    if (!selectedImagePreview) {
      return undefined
    }

    return () => URL.revokeObjectURL(selectedImagePreview)
  }, [selectedImagePreview])

  const onSubmit = async (data: SettingsFormData) => {
    await updateProfile({
      full_name: data.name,
      gender: isGenderValue(data.gender) ? data.gender : undefined,
      skin_type: data.skinType,
      ...(selectedImage ? { image: selectedImage } : {}),
    })

    setSelectedImage(null)
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      setSelectedImage(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      return
    }

    setSelectedImage(file)
  }

  const handleClearImage = () => {
    setSelectedImage(null)
  }

  const imageSource = selectedImagePreview || userProfile?.image || defaultUserImage

  return (
    <div className="bg-brand-shade-10 rounded-xl p-6">
      <h2 className="mb-6 text-4xl leading-none font-normal text-[#F7F5ED]!">{t('title')}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <AuthInput
          label={t('name')}
          placeholder={t('namePlaceholder')}
          variant="default"
          labelClassName="text-main-button pb-4!"
          className="placeholder:text-main-button text-main-button text-sm"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="space-y-1.5">
          <label htmlFor="profileImage" className="text-main-button pb-4! text-sm font-medium">
            {t('image')}
          </label>
          <div className="bg-background/70 border-input flex items-center gap-4 rounded-lg border p-4">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
              <Image
                src={imageSource}
                alt={userProfile?.full_name || t('imageAlt')}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-main-button text-sm font-medium">{t('imageHelp')}</p>
              <div className="flex flex-wrap gap-2">
                <label
                  htmlFor="profileImage"
                  className="bg-main-button inline-flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white"
                >
                  <ImagePlus className="size-4" />
                  {selectedImage ? t('changeImage') : t('uploadImage')}
                </label>
                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-white/80"
                  >
                    <X className="size-4" />
                    {t('clearImage')}
                  </button>
                )}
              </div>
              <p className="text-main-button/70 text-xs">{t('imageHint')}</p>
            </div>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="gender" className="text-main-button pb-4! text-sm font-medium">
            {t('gender')}
          </label>
          <div className="relative">
            <select
              id="gender"
              className={`border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-main-button text-main-button flex h-12 w-full appearance-none rounded-md border px-3 py-2 pr-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.gender ? 'border-destructive' : ''}`}
              {...register('gender')}
              aria-invalid={errors.gender ? 'true' : 'false'}
            >
              <option value="" disabled hidden>
                {t('genderPlaceholder')}
              </option>
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="text-main-button pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
          </div>
          {errors.gender && (
            <p className="text-destructive text-sm" role="alert">
              {errors.gender.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="skinType" className="text-main-button pb-4! text-sm font-medium">
            {t('skinType')}
          </label>
          <div className="relative">
            <select
              id="skinType"
              className={`border-input bg-background ring-offset-background focus-visible:ring-ring placeholder:text-main-button text-main-button flex h-12 w-full appearance-none rounded-md border px-3 py-2 pr-10 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${errors.skinType ? 'border-destructive' : ''}`}
              {...register('skinType')}
              aria-invalid={errors.skinType ? 'true' : 'false'}
            >
              <option value="" disabled hidden>
                {t('skinTypePlaceholder')}
              </option>
              {skinTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="text-main-button pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
          </div>
          {errors.skinType && (
            <p className="text-destructive text-sm" role="alert">
              {errors.skinType.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="outline"
          className="text-main-button! mt-2 rounded-md border border-[#E0E0E0] bg-[#FFF] px-12 py-5 font-bold"
          disabled={isSubmitting || isUpdating}
          style={{
            boxShadow: `0 4px 4px 0 rgba(255, 255, 255, 0.25) inset, 0 -4px 5.1px 0 rgba(0, 0, 0, 0.20) inset`,
          }}
        >
          <Pencil className="text-main-button! size-4" />
          {isSubmitting || isUpdating ? t('saving') : t('editProfile')}
        </Button>
      </form>
    </div>
  )
}

export default Settings
