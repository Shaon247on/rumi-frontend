'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

// Import assets
import heroBg from '@/assets/image/about/our-story-hero.png'
import about03 from '@/assets/image/about/about-03.png'
import scienceImg from '@/assets/image/about/our-story-science.png'

/* ─── Scroll-Spy Animated Component ─── */
type AnimationType = 'fade-up' | 'scale-up' | 'reveal-right' | 'reveal-left' | 'text-mask'

const ScrollReveal = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 1000,
  className,
}: {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      const timer = setTimeout(() => setIsIntersecting(true), 0)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -80px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-up':
        return isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      case 'scale-up':
        return isIntersecting ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
      case 'reveal-right':
        return isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      case 'reveal-left':
        return isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
      case 'text-mask':
        return isIntersecting ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      default:
        return ''
    }
  }

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all ease-[cubic-bezier(0.25,1,0.5,1)]',
        getAnimationClass(),
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function OurStoryPage() {
  const t = useTranslations('ourStory')
  const locale = useLocale()
  const isAR = locale === 'ar'

  // Dynamic typography settings
  const fontSans = isAR ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-lato), sans-serif'
  const fontSerif = isAR
    ? 'var(--font-noto-naskh-arabic), serif'
    : 'var(--font-cormorant-garamond), serif'

  return (
    <>
      <style>{`
 /* Luxury editorial helper classes */
 .clip-path-reveal-full {
 clip-path: inset(0 0 0 0);
 }
 .clip-path-reveal-none {
 clip-path: inset(0 100% 0 0);
 }
 .clip-path-reveal-full-rtl {
 clip-path: inset(0 0 0 0);
 }
 .clip-path-reveal-none-rtl {
 clip-path: inset(0 0 0 100%);
 }

 .editorial-image-container::after {
 content: '';
 position: absolute;
 inset: 0;
 background: linear-gradient(180deg, rgba(26, 46, 26, 0) 60%, rgba(26, 46, 26, 0.15) 100%);
 pointer-events: none;
 }

 @media (prefers-reduced-motion: reduce) {
 .clip-path-reveal-full, .clip-path-reveal-none, .clip-path-reveal-full-rtl, .clip-path-reveal-none-rtl {
 clip-path: none !important;
 }
 }
 `}</style>

      <main
        className="w-full overflow-hidden bg-[var(--color-ivory)] text-[var(--color-charcoal)] selection:bg-[var(--color-deep-green)] selection:text-[var(--color-ivory)]"
        style={{ fontFamily: fontSans }}
      >
        {/* ─── SECTION 1: THE HERO (CINEMATIC) ─── */}
        <section
          className="relative flex h-[85vh] w-full items-end overflow-hidden bg-[#EAE7E2] selection:bg-white/25 selection:text-white"
          aria-label={t('hero.tagline')}
        >
          {/* Background Image - Framing, crop, shadow */}
          <div className="absolute inset-0 z-0 scale-102 transition-transform duration-10000 ease-out hover:scale-100">
            <Image
              src={heroBg}
              alt={t('hero.imageAlt')}
              fill
              priority
              quality={100}
              className="object-cover object-[center_65%] brightness-[0.85] contrast-[1.02] filter"
            />
            {/* Elegant Amber-Dark Shadow Overlay to embed typography in the landscape */}
            <div className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-t from-[#14120F]/90 via-[#14120F]/40 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-48 bg-gradient-to-t from-[var(--color-ivory)] via-[var(--color-ivory)]/30 to-transparent" />
          </div>

          {/* Cinematic Copy Bottom-Aligned */}
          <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-start px-6 pb-20 md:pb-24 lg:px-16 rtl:justify-end">
            <div className="max-w-[850px] text-start lg:max-w-[1100px] rtl:text-right">
              {/* Eyebrow Label */}
              <ScrollReveal animation="fade-up" delay={150}>
                <span
                  className={cn(
                    'mb-5 block text-xs font-light tracking-[0.25em] text-[#F5F3EF]/70 uppercase',
                    isAR ? 'tracking-[0.1em]' : ''
                  )}
                >
                  {t('hero.eyebrow')}
                </span>
              </ScrollReveal>

              {/* Tagline */}
              <ScrollReveal animation="fade-up" delay={300} duration={1200}>
                <h1
                  className="xs:text-[6.5vw] mb-6 text-[6.8vw] leading-[1.05] font-light tracking-tight whitespace-nowrap text-white sm:text-5xl md:text-6xl lg:text-[4.8rem] xl:text-[5.5rem]"
                  style={{ fontFamily: fontSerif }}
                >
                  {isAR ? (
                    t('hero.tagline')
                  ) : (
                    <>
                      The Essence of <span className="font-normal text-[#F5F3EF]/90">Timeless</span>{' '}
                      Glow
                    </>
                  )}
                </h1>
              </ScrollReveal>

              {/* Subline */}
              <ScrollReveal animation="fade-up" delay={450} duration={1000}>
                <p
                  className="max-w-[580px] text-base leading-relaxed font-light text-balance text-[#F5F3EF]/85 md:text-xl"
                  style={{ lineHeight: isAR ? '1.9' : '1.8' }}
                >
                  {t('hero.subline')}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ─── SECTION 2: EDITORIAL ESSAY (LEGACY) ─── */}
        <section
          className="relative w-full overflow-hidden bg-[var(--color-ivory)] py-16 md:py-24 lg:py-28"
          aria-label={t('legacy.heading')}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-16">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-20">
              {/* Large left whitespace on desktop, section label & headline column */}
              <div className="flex h-full flex-col justify-between pt-2 lg:col-span-4">
                <ScrollReveal animation="fade-up">
                  <span className="mb-4 block text-xs font-light tracking-[0.2em] text-[var(--color-deep-green)] uppercase">
                    {t('legacy.eyebrow')}
                  </span>
                  <h2
                    className="text-3xl leading-[1.1] font-light text-balance text-[var(--color-charcoal)] md:text-5xl lg:text-6xl"
                    style={{ fontFamily: fontSerif }}
                  >
                    {isAR ? (
                      t('legacy.heading')
                    ) : (
                      <>
                        An unspoken <span className="">dialogue</span> with the desert.
                      </>
                    )}
                  </h2>
                </ScrollReveal>
              </div>

              {/* Content Column with premium magazine essay style */}
              <div className="lg:col-span-8 lg:pl-12 rtl:lg:pr-12 rtl:lg:pl-0">
                <ScrollReveal animation="fade-up" delay={200} duration={1200}>
                  <div className="max-w-[640px] text-start rtl:text-right">
                    <p
                      className="text-lg leading-relaxed font-light text-balance text-[#3A3A3C] md:text-2xl"
                      style={{
                        lineHeight: isAR ? '2' : '1.85',
                      }}
                    >
                      {t('legacy.body')}
                    </p>
                    <div className="mt-8 h-px w-24 bg-[var(--color-deep-green)]/20" />
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 3: IMMERSIVE CINEMATIC VIDEO (ELARA DESERT) ─── */}
        <section className="w-full bg-[var(--color-ivory)] pb-24 md:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-16">
            <ScrollReveal
              animation="fade-up"
              duration={1200}
              className="relative aspect-[2.1/1] w-full overflow-hidden rounded-[2px] bg-[#EAE7E2] shadow-[0_24px_56px_rgba(20,18,15,0.06)]"
            >
              <video
                src="/elara desert.mp4"
                className="h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14120F]/30 via-transparent to-transparent" />
            </ScrollReveal>
            {/* Subtle video caption */}
            <div className="mt-6 flex justify-end">
              <span className="text-xs font-light tracking-wide text-[#8E8E93]">
                {isAR ? 'جلومي هيريتيج — الصحراء والضوء' : 'Glowmi Heritage — Elara Desert'}
              </span>
            </div>
          </div>
        </section>

        {/* ─── SECTION 4: MINIMAL QUOTE (BREATHING SPACE) ─── */}
        <section
          className="flex w-full items-center justify-center border-t border-b border-[#EAE7E2] bg-[var(--color-ivory)] py-32 text-center md:py-48"
          aria-label="Core Creed"
        >
          <div className="mx-auto max-w-4xl px-6">
            <ScrollReveal animation="scale-up" duration={1200}>
              <span className="mb-10 block text-xs font-light tracking-[0.25em] text-[var(--color-deep-green)] uppercase">
                {t('quote.author')}
              </span>
              <blockquote
                className="mb-8 text-2xl leading-[1.3] font-light text-balance text-[#2C2C2E] md:text-5xl"
                style={{ fontFamily: fontSerif }}
              >
                &ldquo;{t('quote.text')}&rdquo;
              </blockquote>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── SECTION 5: SCIENTIFIC STORY (THE SUSPENDED SERUM) ─── */}
        <section
          id="science"
          className="relative flex min-h-[90vh] w-full items-center overflow-hidden bg-[var(--color-ivory)] py-20 selection:bg-white/25 selection:text-white lg:h-screen lg:py-0"
          aria-label={t('science.heading')}
        >
          {/* Scientific Photography with rich layered depth */}
          <div className="absolute inset-0 z-0">
            <Image
              src={scienceImg}
              alt={t('science.imageAlt')}
              fill
              quality={100}
              className="object-cover object-[center_35%] brightness-[0.88] contrast-[1.02] filter"
            />
            {/* Precise layered gradient behind text (Amber-Dark hue) */}
            <div className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-r from-[#14120F]/95 via-[#14120F]/70 to-transparent rtl:bg-gradient-to-l" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-1 w-1/3 bg-gradient-to-l from-[var(--color-ivory)]/20 to-transparent" />
          </div>

          {/* Overlay Text Content embedded inside photography */}
          <div className="relative z-10 mx-auto flex w-full max-w-7xl justify-start px-6 lg:px-16 rtl:justify-end">
            <div className="max-w-[620px] py-10 text-start text-[var(--color-ivory)] rtl:text-right">
              {/* Eyebrow */}
              <ScrollReveal animation="fade-up" delay={100}>
                <span className="mb-5 block text-xs font-light tracking-[0.2em] text-[#F5F3EF]/70 uppercase">
                  {t('science.eyebrow')}
                </span>
              </ScrollReveal>

              {/* Headline */}
              <ScrollReveal animation="fade-up" delay={200} duration={1100}>
                <h2
                  className="mb-8 text-3xl leading-[1.1] font-light text-white md:text-5xl lg:text-6xl"
                  style={{ fontFamily: fontSerif }}
                >
                  {isAR ? (
                    t('science.heading')
                  ) : (
                    <>
                      Science with{' '}
                      <span className="font-normal text-[var(--color-ivory)]/80">Intelligence</span>
                      .
                    </>
                  )}
                </h2>
              </ScrollReveal>

              {/* Paragraph details */}
              <ScrollReveal animation="fade-up" delay={300} duration={1200}>
                <p
                  className="max-w-[540px] text-base leading-relaxed font-light text-balance text-[var(--color-ivory)]/90 md:text-lg"
                  style={{ lineHeight: isAR ? '2' : '1.85' }}
                >
                  {t('science.body')}
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ─── SECTION 6: INGREDIENT FOCUS & MINIMALIST ESSAY ─── */}
        <section
          className="w-full bg-[var(--color-ivory)] py-28 md:py-40"
          aria-label={t('ingredient.heading')}
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            <ScrollReveal animation="fade-up">
              <span className="mb-5 block text-xs font-light tracking-[0.25em] text-[var(--color-deep-green)] uppercase">
                {t('ingredient.eyebrow')}
              </span>
              <h3
                className="mb-8 text-3xl leading-[1.15] font-light text-balance text-[var(--color-charcoal)] md:text-5xl"
                style={{ fontFamily: fontSerif }}
              >
                {t('ingredient.heading')}
              </h3>
              <p
                className="mx-auto max-w-2xl text-base leading-relaxed font-light text-[#48484A] md:text-xl"
                style={{ lineHeight: isAR ? '1.95' : '1.8' }}
              >
                {t('ingredient.body')}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── SECTION 7: BRAND PHILOSOPHY & FOUNDERS (LETTER STORY) ─── */}
        <section className="w-full bg-[#F5F3EF] py-28 md:py-44" aria-label={t('founder.heading')}>
          <div className="mx-auto max-w-7xl px-6 lg:px-16">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-24">
              {/* Left Column: Intimate Essay/Letter style with fine border */}
              <div className="flex h-full flex-col justify-center lg:col-span-7">
                <div className="max-w-[560px] text-start rtl:text-right">
                  <ScrollReveal animation="fade-up">
                    <span className="mb-5 block text-xs font-light tracking-[0.2em] text-[var(--color-deep-green)] uppercase">
                      {t('founder.eyebrow')}
                    </span>
                    <h3
                      className="mb-10 text-3xl leading-[1.1] font-light text-balance text-[var(--color-charcoal)] md:text-5xl"
                      style={{ fontFamily: fontSerif }}
                    >
                      {isAR ? (
                        t('founder.heading')
                      ) : (
                        <>
                          Patience and <span className="font-normal">Intention</span>
                        </>
                      )}
                    </h3>
                  </ScrollReveal>

                  <ScrollReveal animation="fade-up" delay={200} duration={1200}>
                    <p
                      className="mb-12 text-lg leading-relaxed font-light text-balance text-[#3A3A3C] md:text-xl"
                      style={{ lineHeight: isAR ? '2' : '1.9' }}
                    >
                      &ldquo;{t('founder.body')}&rdquo;
                    </p>
                  </ScrollReveal>

                  {/* Elegant Minimal Signature Block */}
                  <ScrollReveal animation="fade-up" delay={350}>
                    <div className="flex max-w-xs flex-col space-y-2 border-t border-[#E5E3E0] pt-6">
                      <span
                        className="text-base font-medium tracking-wide text-[var(--color-charcoal)]"
                        style={{ fontFamily: fontSans }}
                      >
                        {t('founder.names')}
                      </span>
                      <span
                        className="text-xs font-light tracking-widest text-[#8E8E93] uppercase"
                        style={{ fontFamily: fontSans }}
                      >
                        {t('founder.title')}
                      </span>
                    </div>
                  </ScrollReveal>
                </div>
              </div>

              {/* Right Column: Glowmi Monogram Fine-Art Gallery Plaque */}
              <div className="relative mt-6 lg:col-span-5 lg:mt-0">
                <ScrollReveal
                  animation="fade-up"
                  duration={1200}
                  className="relative mx-auto aspect-4/5 w-full max-w-[420px] overflow-hidden rounded-[2px] bg-[#EAE7E2] shadow-[0_24px_56px_rgba(20,18,15,0.06)]"
                >
                  <Image
                    src={about03}
                    alt="Glowmi House Monogram Emblem artwork"
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="scale-102 transform object-cover transition-transform duration-10000 hover:scale-100"
                  />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ─── SECTION 8: BRAND CREED AND MATTE LAYOUT ─── */}
        <section
          className="w-full bg-[var(--color-ivory)] py-28 md:py-40"
          aria-label={t('philosophy.heading')}
        >
          <div className="mx-auto max-w-4xl px-6 text-center">
            <ScrollReveal animation="fade-up">
              <span className="mb-6 block text-xs font-light tracking-[0.25em] text-[var(--color-deep-green)] uppercase">
                {t('philosophy.eyebrow')}
              </span>
              <h3
                className="mb-8 text-3xl leading-[1.2] font-light text-balance text-[var(--color-charcoal)] md:text-5xl"
                style={{ fontFamily: fontSerif }}
              >
                {t('philosophy.heading')}
              </h3>
              <p
                className="mx-auto max-w-2xl text-lg leading-relaxed font-light text-[#48484A] md:text-xl"
                style={{ lineHeight: isAR ? '2' : '1.8' }}
              >
                {t('philosophy.body')}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ─── SECTION 9: FINAL EMOTIONAL STATEMENT (CLOSING) ─── */}
        <section
          id="sustainability"
          className="relative flex w-full items-center justify-center overflow-hidden bg-[var(--color-deep-green)] py-40 text-center text-[#F5F3EF] selection:bg-white/25 selection:text-white md:py-52"
          aria-label={t('closing.tagline')}
        >
          {/* Microscopic golden/amber glow in bottom right/left corner */}
          <div className="pointer-events-none absolute -right-48 -bottom-48 h-96 w-96 rounded-full bg-[#D4AF37]/15 blur-[120px] filter" />
          <div className="pointer-events-none absolute -top-48 -left-48 h-96 w-96 rounded-full bg-[var(--color-deep-green)]/40 blur-[120px] filter" />

          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-6">
            <ScrollReveal
              animation="scale-up"
              duration={1400}
              className="flex w-full flex-col items-center"
            >
              <h3
                className="xs:text-xl mb-8 text-lg leading-tight font-light tracking-[0.08em] text-white uppercase sm:text-2xl sm:tracking-[0.12em] sm:whitespace-nowrap md:text-3xl md:tracking-[0.15em] lg:text-4xl xl:text-5xl"
                style={{ fontFamily: fontSerif }}
              >
                {t('closing.tagline')}
              </h3>

              <div className="my-8 h-px w-20 bg-[var(--color-ivory)]/30" />

              <p
                className="max-w-[650px] text-base leading-relaxed font-light tracking-wide text-[var(--color-ivory)]/80 md:text-xl"
                style={{ lineHeight: isAR ? '1.9' : '1.8' }}
              >
                {t('closing.subline')}
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </>
  )
}
