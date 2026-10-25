import { getTranslations } from 'next-intl/server'
import Transformation from './transformation'

export const TransformationWrapper = async () => {
  const t = await getTranslations('home.transformation')

  return (
    <Transformation
      eyebrow={t('eyebrow')}
      stages={{
        day0: {
          label: t('stages.day0.label'),
          quote: t('stages.day0.quote'),
          stat: t('stages.day0.stat'),
        },
        week1: {
          label: t('stages.week1.label'),
          quote: t('stages.week1.quote'),
          stat: t('stages.week1.stat'),
        },
        month1: {
          label: t('stages.month1.label'),
          quote: t('stages.month1.quote'),
          stat: t('stages.month1.stat'),
        },
        month3: {
          label: t('stages.month3.label'),
          quote: t('stages.month3.quote'),
          stat: t('stages.month3.stat'),
        },
      }}
      clinicalNote={t('clinicalNote')}
    />
  )
}
