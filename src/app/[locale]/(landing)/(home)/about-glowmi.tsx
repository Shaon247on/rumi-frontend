import aboutImage from '@/assets/image/about-img.png'

import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

export const AboutGlowmi = async () => {
  const t = await getTranslations('home.about')

  return (
    <section>
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="flex justify-center bg-[#FEF9F6] lg:col-span-2">
          <Image src={aboutImage} alt="Glowmi Product" className="w-full max-w-md" />
        </div>
        <div className="flex flex-col justify-center space-y-6 bg-[#FFFFFF] px-4 py-10 lg:col-span-3 lg:px-24 lg:py-20">
          <h2 className={`text-foreground text-4xl lg:text-5xl`}>{t('title')}</h2>
          <p className={`text-muted-foreground text-base leading-relaxed lg:text-lg`}>
            {t('desc')}
          </p>
        </div>
      </div>
    </section>
  )
}
