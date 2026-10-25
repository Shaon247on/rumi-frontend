'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'

import skinDay0 from '@/assets/image/skin-timeline/skin-day-0.png'
import skin7Days from '@/assets/image/skin-timeline/skin-7-days.png'
import skin30Days from '@/assets/image/skin-timeline/skin-30-days.png'
import skin90Days from '@/assets/image/skin-timeline/skin-90-days.png'

type StageInfo = {
  label: string
  quote: string
  stat: string
}

type TransformationProps = {
  eyebrow: string
  stages: {
    day0: StageInfo
    week1: StageInfo
    month1: StageInfo
    month3: StageInfo
  }
  clinicalNote: string
}

const skinImages = [skinDay0, skin7Days, skin30Days, skin90Days]

export default function Transformation({ eyebrow, stages, clinicalNote }: TransformationProps) {
  const locale = useLocale()
  const isRTL = locale === 'ar'

  const sectionRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const timelineLineRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const [activeStage, setActiveStage] = useState<number>(0)
  const [scrollProgress, setScrollProgress] = useState<number>(0)

  const stageList = [stages.day0, stages.week1, stages.month1, stages.month3]

  useEffect(() => {
    if (typeof window === 'undefined') return

    gsap.registerPlugin(ScrollTrigger)

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // GSAP ScrollTrigger for 400vh pinning
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: pinRef.current,
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress
          setScrollProgress(progress)

          // Calculate current active stage based on scroll progress
          let currentStage = 0
          if (progress >= 0.7) {
            currentStage = 3
          } else if (progress >= 0.45) {
            currentStage = 2
          } else if (progress >= 0.2) {
            currentStage = 1
          } else {
            currentStage = 0
          }

          setActiveStage(currentStage)

          // Update timeline fill line height (0% -> 100%)
          if (timelineLineRef.current) {
            timelineLineRef.current.style.height = `${Math.min(100, Math.max(0, progress * 100))}%`
          }

          // Image parallax effect inside container (0.85x speed)
          if (imageContainerRef.current) {
            const parallaxY = (progress - 0.5) * 40 * 0.85
            gsap.set(imageContainerRef.current, { y: parallaxY })
          }
        },
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] w-full bg-[#FAF9F6] text-[#2C2A29] selection:bg-[#E6DFD5]"
      aria-label="Glowmi Quiet Luxury Skin Transformation Experience"
    >
      {/* ── BARELY-PERCEPTIBLE SVG NOISE TEXTURE OVERLAY (1.5% Opacity) ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── WARM FILM GRAIN OVERLAY (2.5% Opacity) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[#D4AF37]/10 opacity-[0.025] mix-blend-overlay" />

      {/* ── PINNED STICKY VIEWPORT CONTAINER ── */}
      <div
        ref={pinRef}
        className="relative z-10 flex h-screen w-full flex-col justify-between overflow-hidden px-4 py-6 sm:px-8 sm:py-8 md:px-16 md:py-10"
      >
        {/* Top Header Eyebrow */}
        <div className="z-20 w-full text-center">
          <span
            className={cn(
              'font-mono text-[11px] font-medium text-[#8C8275] uppercase md:text-[12px]',
              isRTL ? 'tracking-normal' : 'tracking-[0.25em]'
            )}
          >
            {eyebrow}
          </span>
        </div>

        {/* Center Content Stage */}
        <div className="relative mx-auto flex w-full max-w-[1180px] flex-1 flex-col items-center justify-center py-4">
          {/* ── LEFT VERTICAL PRECISION TIMELINE (Desktop) ── */}
          <div
            className={cn(
              'absolute top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center md:flex',
              isRTL ? 'right-0 lg:-right-6' : 'left-0 lg:-left-6'
            )}
          >
            <div className="relative flex h-[280px] flex-col items-center justify-between">
              {/* 1px Charcoal Base Vertical Line */}
              <div className="absolute top-0 bottom-0 w-[1px] bg-[#E6DFD5]" />

              {/* Dynamic Champagne Gold Progressive Fill Line */}
              <div
                ref={timelineLineRef}
                className="absolute top-0 w-[1px] bg-[#9F8A6B] transition-all duration-300 ease-out"
                style={{ height: '0%' }}
              />

              {/* 4 Precision Timeline Nodes */}
              {stageList.map((stage, idx) => {
                const isActive = activeStage === idx
                return (
                  <div key={idx} className="relative flex items-center gap-4">
                    {/* Node Dot / Ring */}
                    <div className="relative flex items-center justify-center">
                      {isActive ? (
                        <div className="relative flex items-center justify-center">
                          {/* Breathing Pulse Ring (Scale 1 -> 1.3 over 3s, infinite) */}
                          <span className="absolute size-5 animate-ping rounded-full border border-[#9F8A6B] opacity-60 duration-1000" />
                          <span className="relative size-3 rounded-full border-[1.5px] border-[#9F8A6B] bg-[#FAF9F6] shadow-[0_0_12px_rgba(159,138,107,0.5)] transition-all duration-500" />
                        </div>
                      ) : (
                        <span
                          className={cn(
                            'size-1.5 rounded-full transition-colors duration-500',
                            scrollProgress * 3 >= idx ? 'bg-[#9F8A6B]' : 'bg-[#B8B0A5]'
                          )}
                        />
                      )}
                    </div>

                    {/* Node Text Label */}
                    <span
                      className={cn(
                        'absolute font-mono text-[11px] whitespace-nowrap uppercase transition-all duration-500',
                        isRTL ? 'right-6 text-right' : 'left-6 text-left',
                        isActive
                          ? 'font-medium text-[#1A1918]'
                          : 'font-normal text-[#8C8275] opacity-60'
                      )}
                      style={{ letterSpacing: '0.1em' }}
                    >
                      {stage.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── CENTER MACRO IMAGE CONTAINER (16:9, rounded-24px) ── */}
          <div className="relative w-full max-w-[940px] px-2">
            <div
              ref={imageContainerRef}
              className="relative aspect-[16/9] w-full overflow-hidden rounded-[24px] border border-[#E6DFD5] bg-[#EBE8E3] shadow-[0_20px_50px_rgba(26,25,24,0.06)] transition-all duration-700"
            >
              {/* Vignette Shadow Overlay (Intensifies slightly on stage transition) */}
              <div
                className={cn(
                  'pointer-events-none absolute inset-0 z-20 transition-opacity duration-700',
                  'bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_50%,rgba(26,25,24,0.25)_100%)]'
                )}
              />

              {/* 4 Stage Photography Layer Crossfades */}
              {skinImages.map((imgSrc, idx) => {
                const isActive = activeStage === idx
                return (
                  <div
                    key={idx}
                    className={cn(
                      'absolute inset-0 h-full w-full transition-all duration-[1200ms] ease-out',
                      isActive
                        ? 'blur-0 z-10 scale-100 opacity-100'
                        : 'z-0 scale-[1.03] opacity-0 blur-[4px]'
                    )}
                  >
                    <Image
                      src={imgSrc}
                      alt={`Glowmi skin transformation stage ${idx + 1}`}
                      fill
                      priority={idx === 0}
                      sizes="(max-width: 1200px) 100vw, 940px"
                      className="object-cover object-center brightness-[0.98] contrast-[1.01] filter"
                    />
                  </div>
                )
              })}

              {/* Bottom-Right Micro Scientific Stat Badge */}
              <div
                className={cn(
                  'absolute right-4 bottom-4 z-30 rounded-full border border-[#FAF9F6]/30 bg-[#1A1918]/60 px-3.5 py-1.5 backdrop-blur-md transition-all duration-700 md:right-6 md:bottom-6',
                  isRTL ? 'right-auto left-4 md:right-auto md:left-6' : ''
                )}
              >
                <div className="overflow-hidden">
                  {stageList.map((stg, idx) => (
                    <span
                      key={idx}
                      className={cn(
                        'block font-mono text-[10px] uppercase transition-all duration-500 md:text-[11px]',
                        activeStage === idx
                          ? 'translate-y-0 opacity-100'
                          : 'pointer-events-none absolute inset-0 translate-y-2 opacity-0'
                      )}
                      style={{ letterSpacing: '0.1em', color: '#E8E3DB' }}
                    >
                      {stg.stat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── BELOW IMAGE: STAGGERED ELEGANT ITALIC QUOTE (NO COLLISION / OVERLAP) ── */}
          <div className="relative z-20 mt-6 flex min-h-[56px] w-full max-w-[720px] items-center justify-center text-center sm:mt-8 sm:min-h-[64px]">
            {stageList.map((stg, idx) => {
              const isActive = activeStage === idx
              const words = stg.quote.split(' ')

              return (
                <div
                  key={idx}
                  className={cn(
                    'absolute inset-x-0 mx-auto px-4 transition-all duration-700 ease-out',
                    isActive
                      ? 'pointer-events-auto translate-y-0 opacity-100'
                      : 'pointer-events-none -translate-y-3 opacity-0'
                  )}
                >
                  <h3
                    className={cn(
                      'text-[20px] leading-[1.4] font-extralight text-[#1A1918] sm:text-[26px] md:text-[32px]',
                      isRTL ? 'font-normal' : 'italic'
                    )}
                    style={{
                      fontFamily: isRTL
                        ? 'var(--font-amiri), serif'
                        : 'var(--font-cormorant-garamond), serif',
                    }}
                  >
                    “
                    {words.map((word, wIdx) => (
                      <span
                        key={wIdx}
                        className={cn(
                          'inline-block transition-all duration-500 ease-out',
                          isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        )}
                        style={{
                          transitionDelay: isActive ? `${wIdx * 30}ms` : '0ms',
                        }}
                      >
                        {word}&nbsp;
                      </span>
                    ))}
                    ”
                  </h3>
                </div>
              )
            })}
          </div>

          {/* ── MOBILE HORIZONTAL TIMELINE (Top/Bottom Responsive) ── */}
          <div className="mt-6 flex items-center justify-center gap-6 md:hidden">
            {stageList.map((stage, idx) => {
              const isActive = activeStage === idx
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div
                    className={cn(
                      'size-2 rounded-full transition-all duration-500',
                      isActive
                        ? 'scale-125 bg-[#9F8A6B] shadow-[0_0_8px_rgba(159,138,107,0.6)]'
                        : 'bg-[#B8B0A5]'
                    )}
                  />
                  <span
                    className={cn(
                      'font-mono text-[10px] uppercase transition-colors duration-500',
                      isActive ? 'font-medium text-[#1A1918]' : 'text-[#8C8275]'
                    )}
                  >
                    {stage.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Clinical Note Disclaimer */}
        <div className="z-20 w-full pb-2 text-center">
          <p className="font-sans text-[11px] font-light text-[#8C8275] opacity-75">
            {clinicalNote}
          </p>
        </div>
      </div>
    </section>
  )
}
