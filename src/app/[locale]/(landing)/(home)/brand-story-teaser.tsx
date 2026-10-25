'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

const EditorialOrnament = () => (
  <svg
    className="text-gold mx-auto mb-6 h-5 w-5 opacity-80 transition-all duration-1000 ease-out hover:scale-110"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
  >
    <path
      d="M12 2C12 2 13 8 15 10C17 12 22 12 22 12C22 12 17 12 15 14C13 16 12 22 12 22C12 22 11 16 9 14C7 12 2 12 2 12C2 12 7 12 9 10C11 8 12 2 12 2Z"
      fill="currentColor"
      fillOpacity="0.08"
    />
  </svg>
)

export const BrandStoryTeaser = () => {
  const t = useTranslations('home.brandStoryTeaser')
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
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-ivory w-full overflow-hidden border-y border-[#EBE8E2] py-16 md:py-24 lg:py-32"
      aria-label={t('eyebrow')}
    >
      <div className="container mx-auto max-w-5xl px-6 md:px-12">
        {/* Editorial Title Block */}
        <div
          className={cn(
            'mx-auto mt-0 max-w-3xl text-center transition-all delay-200 duration-[1000ms] ease-out',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
        >
          {/* Luxury Star Ornament */}
          <EditorialOrnament />

          {/* Eyebrow */}
          <span
            className={cn(
              'text-dark-brown/70 mb-4 block font-sans text-[11px] font-medium tracking-[0.25em] uppercase md:mb-6',
              isAR ? '' : 'tracking-[0.35em]'
            )}
            style={{
              fontFamily: isAR ? 'var(--font-amiri), serif' : 'var(--font-lato), sans-serif',
            }}
          >
            {t('eyebrow')}
          </span>

          {/* Heading with exquisite luxury styling */}
          <h2
            className="text-3.5xl text-charcoal mx-auto mb-12 max-w-2xl font-serif leading-[1.2] font-extralight sm:text-4xl md:text-5xl lg:text-6xl"
            style={{
              fontFamily: isAR
                ? 'var(--font-amiri), serif'
                : 'var(--font-cormorant-garamond), serif',
            }}
          >
            {t('title')}
          </h2>

          {/* Subtle gold line divider */}
          <div className="bg-gold mx-auto mb-12 h-[1px] w-16 opacity-60" />
        </div>

        {/* Refined Direct Editorial Narrative */}
        <div
          className={cn(
            'mx-auto max-w-2xl text-center transition-all delay-400 duration-[1200ms] ease-out',
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          )}
        >
          <p
            className="text-charcoal/85 font-sans text-[16px] leading-[1.85] font-light sm:text-[17px] md:text-[18px]"
            style={{
              fontFamily: isAR
                ? 'var(--font-ibm-plex-arabic), sans-serif'
                : 'var(--font-lato), sans-serif',
            }}
          >
            {t('body')}
          </p>

          {/* Elegant Understated Link with refined gap */}
          <div className="mt-8 border-t border-[#EBE8E2]/60 pt-6 text-center">
            <Link
              href={isAR ? '/ar/our-story' : '/en/our-story'}
              className={cn(
                'group text-deep-green focus-visible:ring-deep-green relative inline-flex items-center py-1.5 font-sans text-[13px] font-medium transition-all duration-300 outline-none focus-visible:ring-1',
                isAR ? '' : 'tracking-[0.25em] uppercase'
              )}
              style={{
                fontFamily: isAR
                  ? 'var(--font-ibm-plex-arabic), sans-serif'
                  : 'var(--font-lato), sans-serif',
              }}
            >
              <span>{t('cta')}</span>
              <span className="text-gold ml-2.5 inline-block text-[12px] transition-transform duration-300 group-hover:translate-x-1.5 rtl:mr-2.5 rtl:ml-0 rtl:group-hover:-translate-x-1.5">
                {isAR ? '←' : '→'}
              </span>
              {/* Subtle underline default, luxury warm gold on hover */}
              <span className="absolute bottom-0 left-0 h-[1px] w-full bg-[#EBE8E2]" />
              <span className="bg-gold absolute bottom-0 left-0 h-[1.5px] w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 rtl:origin-right" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
