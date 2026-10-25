import { SiteHeading } from '@/components/shared'

import Icon4 from '@/assets/image/visuals-results/bx_leaf.png'
import Icon1 from '@/assets/image/visuals-results/cil_drop.png'
import Icon3 from '@/assets/image/visuals-results/gards.png'
import Icon2 from '@/assets/image/visuals-results/water-box.png'
import { getTranslations } from 'next-intl/server'
import Image, { StaticImageData } from 'next/image'

const iconMap: Record<string, StaticImageData> = {
  niacinamide: Icon1,
  hyaluronic: Icon2,
  peptide: Icon3,
  botanical: Icon4,
}

export const VisualsResults = async () => {
  const t = await getTranslations('home.glowmiStates')

  const stateKeys = ['niacinamide', 'hyaluronic', 'peptide', 'botanical'] as const

  return (
    <section className="my-20 bg-[#D9E6ED33] px-4 py-20 sm:px-8">
      <SiteHeading heading={t('title')} subHeading={t('desc')} />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stateKeys.map((key) => (
          <div key={key} className="flex flex-col rounded-2xl bg-white p-6 py-10 shadow-sm">
            <div className="mb-4 flex size-14 shrink-0 items-center justify-center overflow-visible rounded-xl bg-[#2447311A]">
              <Image src={iconMap[key]} alt="Icons" className="size-8" />
            </div>
            <h3 className={`text-main-button text-3xl font-semibold`}>
              {t(`states.${key}.title`)}
            </h3>
            <p className={`text-main-primary-base_medium mt-2 text-sm font-medium`}>
              <span>{t(`states.${key}.subtitle`)}</span>
              {t(`states.${key}.desc`) ? (
                <>
                  <br />
                  <span className="mt-2 block">{t(`states.${key}.desc`)}</span>
                </>
              ) : null}
            </p>
          </div>
        ))}
      </div>
      <p className={`text-main-primary-base_medium mt-8 text-center`}>{t('subtitle')}</p>
    </section>
  )
}
