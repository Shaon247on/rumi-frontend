'use client'

import AiPowered from '@/assets/icons/AI-Powered.svg'
import Chat from '@/assets/icons/chat-regular.svg'
import ExpertBacked from '@/assets/icons/Expert-Backed.svg'
import Personalized from '@/assets/icons/Personalized.svg'
import { CommonNav, SiteHeading, UploadMedia } from '@/components/shared'
import { Button } from '@/components/ui'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useGenerateRoutine } from '@/api/api-hooks/shop.api-hooks'
import type { ShopSkinType } from '@/api/query-list/shop.query'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, Sparkles, Sun, UserCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

const MAX_PHOTO_SIZE_MB = 10
const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024

const Analysis = () => {
  const t = useTranslations('skinAnalyzerAnalysis')
  const router = useRouter()
  const { mutateAsync: generateRoutine, isPending } = useGenerateRoutine()

  const skinTypes = useMemo(
    () => [
      { key: 'oily', label: t('form.skinType.options.oily') },
      { key: 'dry', label: t('form.skinType.options.dry') },
      { key: 'combination', label: t('form.skinType.options.combination') },
      { key: 'normal', label: t('form.skinType.options.normal') },
      { key: 'sensitive', label: t('form.skinType.options.sensitive') },
    ],
    [t]
  )

  const skinConcerns = useMemo(
    () => [
      { key: 'acne', label: t('form.concerns.options.acne') },
      { key: 'darkSpots', label: t('form.concerns.options.darkSpots') },
      { key: 'fineLines', label: t('form.concerns.options.fineLines') },
      { key: 'dryness', label: t('form.concerns.options.dryness') },
      { key: 'oilySkin', label: t('form.concerns.options.oilySkin') },
      { key: 'redness', label: t('form.concerns.options.redness') },
      { key: 'dullness', label: t('form.concerns.options.dullness') },
      { key: 'largePores', label: t('form.concerns.options.largePores') },
      { key: 'others', label: t('form.concerns.options.others') },
    ],
    [t]
  )

  const features = useMemo(
    () => [
      {
        image: AiPowered,
        title: t('features.aiPowered.title'),
        subtitle: t('features.aiPowered.subtitle'),
      },
      {
        image: Personalized,
        title: t('features.personalized.title'),
        subtitle: t('features.personalized.subtitle'),
      },
      {
        image: ExpertBacked,
        title: t('features.expertBacked.title'),
        subtitle: t('features.expertBacked.subtitle'),
      },
    ],
    [t]
  )

  const analysisSchema = useMemo(
    () =>
      z
        .object({
          skinType: z.string().min(1, t('form.validation.skinTypeRequired')),
          age: z
            .string()
            .min(1, t('form.validation.ageRequired'))
            .regex(/^\d+$/, t('form.validation.ageInvalid'))
            .refine((value) => Number(value) >= 13 && Number(value) <= 120, {
              message: t('form.validation.ageRange'),
            }),
          concerns: z
            .array(z.string())
            .min(1, t('form.validation.concernsRequired'))
            .refine((values) => values.length > 0, {
              message: t('form.validation.concernsRequired'),
            }),
          othersConcern: z.string().optional(),
          additionalDetails: z.string().max(500, t('form.validation.additionalDetailsMax')),
          photo: z
            .array(z.instanceof(File))
            .max(1, t('form.validation.photoMaxOne'))
            .optional()
            .refine(
              (files) =>
                !files?.[0] ||
                (files[0].size <= MAX_PHOTO_SIZE_BYTES && files[0].type.startsWith('image/')),
              {
                message: t('form.validation.photoInvalid'),
              }
            ),
        })
        .superRefine((values, ctx) => {
          if (values.concerns.includes('others') && !values.othersConcern?.trim()) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['othersConcern'],
              message: t('form.validation.othersConcernRequired'),
            })
          }
        }),
    [t]
  )

  type AnalysisFormValues = z.infer<typeof analysisSchema>

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AnalysisFormValues>({
    resolver: zodResolver(analysisSchema),
    defaultValues: {
      skinType: '',
      age: '',
      concerns: [],
      othersConcern: '',
      additionalDetails: '',
      photo: [],
    },
  })

  const selectedConcerns = useWatch({ control, name: 'concerns' })

  const onSubmit = async (values: AnalysisFormValues) => {
    const photoFile = values.photo?.[0]

    const payload = {
      age: Number(values.age),
      skin_type: values.skinType as ShopSkinType,
      additional_details: values.additionalDetails.trim() || undefined,
      concerns: values.concerns
        .map((concern) =>
          concern === 'others' ? (values.othersConcern?.trim() ?? concern) : concern
        )
        .filter((concern): concern is string => Boolean(concern)),
      photo: photoFile,
    }

    await generateRoutine(payload)
    router.push('/skin-analyzer/your-routine')
  }

  const toggleConcern = (concernKey: string) => {
    const nextConcerns = selectedConcerns?.includes(concernKey)
      ? selectedConcerns.filter((item) => item !== concernKey)
      : [...(selectedConcerns ?? []), concernKey]

    setValue('concerns', nextConcerns, { shouldValidate: true, shouldDirty: true })

    if (!nextConcerns.includes('others')) {
      setValue('othersConcern', '', { shouldValidate: true, shouldDirty: true })
    }
  }

  return (
    <div className="bg-[#FFFFFF]">
      <CommonNav />
      <Link
        href="/skin-analyzer/your-routine"
        className="mx-auto flex max-w-4xl items-center justify-end gap-x-1 px-6"
      >
        <Image src={Chat} alt="chat" />
        <p className="text-main-button text-center text-base leading-normal font-semibold">
          Chat Assistant
        </p>
      </Link>

      <div className="py-12">
        <SiteHeading heading={t('header.title')} subHeading={t('header.subtitle')} />
      </div>

      <div className="mx-auto max-w-4xl px-6 pb-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl p-8"
          style={{ backgroundColor: '#F5F6F5' }}
        >
          <div className="mb-8">
            <Label className="text-main-button mb-4 flex items-center gap-2 text-sm font-medium">
              <Sun className="size-4" />
              {t('form.skinType.label')}
            </Label>
            <Controller
              control={control}
              name="skinType"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {skinTypes.map((type) => {
                    const isSelected = field.value === type.key

                    return (
                      <button
                        key={type.key}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => field.onChange(type.key)}
                        className={cn(
                          'rounded-md border px-4 py-2 text-sm transition-colors',
                          isSelected
                            ? 'border-main-button bg-main-button text-white'
                            : 'border-main-button/30 text-main-button hover:border-main-button bg-white'
                        )}
                      >
                        {type.label}
                      </button>
                    )
                  })}
                </div>
              )}
            />
            {errors.skinType?.message ? (
              <p className="mt-2 text-sm text-red-600">{errors.skinType.message}</p>
            ) : null}
          </div>

          <div className="mb-8">
            <Label className="text-main-button mb-4 flex items-center gap-2 text-sm font-medium">
              <UserCircle className="size-4" />
              {t('form.age.label')}
            </Label>
            <Input
              type="text"
              placeholder={t('form.age.placeholder')}
              className={cn('bg-white', errors.age && 'border-destructive')}
              {...register('age')}
              aria-invalid={Boolean(errors.age)}
            />
            {errors.age?.message ? (
              <p className="mt-2 text-sm text-red-600">{errors.age.message}</p>
            ) : null}
          </div>

          <div className="mb-8">
            <Label className="text-main-button mb-4 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4" />
              {t('form.concerns.label')}
            </Label>
            <div className="flex flex-wrap gap-2">
              {skinConcerns.map((concern) => {
                const isSelected = selectedConcerns?.includes(concern.key) ?? false

                return (
                  <button
                    key={concern.key}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => toggleConcern(concern.key)}
                    className={cn(
                      'rounded-md border px-4 py-2 text-sm transition-colors',
                      isSelected
                        ? 'border-main-button bg-main-button text-white'
                        : 'border-main-button/30 text-main-button hover:border-main-button bg-white'
                    )}
                  >
                    {concern.label}
                  </button>
                )
              })}
            </div>
            {errors.concerns?.message ? (
              <p className="mt-2 text-sm text-red-600">{errors.concerns.message}</p>
            ) : null}
            {selectedConcerns?.includes('others') ? (
              <div className="mt-4">
                <Input
                  placeholder={t('form.concerns.othersPlaceholder')}
                  className={cn('bg-transparent', errors.othersConcern && 'border-destructive')}
                  {...register('othersConcern')}
                  aria-invalid={Boolean(errors.othersConcern)}
                />
                {errors.othersConcern?.message ? (
                  <p className="mt-2 text-sm text-red-600">{errors.othersConcern.message}</p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mb-8">
            <Label className="text-main-button mb-4 flex items-center gap-2 text-sm font-medium">
              <FileText className="size-4" />
              {t('form.additionalDetails.label')}
            </Label>
            <Textarea
              placeholder={t('form.additionalDetails.placeholder')}
              className={cn('min-h-30 bg-white', errors.additionalDetails && 'border-destructive')}
              {...register('additionalDetails')}
              aria-invalid={Boolean(errors.additionalDetails)}
            />
            {errors.additionalDetails?.message ? (
              <p className="mt-2 text-sm text-red-600">{errors.additionalDetails.message}</p>
            ) : null}
          </div>

          <div className="mb-8">
            <Controller
              control={control}
              name="photo"
              render={({ field }) => (
                <UploadMedia
                  label={t('form.uploadPhoto.label')}
                  description={`${t('form.uploadPhoto.clickToUpload')} • ${t('form.uploadPhoto.fileTypes')}`}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple={false}
                  ariaLabel={t('form.uploadPhoto.label')}
                  files={field.value ?? []}
                  onFilesChange={field.onChange}
                  dropzoneClassName={cn(errors.photo && 'border-destructive')}
                  error={errors.photo?.message}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            className="bg-main-button hover:bg-main-button/90 w-full gap-2 py-6 text-white"
            disabled={isSubmitting || isPending}
          >
            <Sparkles className="size-4" />
            {isSubmitting || isPending ? t('form.submitButton') : t('form.submitButton')}
          </Button>
        </form>
      </div>

      <div className="py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center text-center">
              <Image src={feature.image} alt={feature.title} className="mb-4 size-10" />
              <h3 className="mb-2 text-xl text-black">{feature.title}</h3>
              <p className="text-sm text-black/70">{feature.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Analysis
