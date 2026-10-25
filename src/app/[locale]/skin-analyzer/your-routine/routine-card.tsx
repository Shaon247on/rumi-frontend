import { Link } from '@/i18n/navigation'
import { CalendarDays, Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import type { ReactNode } from 'react'

import type { RoutineHistorySummary, RoutineStep } from './your-routines-contents'

type RoutineCardProps = {
  routine: RoutineHistorySummary
  t: ReturnType<typeof useTranslations>
}

const getStepLabel = (step: RoutineStep) => step.step || step.productName || 'Routine step'

const getStepSubtitle = (step: RoutineStep) => {
  const parts = [step.brand, step.brandType, step.category].filter(Boolean)
  return parts.join(' • ')
}

const RoutineStepRow = ({ step, index }: { index: number; step: RoutineStep }) => {
  const href = step.productUrl || '/skin-analyzer'
  const imageAlt = step.productName || step.step || 'Routine product'

  return (
    <Link href={href} className="flex items-start gap-4 pl-4">
      <div className="bg-main-button flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white">
        {index + 1}
      </div>
      <div className="flex-1">
        <h4 className="text-main-button text-lg font-bold">{getStepLabel(step)}</h4>
        {getStepSubtitle(step) && (
          <p className="text-main-button/60 text-sm">{getStepSubtitle(step)}</p>
        )}
        {step.rationale && <p className="text-main-button/80 mt-1 text-sm">{step.rationale}</p>}
        {step.howToUse && (
          <p className="text-main-button/70 mt-1 text-sm">
            <span className="font-semibold">How to use:</span> {step.howToUse}
          </p>
        )}
      </div>
      <div className="relative shrink-0">
        {step.imageUrl ? (
          <Image
            src={step.imageUrl}
            alt={imageAlt}
            width={200}
            height={200}
            className="min-h-40 min-w-32 rounded-lg object-cover"
          />
        ) : (
          <div className="bg-background/60 flex h-40 w-32 items-center justify-center rounded-lg text-xs text-white/70">
            No image
          </div>
        )}
        {step.price !== undefined && (
          <span className="absolute -bottom-2 left-1/2 w-full -translate-x-1/2 rounded-b bg-black/70 px-2 py-0.5 text-center text-xs text-white">
            {typeof step.price === 'number' ? `$${step.price.toFixed(2)}` : step.price}
          </span>
        )}
      </div>
    </Link>
  )
}

const RoutineSection = ({
  icon,
  title,
  subtitle,
  steps,
  emptyMessage,
}: {
  emptyMessage: string
  icon: ReactNode
  steps: RoutineStep[]
  subtitle?: string
  title: string
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <div className="space-y-2">
          <h3 className="text-main-button text-3xl font-normal">{title}</h3>
          {subtitle && <p className="text-main-button/60 text-sm">{subtitle}</p>}
        </div>
      </div>

      {steps.length > 0 ? (
        <div className="space-y-6">
          {steps.map((step, index) => (
            <RoutineStepRow
              key={`${title}-${step.productName ?? step.step ?? index}`}
              index={index}
              step={step}
            />
          ))}
        </div>
      ) : (
        <p className="text-main-button/60 pl-4 text-sm">{emptyMessage}</p>
      )}
    </div>
  )
}

export const RoutineCard = ({ routine, t }: RoutineCardProps) => {
  return (
    <div className="bg-brand-shade-10 rounded-2xl p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-main-button text-4xl font-normal">
            {routine.skinType || t('routines.personal')}
          </h2>
          <p className="text-main-button/70 text-sm">
            {routine.additionalDetails || routine.createdAt || 'Routine history item'}
          </p>
        </div>
        <div className="border-main-button/20 bg-main-button/10 flex size-12 items-center justify-center rounded-full border">
          <CalendarDays className="text-main-button size-5" />
        </div>
      </div>

      {routine.concerns.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {routine.concerns.map((concern) => (
            <span
              key={`${routine.id}-${concern}`}
              className="bg-main-button/10 text-main-button rounded-full px-3 py-1 text-xs"
            >
              {concern}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-8">
        <RoutineSection
          icon={<Sun className="size-12 text-yellow-500" />}
          title={t('routines.morning.title')}
          subtitle={t('routines.morning.subtitle')}
          steps={routine.morningRoutine}
          emptyMessage="No morning routine steps available."
        />

        <div className="border-main-button/10 border-t" />

        <RoutineSection
          icon={<Moon className="text-main-button size-12" />}
          title={t('routines.evening.title')}
          subtitle={t('routines.evening.subtitle')}
          steps={routine.eveningRoutine}
          emptyMessage="No evening routine steps available."
        />
      </div>
    </div>
  )
}
