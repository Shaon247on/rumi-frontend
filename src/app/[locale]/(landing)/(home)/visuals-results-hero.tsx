import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'

import VisualsResultsBgImg from '@/assets/image/VisualsResults-bg.png'
import { cn } from '@/lib/utils'

export const VisualsResultsHero = async () => {
  const t = await getTranslations('home.visualsResultsHero')
  const locale = await getLocale()
  const isAR = locale === 'ar'

  return (
    <section
      dir={isAR ? 'rtl' : 'ltr'}
      className="relative flex w-full flex-col overflow-hidden bg-[#070503] md:h-[700px] md:flex-row md:items-center"
    >
      {/* Background Layer Stack (Spans full viewport width, visible on desktop) */}
      <div className="absolute inset-0 hidden h-full w-full overflow-hidden md:block">
        {/* Layer 1: Image - flower artwork focus on the right */}
        <Image
          src={VisualsResultsBgImg}
          alt={t('imageAlt')}
          fill
          sizes="100vw"
          className="animate-slow-scale pointer-events-none object-cover object-[78%_center] select-none"
          priority
          style={{
            animationDuration: '20s',
          }}
        />

        {/* Layer 2: Warm amber vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,rgba(20,15,12,0.15)_0%,rgba(7,5,3,0.85)_100%)]" />

        {/* Layer 3: Solid left-to-right dark gradient ensuring high text contrast on the left side */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#070503] via-[#070503]/85 to-transparent" />

        {/* Layer 4: Soft radial glow around resin flower */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,rgba(179,139,109,0.18)_0%,transparent_60%)]" />

        {/* Layer 5: Very subtle film grain overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Layer 6: Ambient Dust Particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
          <div className="animate-dust-1 absolute top-[25%] left-[25%] h-[2.5px] w-[2.5px] rounded-full bg-[#FAF8F4]/30 blur-[0.4px]" />
          <div className="animate-dust-2 absolute top-[65%] left-[18%] h-[1.5px] w-[1.5px] rounded-full bg-[#FAF8F4]/45 blur-[0.3px]" />
          <div className="animate-dust-3 absolute top-[35%] left-[42%] h-[3.5px] w-[3.5px] rounded-full bg-[#FAF8F4]/20 blur-[0.6px]" />
        </div>
      </div>

      {/* Mobile Stack Visual (Image first, stacked on mobile) */}
      <div className="relative block h-[380px] w-full overflow-hidden md:hidden">
        <Image
          src={VisualsResultsBgImg}
          alt={t('imageAlt')}
          fill
          sizes="100vw"
          className="animate-slow-scale object-cover object-[78%_center]"
          priority
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070503] via-[#070503]/50 to-transparent" />
      </div>

      {/* Editorial Content Column - Positioned on the LEFT side of the screen */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1500px] items-center justify-start px-6 py-12 sm:px-12 md:justify-start md:px-[clamp(48px,5vw,80px)] md:py-0 rtl:justify-end">
        {/* Editorial column: text occupies approx 38% on the left */}
        <div className="flex w-full flex-col items-start gap-7 text-left md:max-w-[440px] rtl:text-right">
          {/* Kicker: Signature Botanical */}
          <div className="flex items-center gap-3 text-[13px] font-light tracking-[0.30em] text-[#F7F3ED]/68 uppercase select-none">
            <span>{t('eyebrow')}</span>
            <span
              className="inline-block h-[1px] w-16"
              style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
            />
          </div>

          {/* Headline */}
          <h2
            className="text-[34px] leading-[1.02] font-light tracking-tight text-[#FAF8F4] select-none sm:text-[44px] md:text-[52px] lg:text-[68px]"
            style={{
              fontFamily: isAR
                ? 'var(--font-noto-naskh-arabic), serif'
                : 'var(--font-cormorant-garamond), serif',
              textShadow: '0 2px 20px rgba(0,0,0,0.35)',
            }}
          >
            {isAR ? (
              t('title')
            ) : (
              <>
                {'Beauty from'}
                <br />
                {'the '}
                <span className="font-normal text-[#C5BC9F] italic">Dragon&apos;s</span>
                <br />
                {'Blood'}
              </>
            )}
          </h2>

          {/* Supporting Paragraph */}
          <p
            className="max-w-[440px] text-[16px] leading-[1.7] font-light text-[#F7F3ED]/82 md:text-[18px]"
            style={{
              fontFamily: isAR ? 'var(--font-ibm-plex-arabic), sans-serif' : undefined,
            }}
          >
            {t('description')}
          </p>

          {/* CTA Link */}
          <div className="pt-2">
            <Link
              href={isAR ? '/ar/our-story' : '/en/our-story'}
              className="group relative inline-flex flex-col items-start py-1 text-[14px] font-light tracking-[0.18em] text-[#F7F3ED] outline-none focus-visible:ring-1 focus-visible:ring-[#F7F3ED]"
              style={{
                fontFamily: isAR
                  ? 'var(--font-ibm-plex-arabic), sans-serif'
                  : 'var(--font-jost), sans-serif',
              }}
            >
              <div className="flex items-center">
                <span>{isAR ? 'اكتشف قصتنا' : 'DISCOVER OUR STORY'}</span>
                <span className="ml-2.5 inline-block text-[#F7F3ED]/80 transition-transform duration-500 group-hover:translate-x-[4px] rtl:mr-2.5 rtl:ml-0 rtl:group-hover:-translate-x-[4px]">
                  {isAR ? '←' : '→'}
                </span>
              </div>
              <div className="relative mt-2 h-[1px] w-[160px] bg-[#F7F3ED]/30 transition-all duration-500 ease-out group-hover:w-[180px] group-hover:bg-[#F7F3ED]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
