'use client'

import heroAuthenticSkin from '@/assets/image/hero-authentic-skin.png'
import { cn } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {} & React.ComponentPropsWithRef<'section'>

export const NewComingSoonHero = ({ className, ...props }: Props) => {
  const t = useTranslations('home.hero')
  const locale = useLocale()
  const isAR = locale === 'ar'

  // Read locale keys
  const kickerText = t('kicker')
  const headlineText = t('headline')
  const subheadText = t('subhead')
  const ctaText = t('cta')

  // Typography definitions matching luxury standards
  const arTitleFont = 'var(--font-ibm-plex-arabic), sans-serif'
  const arBodyFont = 'var(--font-ibm-plex-arabic), sans-serif'
  const enTitleFont = 'var(--font-cormorant-garamond), var(--font-jost), serif'
  const enBodyFont = 'var(--font-inter), var(--font-jost), sans-serif'

  return (
    <>
      <style>{`
        /* Slow-breathing environmental background haze */
        @keyframes atmosphericBreathe {
          0% {
            opacity: 0.28;
            transform: scale(1);
          }
          50% {
            opacity: 0.38;
            transform: scale(1.04);
          }
          100% {
            opacity: 0.28;
            transform: scale(1);
          }
        }

        /* Highly restrained editorial reveal */
        @keyframes luxuryReveal {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cinematic-reveal-group .cinematic-item {
          opacity: 0;
          animation: luxuryReveal 1400ms cubic-bezier(0.15, 0.85, 0.3, 1) forwards;
        }

        .cinematic-reveal-group .item-1 { animation-delay: 150ms; }
        .cinematic-reveal-group .item-2 { animation-delay: 350ms; }
        .cinematic-reveal-group .item-3 { animation-delay: 550ms; }

        @media (prefers-reduced-motion: reduce) {
          .cinematic-item {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        }

        /* Microscopic Texture Haze Overlay */
        .cinematic-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.015;
          mix-blend-mode: overlay;
        }

        /* Luxury Collectible CTA Button */
        .hero-collectible-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #1A1A1A;
          color: #FAF8F4;
          border: 1px solid #1A1A1A;
          font-weight: 400;
          text-transform: uppercase;
          transition: all 500ms cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .hero-collectible-cta:hover {
          background: #2B2B2B;
          border-color: #2B2B2B;
          color: #ffffff;
          box-shadow: 0 4px 20px rgba(26, 26, 26, 0.12);
        }

        .hero-collectible-cta:focus-visible {
          outline: 1px solid #1A1A1A;
          outline-offset: 4px;
        }
      `}</style>

      <section
        className={cn(
          'relative h-[85vh] max-h-[960px] min-h-[640px] w-full overflow-hidden bg-[#F5F5F3] select-none lg:min-h-200',
          className
        )}
        style={{
          direction: isAR ? 'rtl' : 'ltr',
        }}
        {...props}
      >
        {/* ── Layer 1: Base Canvas ── */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[#F5F5F3]" />

        {/* ── Layer 2: Refined Skin Visual (Attached Photography) ── */}
        <div className="pointer-events-none absolute inset-0 z-[1] h-full w-full">
          <Image
            src={heroAuthenticSkin}
            alt="Environmental Intelligence — Glowmi"
            fill
            className={cn(
              'object-cover transition-transform duration-1000 ease-out',
              isAR
                ? 'object-[80%_center] md:object-[75%_center] lg:object-[80%_center]'
                : 'object-[20%_center] md:object-[18%_center] lg:object-[15%_center]'
            )}
            priority
            quality={95}
          />
        </div>

        {/* ── Layer 3: Soft Mobile & Desktop Ambient Scrim for Legibility ── */}
        <div
          className="pointer-events-none absolute inset-0 z-[3]"
          style={{
            background: isAR
              ? 'linear-gradient(to left, rgba(245, 245, 243, 0.94) 0%, rgba(245, 245, 243, 0.75) 45%, rgba(245, 245, 243, 0.15) 85%, transparent 100%)'
              : 'linear-gradient(to right, transparent 0%, rgba(245, 245, 243, 0.15) 20%, rgba(245, 245, 243, 0.8) 55%, rgba(245, 245, 243, 0.96) 100%)',
          }}
        />

        {/* Mobile vertical gradient scrim */}
        <div
          className="pointer-events-none absolute inset-0 z-[4] lg:hidden"
          style={{
            background:
              'linear-gradient(to top, rgba(245, 245, 243, 0.95) 0%, rgba(245, 245, 243, 0.7) 60%, transparent 100%)',
          }}
        />

        {/* ── Layer 4: Film Grain Overlay ── */}
        <div className="cinematic-grain pointer-events-none absolute inset-0 z-[5]" />

        {/* ── Layer 5: Editorial Content Block ── */}
        <div className="absolute inset-0 z-10 flex h-full w-full flex-col justify-end px-6 py-12 sm:px-10 md:px-16 md:py-16 lg:justify-center lg:px-24 lg:py-20">
          <div
            className={cn(
              'mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12',
              isAR ? 'text-right' : 'text-left'
            )}
          >
            {/* Content Column placed on the clean studio background side */}
            <div
              className={cn(
                'cinematic-reveal-group flex flex-col gap-5 md:gap-6 lg:col-span-5',
                isAR ? 'lg:col-start-1' : 'lg:col-start-8'
              )}
            >
              {/* Eyebrow / Kicker */}
              {kickerText && (
                <div className="cinematic-item item-1">
                  <span
                    className="block text-[11px] leading-[1.2] font-[var(--font-inter),sans-serif] font-normal tracking-[0.18em] text-[#8C8C8C] uppercase"
                    style={{
                      fontFamily: isAR ? arBodyFont : enBodyFont,
                      letterSpacing: isAR ? '0' : '0.18em',
                    }}
                  >
                    {kickerText}
                  </span>
                </div>
              )}

              {/* Main Headline */}
              {headlineText && (
                <div className="cinematic-item item-2">
                  <h1
                    className="text-[36px] leading-[1.1] font-light tracking-[-0.02em] text-[#1A1A1A] sm:text-[46px] md:text-[54px] lg:text-[60px]"
                    style={{
                      fontFamily: isAR ? arTitleFont : enTitleFont,
                    }}
                  >
                    {headlineText}
                  </h1>
                </div>
              )}

              {/* Supporting Copy & CTA */}
              <div className="cinematic-item item-3 flex max-w-[480px] flex-col gap-6 md:gap-8">
                {subheadText && (
                  <p
                    className="text-[15px] leading-[1.6] font-[var(--font-inter),sans-serif] font-normal text-[#4A4A4A] md:text-[16px]"
                    style={{
                      fontFamily: isAR ? arBodyFont : enBodyFont,
                    }}
                  >
                    {subheadText}
                  </p>
                )}

                {/* Collectible Button */}
                {ctaText && (
                  <div className="pt-2">
                    <Link
                      href="/products"
                      className="hero-collectible-cta rounded-none px-10 py-4 text-[11px] tracking-[0.2em]"
                      style={{
                        fontFamily: isAR ? arBodyFont : enBodyFont,
                        letterSpacing: isAR ? '0' : '0.2em',
                      }}
                    >
                      <span>{ctaText}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
