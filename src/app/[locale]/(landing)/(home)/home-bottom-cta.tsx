'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import bgImage from '@/assets/image/bottom-cta-bg-image.jpg'

export const HomeBottomCta = () => {
  const t = useTranslations('home.homeBottomCta')
  const locale = useLocale()
  const isAR = locale === 'ar'

  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[85vh] min-h-[600px] w-full items-center justify-center overflow-hidden text-white md:min-h-[700px]"
      aria-label={t('eyebrow')}
    >
      {/* 1. Immersive Full-Bleed Luxury Background Image with Cinematic Ken Burns Zoom */}
      <Image
        src={bgImage}
        alt="Woman with glowing skin holding ELARA bottle under soft olive tree shadows"
        fill
        className={cn(
          'object-cover object-center transition-transform duration-[8000ms] ease-out',
          isVisible ? 'scale-105' : 'scale-100'
        )}
        priority
      />

      {/* 2. Premium Multi-Layer Vignette Overlay */}
      {/* Soft warm/dark radial vignette focusing on the center content while ensuring the beautiful model & product are perfectly visible */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,46,26,0.25)_0%,rgba(10,18,10,0.65)_100%)]" />

      {/* Editorial top and bottom dark gradients to anchor the layout in the page stream */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1A2E1A]/45 via-transparent to-[#0A120A]/75" />

      {/* Elegant light leak highlight behind text */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,248,244,0.08)_0%,transparent_60%)]" />

      {/* 3. Luxurious Editorial Content Block */}
      <div className="relative z-10 container mx-auto max-w-4xl px-6 text-center md:px-12">
        <div
          className={cn(
            'cubic-bezier(0.16, 1, 0.3, 1) flex flex-col items-center justify-center transition-all duration-[1400ms]',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          )}
        >
          {/* Eyebrow */}
          <span
            className={cn(
              'mb-5 block font-sans text-[11px] font-medium text-[#D1E2D1] uppercase select-none md:mb-6',
              isAR ? '' : 'tracking-[0.4em]'
            )}
            style={{
              fontFamily: isAR
                ? 'var(--font-ibm-plex-arabic), sans-serif'
                : 'var(--font-lato), sans-serif',
            }}
          >
            {t('eyebrow')}
          </span>

          {/* Title - "A Symphony of Dermal Harmony" */}
          <h2
            className="text-ivory text-3.5xl mb-6 max-w-3xl font-serif leading-[1.25] font-light tracking-tight sm:text-5xl md:mb-8 md:text-6xl lg:text-7xl"
            style={{
              fontFamily: isAR
                ? 'var(--font-ibm-plex-arabic), sans-serif'
                : 'var(--font-cormorant-garamond), serif',
            }}
          >
            {t('title')}
          </h2>

          {/* Elegant Fine-Art Divider */}
          <div className="mb-8 h-[1px] w-24 bg-gradient-to-r from-transparent via-[#FAF8F4]/30 to-transparent md:mb-10" />

          {/* Narrative */}
          <p
            className="mb-12 max-w-2xl font-sans text-base leading-[1.8] font-light text-[#E2ECE2] drop-shadow-sm sm:text-lg"
            style={{
              fontFamily: isAR
                ? 'var(--font-ibm-plex-arabic), sans-serif'
                : 'var(--font-lato), sans-serif',
            }}
          >
            {t('desc')}
          </p>

          {/* Call to Action Pill Button */}
          <div className="transform transition-transform duration-300 hover:scale-102">
            <Link
              href={isAR ? '/ar/skin-analyzer' : '/en/skin-analyzer'}
              className={cn(
                'border-ivory bg-ivory text-deep-green hover:border-gold/70 hover:text-deep-green inline-flex items-center justify-center rounded-none border px-12 py-4 font-sans text-xs font-semibold shadow-xl transition-all duration-500 outline-none hover:bg-[#F3EFEA] hover:shadow-[0_0_30px_rgba(250,248,244,0.3)] focus-visible:ring-2 focus-visible:ring-white',
                isAR ? '' : 'tracking-[0.25em] uppercase'
              )}
              style={{
                fontFamily: isAR
                  ? 'var(--font-ibm-plex-arabic), sans-serif'
                  : 'var(--font-lato), sans-serif',
              }}
            >
              {t('cta_button_text')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
