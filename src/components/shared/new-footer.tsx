'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import React, { useState } from 'react'
import { Logo } from './logo'
import { MapPin, Mail, Lock, ChevronDown } from 'lucide-react'

type Props = {} & React.ComponentPropsWithRef<'footer'>

export const NewFooter = ({ className, ...props }: Props) => {
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const t = useTranslations('shared.footer')

  // Mobile accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    shop: false,
    skinIntelligence: false,
    about: false,
    customerCare: false,
  })

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Links configuration
  const shopLinks = [
    { label: t('sections.shop.allProducts'), href: '/products' },
    { label: t('sections.shop.skincare'), href: '/products?category=skincare' },
    { label: t('sections.shop.bestSellers'), href: '/products?filter=best-sellers' },
    { label: t('sections.shop.newArrivals'), href: '/products?filter=new-arrivals' },
    { label: t('sections.shop.giftSets'), href: '/products?category=gift-sets' },
  ]

  const skinIntelligenceLinks = [
    { label: t('sections.skinIntelligence.analysis'), href: '/coming-soon' },
    { label: t('sections.skinIntelligence.recommendations'), href: '/coming-soon' },
    { label: t('sections.skinIntelligence.ingredients'), href: '/coming-soon' },
    { label: t('sections.skinIntelligence.journal'), href: '/coming-soon' },
  ]

  const aboutLinks = [
    { label: t('sections.about.story'), href: '/coming-soon' },
    { label: t('sections.about.science'), href: '/coming-soon' },
    { label: t('sections.about.sustainability'), href: '/coming-soon' },
    { label: t('sections.about.careers'), href: '/coming-soon' },
  ]

  const customerCareLinks = [
    { label: t('sections.customerCare.faqs'), href: '/coming-soon' },
    { label: t('sections.customerCare.shipping'), href: '/coming-soon' },
    { label: t('sections.customerCare.returns'), href: '/coming-soon' },
    { label: t('sections.customerCare.contact'), href: '/coming-soon' },
  ]

  return (
    <>
      <style>{`
        /* ── Luxury Footer Scoped Styles ──────────────────────────────── */
        .gf-footer {
          background-color: #FBFBFA;
          color: #333333;
          font-family: inherit;
          border-top: 1px solid rgba(26, 46, 26, 0.04);
          transition: all 250ms ease;
          padding-bottom: calc(3rem + var(--sticky-mobile-cta-height, 0px));
        }

        .gf-grid {
          max-width: 1440px;
          margin: 0 auto;
          padding: 96px 56px 80px 56px;
        }

        @media (max-width: 767px) {
          .gf-grid {
            padding: 4rem 1.5rem 3rem 1.5rem !important;
            max-width: 100%;
            box-sizing: border-box;
          }
        }

        /* Desktop column grid */
        .gf-desktop-cols {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 64px;
        }
        @media (max-width: 1279px) {
          .gf-desktop-cols {
            grid-template-columns: repeat(3, 1fr);
            gap: 48px;
          }
        }

        .gf-col-title {
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #333333;
          margin-bottom: 32px;
        }

        .gf-link {
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.06em;
          color: #555555;
          text-decoration: none;
          transition: color 240ms ease;
        }
        .gf-link:hover {
          color: #333333;
        }

        .gf-membership-desc {
          font-size: 14px;
          font-weight: 300;
          color: #333333;
          line-height: 1.6;
          margin-bottom: 0;
        }

        .gf-membership-list {
          list-style: none;
          padding: 0;
          margin: 12px 0 0 0;
        }
        .gf-membership-list li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 300;
          color: #555555;
          margin-bottom: 8px;
          letter-spacing: 0.02em;
        }
        .gf-membership-list li::before {
          content: '·';
          font-size: 14px;
          color: #555555;
          flex-shrink: 0;
        }

        .gf-link-item {
          margin-bottom: 16px;
        }

        /* Email input wrapper with relative positioning and thin bottom border */
        .gf-email-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          max-width: 320px;
          margin: 2rem auto 0 auto;
          border-bottom: 1px solid rgba(51, 51, 51, 0.25);
          padding-bottom: 8px;
          transition: border-color 300ms ease;
        }
        .gf-email-wrap:focus-within {
          border-bottom-color: #333333;
        }
        .gf-email-input {
          background: transparent !important;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: #333333;
          width: 100%;
          padding-right: 28px;
          padding-left: 0;
        }
        [data-locale="ar"] .gf-email-input {
          padding-left: 28px;
          padding-right: 0;
          text-align: right;
        }
        .gf-email-input::placeholder {
          color: #9A9A9A;
          letter-spacing: 0.05em;
        }
        .gf-email-btn {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          color: #333333;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 200ms ease;
        }
        [data-locale="ar"] .gf-email-btn {
          right: auto;
          left: 0;
        }
        .gf-email-btn:hover {
          color: #000000;
        }

        /* Mobile Accordion block */
        .gf-accordion-trigger {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          padding: 1.25rem 0;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          background: transparent;
          border-left: none;
          border-right: none;
          border-bottom: none;
          cursor: pointer;
          transition: opacity 200ms ease;
        }
        .gf-accordion-trigger:last-of-type {
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        .gf-accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 300ms cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          text-align: center;
        }
        .gf-accordion-content.open {
          max-height: 350px;
          padding-bottom: 1rem;
        }
        .gf-accordion-link {
          font-size: 0.85rem;
          font-weight: 400;
          color: #555555;
          padding: 0.5rem 0;
          text-decoration: none;
          transition: color 200ms ease;
        }
        .gf-accordion-link:hover,
        .gf-accordion-link:active {
          color: #333333;
        }

        .gf-privacy-note {
          font-size: 0.7rem;
          color: #777777;
          letter-spacing: 0.02em;
          margin-top: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        /* Bottom information strip */
        .gf-meta-row {
          max-width: 1440px;
          margin: 0 auto;
          padding: 44px 56px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .gf-meta-left {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .gf-meta-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .gf-meta-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
        }

        .gf-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.08em;
          text-decoration: none;
          color: #555555;
          transition: color 200ms ease;
        }
        .gf-meta-item:hover {
          color: #333333;
        }

        .gf-social-icon {
          color: #555555;
          opacity: 0.75;
          transition: color 240ms ease, opacity 240ms ease, transform 200ms ease;
        }
        .gf-social-icon:hover {
          color: #333333;
          opacity: 1;
          transform: translateY(-1.5px);
        }

        .gf-legal-row {
          background-color: #FBFBFA;
          border-top: 1px solid #E5E5E0;
          padding: 40px 56px;
        }
        .gf-legal-inner {
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: #777777;
        }

        /* ── Arabic Typography Overrides ──────────────────────────────── */
        [data-locale="ar"] .gf-footer {
          direction: rtl;
        }
        [data-locale="ar"] .gf-footer * {
          line-height: 1.8;
          word-spacing: 0.04em;
        }
        [data-locale="ar"] .gf-col-title {
          font-weight: 600 !important;
          letter-spacing: 0.03em !important;
          font-size: 14px !important;
          color: #333333 !important;
          line-height: 1.6 !important;
          text-transform: none !important;
        }
        [data-locale="ar"] .gf-link {
          font-weight: 400 !important;
          line-height: 1.8 !important;
          color: #555555;
          transition: color 200ms ease;
        }
        [data-locale="ar"] .gf-link:hover {
          color: #333333;
        }
        [data-locale="ar"] .gf-desktop-cols {
          direction: rtl;
        }
        [data-locale="ar"] .gf-meta-row {
          display: flex;
          justify-content: space-between;
          direction: rtl;
        }
        [data-locale="ar"] .gf-meta-left {
          justify-content: flex-start;
          gap: 28px;
        }
        [data-locale="ar"] .gf-meta-right {
          justify-content: flex-end;
        }
        [data-locale="ar"] .gf-legal-inner {
          direction: rtl;
        }
        [data-locale="ar"] .gf-membership-title {
          font-size: 13px !important;
          letter-spacing: 0.06em !important;
          font-weight: 500 !important;
          color: #333333 !important;
          text-transform: none !important;
        }
      `}</style>

      <footer className={cn('gf-footer w-full', className)} {...props}>
        {/* ── Top Grid Section ────────────────────────────────────────────── */}
        <div className="gf-grid">
          {/* Desktop & Tablet grid */}
          <div className="gf-desktop-cols hidden md:grid">
            {/* Column 1: Brand Info */}
            <div className="flex flex-col items-start">
              <div>
                <h3 className="mb-6 text-[17px] font-medium tracking-[0.16em] text-[#333333]">
                  GLOWMI
                </h3>
                <p
                  className="text-[11px] leading-[1.8] font-light text-[#555555]"
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {t('brandStatement')}
                </p>
              </div>
              <Logo
                style={{
                  width: 24,
                  height: 24,
                  opacity: 0.6,
                  marginTop: 36,
                  marginLeft: 10,
                  color: '#2B2B2B',
                }}
              />
            </div>

            {/* Column 2: SHOP */}
            <div className="flex flex-col">
              <h4 className="gf-col-title">{t('sections.shop.title')}</h4>
              <ul className="space-y-0">
                {shopLinks.map((link) => (
                  <li key={link.label} className="gf-link-item">
                    <Link href={link.href} className="gf-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: SKIN INTELLIGENCE */}
            <div className="flex flex-col">
              <h4 className="gf-col-title">{t('sections.skinIntelligence.title')}</h4>
              <ul className="space-y-0">
                {skinIntelligenceLinks.map((link) => (
                  <li key={link.label} className="gf-link-item">
                    <Link href={link.href} className="gf-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: ABOUT */}
            <div className="flex flex-col">
              <h4 className="gf-col-title">{t('sections.about.title')}</h4>
              <ul className="space-y-0">
                {aboutLinks.map((link) => (
                  <li key={link.label} className="gf-link-item">
                    <Link href={link.href} className="gf-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: CUSTOMER CARE */}
            <div className="flex flex-col">
              <h4 className="gf-col-title">{t('sections.customerCare.title')}</h4>
              <ul className="space-y-0">
                {customerCareLinks.map((link) => (
                  <li key={link.label} className="gf-link-item">
                    <Link href={link.href} className="gf-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 6: JOIN GLOWMI CIRCLE */}
            <div className="flex flex-col justify-between">
              <div>
                <h4 className="gf-col-title gf-membership-title text-[#333333]">
                  {t('sections.membership.title')}
                </h4>
                <p className="gf-membership-desc">{t('sections.membership.descSentence')}</p>
                <ul className="gf-membership-list">
                  <li>{t('sections.membership.item1')}</li>
                  <li>{t('sections.membership.item2')}</li>
                  <li>{t('sections.membership.item3')}</li>
                </ul>
                <div className="gf-email-wrap">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="gf-email-input"
                    aria-label="Email Address"
                  />
                  <button type="button" className="gf-email-btn" aria-label="Subscribe">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="h-4 w-4"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-light text-[#777777]">
                <Lock size={10} className="opacity-60" />
                <span>{t('sections.membership.privacyNote')}</span>
              </div>
            </div>
          </div>

          {/* Mobile Single-Column Layout (below 768px) */}
          <div className="flex w-full flex-col items-center space-y-12 text-center md:hidden">
            {/* 1. Glowmi Circle Segment (Newsletter Portal) */}
            <div className="flex w-full flex-col items-center">
              <h4 className="mb-4 text-[13px] font-medium tracking-[0.15em] text-[#333333] uppercase">
                {t('sections.membership.title')}
              </h4>
              <p className="mx-auto mb-6 max-w-[85%] text-[0.9rem] leading-relaxed font-light text-[#333333]">
                {t('sections.membership.descSentence')}
              </p>
              <ul className="flex w-full flex-col items-center space-y-2">
                <li className="flex items-center justify-center gap-2 text-[0.85rem] font-light text-[#555555]">
                  <span>{t('sections.membership.item1')}</span>
                </li>
                <li className="flex items-center justify-center gap-2 text-[0.85rem] font-light text-[#555555]">
                  <span>{t('sections.membership.item2')}</span>
                </li>
                <li className="flex items-center justify-center gap-2 text-[0.85rem] font-light text-[#555555]">
                  <span>{t('sections.membership.item3')}</span>
                </li>
              </ul>

              <div className="gf-email-wrap">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="gf-email-input text-center"
                  aria-label="Email Address"
                />
                <button type="button" className="gf-email-btn" aria-label="Subscribe">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>

              <div className="gf-privacy-note mt-3">
                <Lock size={10} className="opacity-60" />
                <span>{t('sections.membership.privacyNote')}</span>
              </div>
            </div>

            {/* 2. The Accordion Directory Stack */}
            <div className="w-full max-w-[400px]">
              {/* Accordion 1: SHOP */}
              <div className="w-full">
                <button
                  type="button"
                  className="gf-accordion-trigger"
                  onClick={() => toggleSection('shop')}
                >
                  <span className="text-[11px] font-medium tracking-[0.15em] text-[#333333] uppercase">
                    {t('sections.shop.title')}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1}
                    className={cn(
                      'transition-transform duration-300',
                      openSections.shop && 'rotate-180'
                    )}
                  />
                </button>
                <div className={cn('gf-accordion-content', openSections.shop && 'open')}>
                  {shopLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="gf-accordion-link"
                      onClick={() => setOpenSections({})}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Accordion 2: SKIN INTELLIGENCE */}
              <div className="w-full">
                <button
                  type="button"
                  className="gf-accordion-trigger"
                  onClick={() => toggleSection('skinIntelligence')}
                >
                  <span className="text-[11px] font-medium tracking-[0.15em] text-[#333333] uppercase">
                    {t('sections.skinIntelligence.title')}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1}
                    className={cn(
                      'transition-transform duration-300',
                      openSections.skinIntelligence && 'rotate-180'
                    )}
                  />
                </button>
                <div
                  className={cn('gf-accordion-content', openSections.skinIntelligence && 'open')}
                >
                  {skinIntelligenceLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="gf-accordion-link"
                      onClick={() => setOpenSections({})}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Accordion 3: ABOUT */}
              <div className="w-full">
                <button
                  type="button"
                  className="gf-accordion-trigger"
                  onClick={() => toggleSection('about')}
                >
                  <span className="text-[11px] font-medium tracking-[0.15em] text-[#333333] uppercase">
                    {t('sections.about.title')}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1}
                    className={cn(
                      'transition-transform duration-300',
                      openSections.about && 'rotate-180'
                    )}
                  />
                </button>
                <div className={cn('gf-accordion-content', openSections.about && 'open')}>
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="gf-accordion-link"
                      onClick={() => setOpenSections({})}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Accordion 4: CUSTOMER CARE */}
              <div className="w-full">
                <button
                  type="button"
                  className="gf-accordion-trigger"
                  onClick={() => toggleSection('customerCare')}
                >
                  <span className="text-[11px] font-medium tracking-[0.15em] text-[#333333] uppercase">
                    {t('sections.customerCare.title')}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1}
                    className={cn(
                      'transition-transform duration-300',
                      openSections.customerCare && 'rotate-180'
                    )}
                  />
                </button>
                <div className={cn('gf-accordion-content', openSections.customerCare && 'open')}>
                  {customerCareLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="gf-accordion-link"
                      onClick={() => setOpenSections({})}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Bottom Area & Saudi Brand Pride Integration */}
            <div className="flex w-full flex-col items-center space-y-6 pt-4">
              {/* Location & Email */}
              <div className="flex flex-col items-center gap-3">
                <a
                  href="https://maps.google.com/?q=Riyadh+Saudi+Arabia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[11px] tracking-wider text-[#555555]"
                >
                  <MapPin size={13} className="text-[#333333]" strokeWidth={1} />
                  <span>{t('location')}</span>
                </a>
                <a
                  href="mailto:info@glowmi.net"
                  className="flex items-center gap-2 text-[11px] tracking-wider text-[#555555]"
                >
                  <Mail size={13} className="text-[#333333]" strokeWidth={1} />
                  <span>info@glowmi.net</span>
                </a>
              </div>

              {/* Brand Copy Block */}
              <div className="max-w-[85%] text-[0.85rem] leading-[1.7] font-light text-[#333333]">
                <p>Born in Saudi Arabia. Created for the World.</p>
                <p>Luxury skincare powered by science.</p>
              </div>

              {/* Brand Monogram */}
              <Logo style={{ width: 24, height: 24, opacity: 0.6, color: '#2B2B2B' }} />

              {/* Social Media Icons (Mobile) */}
              <div className="flex items-center gap-6">
                {/* Instagram */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gf-social-icon"
                  aria-label="Instagram"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gf-social-icon"
                  aria-label="X"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gf-social-icon"
                  aria-label="TikTok"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.84 4.84 0 01-1-.15z" />
                  </svg>
                </a>
                {/* Snapchat */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gf-social-icon"
                  aria-label="Snapchat"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.927-.278.09-.06.19-.09.27-.09.12 0 .24.045.33.12.15.12.21.29.21.45s-.045.27-.12.39c-.375.63-1.707.885-1.89.915-.044.01-.073.017-.109.03a.256.256 0 00-.12.21c-.015.06-.015.12 0 .18.45 1.065 1.17 1.965 2.07 2.58.27.18.57.33.87.42.15.045.24.18.24.33 0 .06-.015.12-.045.18-.165.36-.795.555-1.17.645-.075.015-.15.045-.225.06-.16.043-.255.073-.33.195-.08.127-.047.252-.015.378.024.076.048.152.05.228.01.12-.06.27-.21.36a2.44 2.44 0 01-.72.27 4.13 4.13 0 01-.84.12 2.2 2.2 0 00-.51.06c-.21.06-.42.195-.69.315-.345.165-.795.375-1.44.465C14.25 18.78 13.2 18.78 12 18.78s-2.25 0-3.21-.255c-.645-.09-1.095-.3-1.44-.465-.27-.12-.48-.255-.69-.315a2.2 2.2 0 00-.51-.06 4.13 4.13 0 01-.84-.12 2.44 2.44 0 01-.72-.27c-.15-.09-.21-.24-.21-.36.002-.076.026-.152.05-.228.032-.126.065-.251-.015-.378-.075-.122-.17-.152-.33-.195-.075-.015-.15-.045-.225-.06-.375-.09-1.005-.285-1.17-.645A.378.378 0 012.64 16c0-.15.09-.285.24-.33.3-.09.6-.24.87-.42.9-.615 1.62-1.515 2.07-2.58.015-.06.015-.12 0-.18a.256.256 0 00-.12-.21c-.036-.013-.065-.02-.109-.03-.18-.03-1.515-.285-1.89-.915A.496.496 0 013.58 11c0-.165.06-.33.21-.45a.455.455 0 01.33-.12c.09 0 .18.03.27.09.27.15.63.27.93.27a.81.81 0 00.4-.09l-.003-.06c-.103-1.628-.23-3.654.3-4.848C7.64 1.07 10.996.793 11.986.793h.22z" />
                  </svg>
                </a>
              </div>

              {/* Trust Indicators & Certification Badge */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[0.75rem] font-medium tracking-[0.12em] text-[#333333] uppercase">
                  SAUDI MADE · QUALITY CERTIFIED
                </span>
                <span className="text-[0.65rem] tracking-wider text-[#777777] uppercase">
                  {t('legal.vat')}
                </span>
              </div>

              {/* Legal Metadata & Copyright */}
              <div className="flex w-full flex-col items-center gap-4 border-t border-black/5 pt-4">
                <div className="flex flex-wrap justify-center gap-6 text-[0.7rem] tracking-[0.03em] text-[#777777]">
                  <Link href="/privacy-policy" className="transition-colors hover:text-[#333333]">
                    {t('legal.privacy')}
                  </Link>
                  <Link href="/terms-conditions" className="transition-colors hover:text-[#333333]">
                    {t('legal.terms')}
                  </Link>
                  <Link href="/cookies-policy" className="transition-colors hover:text-[#333333]">
                    {t('legal.cookies')}
                  </Link>
                </div>
                <span className="mt-2 text-[0.7rem] tracking-[0.03em] text-[#777777]">
                  <bdi>© Glowmi 2026</bdi>
                  {isRTL ? ' · جميع الحقوق محفوظة.' : '. All Rights Reserved.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Information Strip (Desktop only): full-width 1px divider at top ── */}
        <div className="hidden md:block" style={{ borderTop: '1px solid #E5E5E0' }}>
          <div className="gf-meta-row">
            {/* AREA 1: Location & Email */}
            <div className="gf-meta-left">
              <a
                href="https://maps.google.com/?q=Riyadh+Saudi+Arabia"
                target="_blank"
                rel="noopener noreferrer"
                className="gf-meta-item"
              >
                <MapPin size={13} className="text-[#333333]" strokeWidth={1} />
                <span>{t('location')}</span>
              </a>
              <a href="mailto:info@glowmi.net" className="gf-meta-item">
                <Mail size={13} className="text-[#333333]" strokeWidth={1} />
                <span>info@glowmi.net</span>
              </a>
            </div>

            {/* AREA 2: Social Media Icons */}
            <div className="gf-meta-center">
              <div className="flex items-center gap-5">
                {/* Instagram */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gf-social-icon"
                  aria-label="Instagram"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                {/* X (Twitter) */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gf-social-icon"
                  aria-label="X"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* TikTok */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gf-social-icon"
                  aria-label="TikTok"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.75a8.18 8.18 0 004.77 1.52V6.84a4.84 4.84 0 01-1-.15z" />
                  </svg>
                </a>
                {/* Snapchat */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gf-social-icon"
                  aria-label="Snapchat"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.927-.278.09-.06.19-.09.27-.09.12 0 .24.045.33.12.15.12.21.29.21.45s-.045.27-.12.39c-.375.63-1.707.885-1.89.915-.044.01-.073.017-.109.03a.256.256 0 00-.12.21c-.015.06-.015.12 0 .18.45 1.065 1.17 1.965 2.07 2.58.27.18.57.33.87.42.15.045.24.18.24.33 0 .06-.015.12-.045.18-.165.36-.795.555-1.17.645-.075.015-.15.045-.225.06-.16.043-.255.073-.33.195-.08.127-.047.252-.015.378.024.076.048.152.05.228.01.12-.06.27-.21.36a2.44 2.44 0 01-.72.27 4.13 4.13 0 01-.84.12 2.2 2.2 0 00-.51.06c-.21.06-.42.195-.69.315-.345.165-.795.375-1.44.465C14.25 18.78 13.2 18.78 12 18.78s-2.25 0-3.21-.255c-.645-.09-1.095-.3-1.44-.465-.27-.12-.48-.255-.69-.315a2.2 2.2 0 00-.51-.06 4.13 4.13 0 01-.84-.12 2.44 2.44 0 01-.72-.27c-.15-.09-.21-.24-.21-.36.002-.076.026-.152.05-.228.032-.126.065-.251-.015-.378-.075-.122-.17-.152-.33-.195-.075-.015-.15-.045-.225-.06-.375-.09-1.005-.285-1.17-.645A.378.378 0 012.64 16c0-.15.09-.285.24-.33.3-.09.6-.24.87-.42.9-.615 1.62-1.515 2.07-2.58.015-.06.015-.12 0-.18a.256.256 0 00-.12-.21c-.036-.013-.065-.02-.109-.03-.18-.03-1.515-.285-1.89-.915A.496.496 0 013.58 11c0-.165.06-.33.21-.45a.455.455 0 01.33-.12c.09 0 .18.03.27.09.27.15.63.27.93.27a.81.81 0 00.4-.09l-.003-.06c-.103-1.628-.23-3.654.3-4.848C7.64 1.07 10.996.793 11.986.793h.22z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* AREA 3: Saudi Pride — typography-only, no icon */}
            <div className="gf-meta-right">
              <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                <span
                  className="block text-[9.5px] leading-none font-semibold tracking-[0.16em] text-[#333333]"
                  style={{ fontVariant: 'small-caps', letterSpacing: '0.1em' }}
                >
                  {t('sustainabilityBadge')}
                </span>
                <span className="mt-1 block text-[10px] leading-relaxed font-light text-[#777777]">
                  {t('sustainabilityDesc')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Legal Row (Desktop only) — 40px padding, #E5E5E0 full-width divider ── */}
        <div className="gf-legal-row hidden md:block">
          <div className="gf-legal-inner">
            {/* Left — Copyright + VAT + Quality Certified */}
            <div className="flex flex-wrap items-center gap-5">
              <span>
                <bdi>© Glowmi 2026</bdi>
                {isRTL ? ' · جميع الحقوق محفوظة.' : '. All Rights Reserved.'}
              </span>
              <span className="opacity-55">{t('legal.vat')}</span>
              <span
                style={{
                  borderLeft: '1px solid #D8D8D3',
                  height: 12,
                  display: 'inline-block',
                  margin: '0 4px',
                  verticalAlign: 'middle',
                }}
                aria-hidden="true"
              />
              <span
                style={{ fontSize: 11, color: '#9B9B9B', letterSpacing: '0.06em', fontWeight: 300 }}
              >
                {t('legal.qualityCertified')}
              </span>
            </div>
            {/* Right — Legal Links */}
            <div className="flex items-center gap-6">
              <Link href="/privacy-policy" className="transition-colors hover:text-[#333333]">
                {t('legal.privacy')}
              </Link>
              <Link href="/terms-conditions" className="transition-colors hover:text-[#333333]">
                {t('legal.terms')}
              </Link>
              <Link href="/cookies-policy" className="transition-colors hover:text-[#333333]">
                {t('legal.cookies')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
