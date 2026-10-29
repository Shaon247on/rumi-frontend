import React from 'react'
import Image from 'next/image'
import { SiteHeading } from '@/components/shared'
import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'

type CardData = {
  key: string
  index: string
  title: string
  subtitle: string
}

export const GlowmiStates = async () => {
  const t = await getTranslations('home.understands')
  const locale = await getLocale()
  const isAR = locale === 'ar'

  const cardsStates: CardData[] = [
    {
      key: 'scan',
      index: t('cards.scan.index'),
      title: t('cards.scan.title'),
      subtitle: t('cards.scan.subtitle'),
    },
    {
      key: 'personalized',
      index: t('cards.personalized.index'),
      title: t('cards.personalized.title'),
      subtitle: t('cards.personalized.subtitle'),
    },
    {
      key: 'results',
      index: t('cards.results.index'),
      title: t('cards.results.title'),
      subtitle: t('cards.results.subtitle'),
    },
  ]

  const displayFont = isAR
    ? 'var(--font-ibm-plex-arabic), sans-serif'
    : 'var(--font-cormorant-garamond), serif'

  const bodyFont = isAR
    ? 'var(--font-ibm-plex-arabic), sans-serif'
    : 'var(--font-inter), sans-serif'

  const learnMoreLabel = t('learnMore')

  // Shared classes so the three text columns and three image columns stay in sync
  const textColClass =
    'flex h-full flex-col text-warp  items-start justify-center border-s border-[#E2DDD7] px-4 py-6 text-start lg:px-6 lg:py-8 xl:px-10 xl:py-10'
  const labelClass =
    'mb-2 text-[9px] leading-none font-medium tracking-[0.2em] text-[#8A8378] uppercase lg:mb-2.5 lg:text-[10px] xl:text-[11px] xl:tracking-[0.25em]'
  const titleClass =
    'mb-3 text-[18px] leading-[1] font-medium xl:tracking-[-0.18rem] text-[#1A2E1A] lg:mb-4 lg:text-[23px] xl:text-[40px]'
  const subtitleClass =
    'mb-5 max-w-[24ch] text-[13px] leading-[1.6] font-light text-[#6B655F] lg:mb-6 lg:max-w-[26ch] lg:text-[12px] xl:mb-8 xl:max-w-[28ch] xl:text-[15px] xl:leading-[1.75]'
  const learnMoreClass =
    'group text-[9px] leading-none font-medium tracking-[0.15em] text-[#1A2E1A] uppercase lg:text-[10px] xl:text-[11px] xl:tracking-[0.2em]'
  const dividerClass = 'mb-5 h-px w-5 bg-[#B7AF9E] lg:mb-6 xl:mb-7 xl:w-6'
  const sideImageClass = 'relative h-[240px] overflow-hidden lg:h-[360px] xl:h-[520px]'
  const midImageClass =
    'relative h-[240px] overflow-hidden border-s border-[#E2DDD7] lg:h-[360px] xl:h-[520px]'

  return (
    <section className="w-full bg-[#FAF9F5] py-20 md:py-28 lg:py-32">
      {/* Heading block */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center text-center lg:mb-20">
          <span
            className="mb-5 text-[11px] leading-none font-medium tracking-[0.3em] text-[#8A8378] uppercase"
            style={{ fontFamily: bodyFont }}
          >
            {t('eyebrow')}
          </span>

          <h2
            className="text-[38px] leading-[1.1] font-normal tracking-[-0.01em] text-[#1A2E1A] md:text-[48px] lg:text-[56px]"
            style={{ fontFamily: displayFont }}
          >
            {t('title')}
          </h2>

          <p
            className="mt-6 max-w-[52ch] text-[15px] leading-[1.75] font-light text-[#6B655F] md:text-[16px]"
            style={{ fontFamily: bodyFont }}
          >
            {t('desc')}
          </p>
        </div>
      </div>

      {/* Desktop/tablet: full-bleed row — face image | Discover | drop image | Protect | Radiant | leaf image */}
      <div className="xl:px-10 mx-auto hidden md:grid md:grid-cols-[130px_1fr_100px_1fr_1fr_130px] lg:grid-cols-[190px_1fr_150px_1fr_1fr_190px] xl:grid-cols-[260px_1fr_200px_1fr_1fr_260px]">
        <div className={sideImageClass}>
          <Image src="/discover.jpg" alt="" fill className="object-cover" sizes="(min-width: 1280px) 260px, (min-width: 1024px) 190px, 130px" />
        </div>

        <div className={textColClass}>
          <span className={labelClass} style={{ fontFamily: bodyFont }}>
            {cardsStates[0].index}
          </span>
          <div className={dividerClass} />
          <h3 className={titleClass} style={{ fontFamily: displayFont }}>
            {cardsStates[0].title}
          </h3>
          <p className={subtitleClass} style={{ fontFamily: bodyFont }}>
            {cardsStates[0].subtitle}
          </p>
          <Link
            href="/skin-analyzer/skin-intelligence"
            className={learnMoreClass}
            style={{ fontFamily: bodyFont }}
          >
            <span className="border-b border-[#1A2E1A]/50 pb-1 transition-colors duration-300 group-hover:border-[#1A2E1A] lg:pb-1.5">
              {learnMoreLabel}
            </span>
          </Link>
        </div>

        <div className={midImageClass}>
          <Image src="/protect.jpg" alt="" fill className="object-cover" sizes="(min-width: 1280px) 200px, (min-width: 1024px) 150px, 100px" />
        </div>

        <div className={textColClass}>
          <span className={labelClass} style={{ fontFamily: bodyFont }}>
            {cardsStates[1].index}
          </span>
          <div className={dividerClass} />
          <h3 className={titleClass} style={{ fontFamily: displayFont }}>
            {cardsStates[1].title}
          </h3>
          <p className={subtitleClass} style={{ fontFamily: bodyFont }}>
            {cardsStates[1].subtitle}
          </p>
          <Link
            href="/skin-analyzer/skin-intelligence"
            className={learnMoreClass}
            style={{ fontFamily: bodyFont }}
          >
            <span className="border-b border-[#1A2E1A]/50 pb-1 transition-colors duration-300 group-hover:border-[#1A2E1A] lg:pb-1.5">
              {learnMoreLabel}
            </span>
          </Link>
        </div>

        <div className={textColClass}>
          <span className={labelClass} style={{ fontFamily: bodyFont }}>
            {cardsStates[2].index}
          </span>
          <div className={dividerClass} />
          <h3 className={titleClass} style={{ fontFamily: displayFont }}>
            {cardsStates[2].title}
          </h3>
          <p className={subtitleClass} style={{ fontFamily: bodyFont }}>
            {cardsStates[2].subtitle}
          </p>
          <Link
            href="/skin-analyzer/skin-intelligence"
            className={learnMoreClass}
            style={{ fontFamily: bodyFont }}
          >
            <span className="border-b border-[#1A2E1A]/50 pb-1 transition-colors duration-300 group-hover:border-[#1A2E1A] lg:pb-1.5">
              {learnMoreLabel}
            </span>
          </Link>
        </div>

        <div className={midImageClass}>
          <Image src="/radiant.jpg" alt="" fill className="object-cover" sizes="(min-width: 1280px) 260px, (min-width: 1024px) 190px, 130px" />
        </div>
      </div>

      {/* Mobile: stacked — image above text for the first two, text then image for the last */}
      <div className="flex flex-col divide-y divide-[#E2DDD7] md:hidden">
        <div className="relative h-[280px] w-full overflow-hidden">
          <Image src="/discover.jpg" alt="" fill className="object-cover" sizes="100vw" />
        </div>

        <div className="flex flex-col items-start px-6 py-10 text-start">
          <span
            className="mb-2.5 text-[11px] leading-none font-medium tracking-[0.25em] text-[#8A8378] uppercase"
            style={{ fontFamily: bodyFont }}
          >
            {cardsStates[0].index}
          </span>
          <div className="mb-7 h-px w-6 bg-[#B7AF9E]" />
          <h3
            className="mb-4 text-[26px] leading-[1.22] font-normal tracking-[-0.005em] text-[#1A2E1A]"
            style={{ fontFamily: displayFont }}
          >
            {cardsStates[0].title}
          </h3>
          <p
            className="mb-8 max-w-[30ch] text-[15px] leading-[1.75] font-light text-[#6B655F]"
            style={{ fontFamily: bodyFont }}
          >
            {cardsStates[0].subtitle}
          </p>
          <Link
            href="/skin-analyzer/skin-intelligence"
            className="group text-[11px] leading-none font-medium tracking-[0.2em] text-[#1A2E1A] uppercase"
            style={{ fontFamily: bodyFont }}
          >
            <span className="border-b border-[#1A2E1A]/50 pb-1.5 transition-colors duration-300 group-hover:border-[#1A2E1A]">
              {learnMoreLabel}
            </span>
          </Link>
        </div>

        <div className="relative h-[280px] w-full overflow-hidden">
          <Image src="/protect.jpg" alt="" fill className="object-cover" sizes="100vw" />
        </div>

        <div className="flex flex-col items-start px-6 py-10 text-start">
          <span
            className="mb-2.5 text-[11px] leading-none font-medium tracking-[0.25em] text-[#8A8378] uppercase"
            style={{ fontFamily: bodyFont }}
          >
            {cardsStates[1].index}
          </span>
          <div className="mb-7 h-px w-6 bg-[#B7AF9E]" />
          <h3
            className="mb-4 text-[26px] leading-[1.22] font-normal tracking-[-0.005em] text-[#1A2E1A]"
            style={{ fontFamily: displayFont }}
          >
            {cardsStates[1].title}
          </h3>
          <p
            className="mb-8 max-w-[30ch] text-[15px] leading-[1.75] font-light text-[#6B655F]"
            style={{ fontFamily: bodyFont }}
          >
            {cardsStates[1].subtitle}
          </p>
          <Link
            href="/skin-analyzer/skin-intelligence"
            className="group text-[11px] leading-none font-medium tracking-[0.2em] text-[#1A2E1A] uppercase"
            style={{ fontFamily: bodyFont }}
          >
            <span className="border-b border-[#1A2E1A]/50 pb-1.5 transition-colors duration-300 group-hover:border-[#1A2E1A]">
              {learnMoreLabel}
            </span>
          </Link>
        </div>

        <div className="flex flex-col items-start px-6 py-10 text-start">
          <span
            className="mb-2.5 text-[11px] leading-none font-medium tracking-[0.25em] text-[#8A8378] uppercase"
            style={{ fontFamily: bodyFont }}
          >
            {cardsStates[2].index}
          </span>
          <div className="mb-7 h-px w-6 bg-[#B7AF9E]" />
          <h3
            className="mb-4 text-[26px] leading-[1.22] font-normal tracking-[-0.005em] text-[#1A2E1A]"
            style={{ fontFamily: displayFont }}
          >
            {cardsStates[2].title}
          </h3>
          <p
            className="mb-8 max-w-[30ch] text-[15px] leading-[1.75] font-light text-[#6B655F]"
            style={{ fontFamily: bodyFont }}
          >
            {cardsStates[2].subtitle}
          </p>
          <Link
            href="/skin-analyzer/skin-intelligence"
            className="group text-[11px] leading-none font-medium tracking-[0.2em] text-[#1A2E1A] uppercase"
            style={{ fontFamily: bodyFont }}
          >
            <span className="border-b border-[#1A2E1A]/50 pb-1.5 transition-colors duration-300 group-hover:border-[#1A2E1A]">
              {learnMoreLabel}
            </span>
          </Link>
        </div>

        <div className="relative h-[280px] w-full overflow-hidden">
          <Image src="/radiant.jpg" alt="" fill className="object-cover" sizes="100vw" />
        </div>
      </div>
    </section>
  )
}