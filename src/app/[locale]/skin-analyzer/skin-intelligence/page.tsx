'use client'

import { useGenerateRoutine } from '@/api/api-hooks/shop.api-hooks'
import type { ShopSkinType } from '@/api/query-list/shop.query'
import { CommonNav, UploadMedia } from '@/components/shared'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Link, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Loader2,
  MessageCircle,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch, type FieldPath } from 'react-hook-form'
import { z } from 'zod'

const MAX_PHOTO_SIZE_MB = 10
const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024
const MAX_DETAILS_LENGTH = 500

const STEP_KEYS = ['skinType', 'profile', 'concerns', 'photo'] as const

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-2 text-sm text-red-700">{message}</p> : null

const FieldLabel = ({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) => (
  <Label
    htmlFor={htmlFor}
    className="mb-3 block text-[11px] font-medium tracking-[0.2em] text-[#8C8275] uppercase"
  >
    {children}
  </Label>
)

const Analysis = () => {
  const t = useTranslations('skinAnalyzerAnalysis')
  const locale = useLocale()
  const router = useRouter()
  const { mutateAsync: generateRoutine, isPending } = useGenerateRoutine()
  const [stepIndex, setStepIndex] = useState(0)

  const skinTypes = useMemo(
    () =>
      (['oily', 'dry', 'combination', 'normal', 'sensitive'] as const).map((key) => ({
        key,
        label: t(`form.skinType.options.${key}`),
        description: t(`form.skinType.descriptions.${key}`),
      })),
    [t]
  )

  const skinConcerns = useMemo(
    () =>
      (
        [
          'acne',
          'darkSpots',
          'fineLines',
          'dryness',
          'oilySkin',
          'redness',
          'dullness',
          'largePores',
          'others',
        ] as const
      ).map((key) => ({ key, label: t(`form.concerns.options.${key}`) })),
    [t]
  )

  const features = useMemo(
    () => [
      { icon: FlaskConical, key: 'scienceLed' },
      { icon: UserRound, key: 'personalized' },
      { icon: ShieldCheck, key: 'expertBacked' },
    ],
    []
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
          concerns: z.array(z.string()).min(1, t('form.validation.concernsRequired')),
          othersConcern: z.string().optional(),
          additionalDetails: z
            .string()
            .max(MAX_DETAILS_LENGTH, t('form.validation.additionalDetailsMax')),
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
              code: 'custom',
              path: ['othersConcern'],
              message: t('form.validation.othersConcernRequired'),
            })
          }
        }),
    [t]
  )

  type AnalysisFormValues = z.infer<typeof analysisSchema>

  const stepFields: Record<(typeof STEP_KEYS)[number], FieldPath<AnalysisFormValues>[]> = {
    skinType: ['skinType'],
    profile: ['age', 'additionalDetails'],
    concerns: ['concerns', 'othersConcern'],
    photo: ['photo'],
  }

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
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

  const [selectedConcerns, additionalDetails] = useWatch({
    control,
    name: ['concerns', 'additionalDetails'],
  })

  const isLoading = isSubmitting || isPending
  const currentStep = STEP_KEYS[stepIndex]
  const isLastStep = stepIndex === STEP_KEYS.length - 1

  const goNext = async () => {
    const isValid = await trigger(stepFields[currentStep])
    if (isValid) {
      setStepIndex((index) => Math.min(index + 1, STEP_KEYS.length - 1))
    }
  }

  const goBack = () => setStepIndex((index) => Math.max(index - 1, 0))

  const onSubmit = async (values: AnalysisFormValues) => {
    const payload = {
      age: Number(values.age),
      skin_type: values.skinType as ShopSkinType,
      additional_details: values.additionalDetails.trim() || undefined,
      concerns: values.concerns
        .map((concern) =>
          concern === 'others' ? (values.othersConcern?.trim() ?? concern) : concern
        )
        .filter((concern): concern is string => Boolean(concern)),
      photo: values.photo?.[0],
      language: locale,
    }

    try {
      await generateRoutine(payload)
      router.push('/skin-analyzer/your-routine')
    } catch {
      // The mutation hook already surfaces the error via toast.
    }
  }

  // If validation fails on submit, jump back to the first step with an error
  const onInvalid = (formErrors: Partial<Record<keyof AnalysisFormValues, unknown>>) => {
    const firstInvalid = STEP_KEYS.findIndex((key) =>
      stepFields[key].some((field) => field in formErrors)
    )
    if (firstInvalid !== -1) {
      setStepIndex(firstInvalid)
    }
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

  const chipClass = (isSelected: boolean) =>
    cn(
      'rounded-full border px-4 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-[#1C1C1A]/30 focus-visible:outline-none',
      isSelected
        ? 'border-[#1C1C1A] bg-[#1C1C1A] text-ivory'
        : 'border-[#E6DFD5] bg-white text-[#2B2B2B] hover:border-[#1C1C1A]/40'
    )

  const inputClass = 'h-12 rounded-xl border-[#E6DFD5] bg-white focus-visible:ring-[#1C1C1A]/20'

  return (
    <div className="min-h-screen bg-ivory">
      <CommonNav />

      <div className="mx-auto flex max-w-3xl justify-end px-4 pt-6 md:px-6">
        <Link
          href="/ai-chat-assistant"
          className="inline-flex items-center gap-2 rounded-full border border-[#E6DFD5] bg-white px-4 py-2 text-xs font-medium text-[#2B2B2B] transition-colors hover:border-[#1C1C1A]/40"
        >
          <MessageCircle className="size-4" strokeWidth={1.25} />
          {t('chatAssistant')}
        </Link>
      </div>

      {/* Header */}
      <header className="mx-auto max-w-2xl px-4 pt-8 pb-10 text-center md:pt-10 md:pb-12">
        <p className="text-[11px] tracking-[0.3em] text-[#8C8275] uppercase">{t('header.eyebrow')}</p>
        <h1 className="mt-3 font-serif text-4xl font-light text-[#1C1C1A] md:text-5xl">
          {t('header.title')}
        </h1>
        <p className="mt-4 text-base text-[#2B2B2B] md:text-lg">{t('header.tagline')}</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#5C564E]">
          {t('header.subtitle')}
        </p>
      </header>

      {/* Consultation card */}
      <div className="mx-auto max-w-3xl px-4 pb-16 md:px-6">
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          onKeyDown={(event) => {
            // Enter in a text field moves to the next step instead of submitting early
            if (event.key === 'Enter' && !isLastStep && event.target instanceof HTMLInputElement) {
              event.preventDefault()
              void goNext()
            }
          }}
          noValidate
          className="rounded-3xl border border-[#E6DFD5] bg-white p-5 shadow-[0_10px_40px_rgba(26,25,24,0.03)] sm:p-8 md:p-12"
        >
          {/* Step indicator */}
          <ol className="mb-10 grid grid-cols-4 gap-2" aria-label={t('stepIndicator', { current: stepIndex + 1, total: STEP_KEYS.length })}>
            {STEP_KEYS.map((key, index) => {
              const isDone = index < stepIndex
              const isActive = index === stepIndex

              return (
                <li key={key} aria-current={isActive ? 'step' : undefined}>
                  <div
                    className={cn(
                      'h-px w-full transition-colors duration-500',
                      isDone || isActive ? 'bg-[#1C1C1A]' : 'bg-[#E6DFD5]'
                    )}
                  />
                  <p
                    className={cn(
                      'mt-3 flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase sm:text-[11px]',
                      isActive ? 'text-[#1C1C1A]' : 'text-[#A39B90]'
                    )}
                  >
                    <span className="font-medium tabular-nums">
                      {isDone ? <Check className="size-3" /> : String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="hidden sm:inline">{t(`steps.${key}.label`)}</span>
                  </p>
                </li>
              )
            })}
          </ol>

          <div className="mb-8">
            <p className="text-[11px] tracking-[0.2em] text-[#8C8275] uppercase sm:hidden">
              {t('stepIndicator', { current: stepIndex + 1, total: STEP_KEYS.length })} ·{' '}
              {t(`steps.${currentStep}.label`)}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-light text-[#1C1C1A] sm:mt-0 md:text-3xl">
              {t(`steps.${currentStep}.title`)}
            </h2>
            <p className="mt-2 text-sm text-[#5C564E]">{t(`steps.${currentStep}.description`)}</p>
          </div>

          {/* Step 01 — Skin type */}
          {currentStep === 'skinType' ? (
            <div>
              <Controller
                control={control}
                name="skinType"
                render={({ field }) => (
                  <div
                    role="radiogroup"
                    aria-label={t('form.skinType.label')}
                    className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  >
                    {skinTypes.map((type) => {
                      const isSelected = field.value === type.key

                      return (
                        <button
                          key={type.key}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => field.onChange(type.key)}
                          className={cn(
                            'flex items-start justify-between gap-3 rounded-2xl border p-4 text-start transition-colors focus-visible:ring-2 focus-visible:ring-[#1C1C1A]/30 focus-visible:outline-none',
                            isSelected
                              ? 'border-[#1C1C1A] bg-ivory'
                              : 'border-[#E6DFD5] bg-white hover:border-[#1C1C1A]/40'
                          )}
                        >
                          <span>
                            <span className="block text-sm font-medium text-[#1C1C1A]">
                              {type.label}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-[#5C564E]">
                              {type.description}
                            </span>
                          </span>
                          <span
                            className={cn(
                              'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
                              isSelected ? 'border-[#1C1C1A] bg-[#1C1C1A]' : 'border-[#CFC6B9]'
                            )}
                          >
                            {isSelected ? <Check className="size-2.5 text-white" /> : null}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                )}
              />
              <FieldError message={errors.skinType?.message} />
            </div>
          ) : null}

          {/* Step 02 — Profile */}
          {currentStep === 'profile' ? (
            <div className="space-y-8">
              <div className="max-w-xs">
                <FieldLabel htmlFor="age">{t('form.age.label')}</FieldLabel>
                <Input
                  id="age"
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  autoComplete="off"
                  placeholder={t('form.age.placeholder')}
                  className={cn(inputClass, errors.age && 'border-red-700')}
                  {...register('age')}
                  aria-invalid={Boolean(errors.age)}
                />
                <FieldError message={errors.age?.message} />
              </div>

              <div>
                <FieldLabel htmlFor="additionalDetails">
                  {t('form.additionalDetails.label')}
                </FieldLabel>
                <Textarea
                  id="additionalDetails"
                  placeholder={t('form.additionalDetails.placeholder')}
                  className={cn(
                    'min-h-28 rounded-xl border-[#E6DFD5] bg-white focus-visible:ring-[#1C1C1A]/20',
                    errors.additionalDetails && 'border-red-700'
                  )}
                  {...register('additionalDetails')}
                  aria-invalid={Boolean(errors.additionalDetails)}
                />
                <div className="mt-2 flex items-start justify-between gap-4">
                  <FieldError message={errors.additionalDetails?.message} />
                  <span
                    className={cn(
                      'ms-auto text-xs tabular-nums',
                      (additionalDetails?.length ?? 0) > MAX_DETAILS_LENGTH
                        ? 'text-red-700'
                        : 'text-[#A39B90]'
                    )}
                  >
                    {additionalDetails?.length ?? 0}/{MAX_DETAILS_LENGTH}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Step 03 — Concerns */}
          {currentStep === 'concerns' ? (
            <div>
              <div className="flex flex-wrap gap-2">
                {skinConcerns.map((concern) => {
                  const isSelected = selectedConcerns?.includes(concern.key) ?? false

                  return (
                    <button
                      key={concern.key}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleConcern(concern.key)}
                      className={chipClass(isSelected)}
                    >
                      {concern.label}
                    </button>
                  )
                })}
              </div>
              <FieldError message={errors.concerns?.message} />
              {selectedConcerns?.includes('others') ? (
                <div className="mt-5">
                  <Input
                    autoFocus
                    placeholder={t('form.concerns.othersPlaceholder')}
                    aria-label={t('form.concerns.othersPlaceholder')}
                    className={cn(inputClass, errors.othersConcern && 'border-red-700')}
                    {...register('othersConcern')}
                    aria-invalid={Boolean(errors.othersConcern)}
                  />
                  <FieldError message={errors.othersConcern?.message} />
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Step 04 — Photo */}
          {currentStep === 'photo' ? (
            <div>
              <Controller
                control={control}
                name="photo"
                render={({ field }) => (
                  <UploadMedia
                    label={t('form.uploadPhoto.label')}
                    description={`${t('form.uploadPhoto.clickToUpload')} · ${t('form.uploadPhoto.fileTypes')}`}
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    multiple={false}
                    ariaLabel={t('form.uploadPhoto.label')}
                    files={field.value ?? []}
                    onFilesChange={field.onChange}
                    dropzoneClassName={cn(
                      'rounded-2xl border-[#E6DFD5] bg-ivory',
                      errors.photo && 'border-red-700'
                    )}
                    error={errors.photo?.message}
                  />
                )}
              />
              <p className="mt-3 text-xs text-[#8C8275]">{t('form.uploadPhoto.tip')}</p>
            </div>
          ) : null}

          {/* Navigation */}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[#F0EBE3] pt-6 sm:flex-row sm:items-center sm:justify-between">
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={goBack}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-2 py-3 text-sm text-[#5C564E] transition-colors hover:text-[#1C1C1A] disabled:opacity-50"
              >
                <ArrowLeft className="size-4 rtl:rotate-180" strokeWidth={1.5} />
                {t('form.back')}
              </button>
            ) : (
              <span className="hidden sm:block" />
            )}

            {isLastStep ? (
              <button
                key="submit"
                type="submit"
                disabled={isLoading}
                className="inline-flex min-w-56 items-center justify-center gap-2 rounded-full bg-[#1C1C1A] px-8 py-4 text-xs font-medium tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-[#2C2A29] disabled:cursor-wait disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    {t('form.submitting')}
                  </>
                ) : (
                  t('form.submitButton')
                )}
              </button>
            ) : (
              <button
                key="next"
                type="button"
                onClick={() => void goNext()}
                className="inline-flex min-w-40 items-center justify-center gap-2 rounded-full bg-[#1C1C1A] px-8 py-4 text-xs font-medium tracking-[0.2em] text-ivory uppercase transition-colors hover:bg-[#2C2A29]"
              >
                {t('form.next')}
                <ArrowRight className="size-4 rtl:rotate-180" strokeWidth={1.5} />
              </button>
            )}
          </div>

          {isLoading ? (
            <p className="mt-4 text-center text-xs text-[#8C8275]" role="status">
              {t('form.preparing')}
            </p>
          ) : null}

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-[#8C8275]">
            <ShieldCheck className="size-3.5 shrink-0" strokeWidth={1.25} />
            {t('form.privacyNote')}
          </p>
        </form>
      </div>

      {/* Values */}
      <section className="border-t border-[#E6DFD5] pb-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 pt-14 md:grid-cols-3 md:gap-8">
          {features.map(({ icon: Icon, key }) => (
            <div key={key} className="text-center">
              <Icon className="mx-auto size-6 text-[#8C8275]" strokeWidth={1} aria-hidden />
              <h3 className="mt-4 text-sm font-medium tracking-[0.15em] text-[#1C1C1A] uppercase">
                {t(`features.${key}.title`)}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-[#5C564E]">
                {t(`features.${key}.subtitle`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Analysis
