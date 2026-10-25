import { SiteHeading } from '@/components/shared'

import lockImage from '@/assets/image/lock.png'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

import product1 from '@/assets/products/Label/Cleanser-Label.jpg'
import product2 from '@/assets/products/Label/Radiant-Satin-Lip Oil-Label.jpg'
import product3 from '@/assets/products/Label/Serum-Dropper-Label.jpg'

export const CollectionProduct = async () => {
  const t = await getTranslations('home.collection')

  const collectionList = [
    {
      key: 'serum',
      title: t('collectionList.serum.title'),
      description: t('collectionList.serum.description'),
      image: product1,
    },
    {
      key: 'sleepingMask',
      title: t('collectionList.sleepingMask.title'),
      description: t('collectionList.sleepingMask.description'),
      image: product2,
    },
    {
      key: 'lipOil',
      title: t('collectionList.lipOil.title'),
      description: t('collectionList.lipOil.description'),
      image: product3,
    },
  ]

  return (
    <section className="bg-ivory px-4 py-16 sm:px-8 md:py-24 lg:py-32">
      <p className="text-dark-brown/70 mb-4 text-center font-sans text-xs font-medium tracking-widest uppercase">
        {t('subtitle')}
      </p>
      <SiteHeading heading={t('title')} subHeading={t('desc')} />

      <div className="mx-auto mt-12 grid max-w-[1280px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
        {collectionList.map((item) => (
          <div
            key={item.key}
            className="flex flex-col overflow-hidden rounded-none bg-white shadow-sm transition-all duration-300 hover:shadow-md"
          >
            {/* Image with Coming Soon overlay */}
            <div className="relative aspect-square w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover opacity-30 blur-[3px]"
              />
              {/* Coming Soon overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="bg-deep-green/10 rounded-full p-2">
                  <Image src={lockImage} alt="Lock" />
                </div>
                <span className="text-charcoal/60 mt-3 font-sans text-[10px] font-semibold tracking-widest uppercase">
                  {t('comingSoon')}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="text-charcoal flex flex-col items-center p-8 text-center">
              <h3 className="font-serif text-2xl font-light">{item.title}</h3>
              <p className="text-charcoal/80 mt-3 font-sans text-[15px] leading-relaxed font-light">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
