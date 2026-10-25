import { getLocale, getTranslations } from 'next-intl/server'

export const SkincareShowcase = async () => {
  const t = await getTranslations('home.skincareShowcase')
  const locale = await getLocale()
  const isAR = locale === 'ar'

  const detailKeys = ['aiPowered', 'dermatologically', 'premium', 'modernScience'] as const
  const indices = isAR ? ['٠١', '٠٢', '٠٣', '٠٤'] : ['01', '02', '03', '04']

  return (
    <section className="bg-ivory mb-[4rem] w-full pt-20 md:mb-[8rem]">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
        {/* Centered Section Header */}
        <h2
          className="text-charcoal/70 mb-6 text-center font-sans text-[0.75rem] font-normal tracking-[0.25em] uppercase"
          style={{
            letterSpacing: isAR ? '0' : '0.25em',
            lineHeight: 1.4,
            fontFamily: isAR
              ? 'var(--font-ibm-plex-arabic), sans-serif'
              : 'var(--font-lato), sans-serif',
          }}
        >
          {t('title')}
        </h2>

        {/* 4-Column Editorial Grid */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          {detailKeys.map((key, index) => {
            const indexNum = indices[index]
            return (
              <div key={key} className="flex flex-col text-start">
                {/* Short Editorial Divider */}
                <div className="bg-charcoal mb-6 h-[1px] w-[100px] opacity-20" />

                {/* Index Number */}
                <span
                  className="text-charcoal mb-4 block font-serif text-[20px] font-light opacity-50"
                  style={{
                    fontFamily: isAR
                      ? 'var(--font-ibm-plex-arabic), sans-serif'
                      : 'var(--font-cormorant-garamond), serif',
                  }}
                >
                  {indexNum}
                </span>

                {/* Pillar Heading */}
                <h3
                  className="text-charcoal mb-3 font-serif text-[1.25rem] leading-[1.4] font-light"
                  style={{
                    fontFamily: isAR
                      ? 'var(--font-ibm-plex-arabic), sans-serif'
                      : 'var(--font-cormorant-garamond), serif',
                  }}
                >
                  {t(`skincareDetails.${key}.title`)}
                </h3>

                {/* Pillar Body Text */}
                <p
                  className="text-charcoal/70 max-w-[260px] font-sans text-[0.9rem] leading-[1.75] font-light"
                  style={{
                    fontFamily: isAR
                      ? 'var(--font-ibm-plex-arabic), sans-serif'
                      : 'var(--font-lato), sans-serif',
                  }}
                >
                  {t(`skincareDetails.${key}.description`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
