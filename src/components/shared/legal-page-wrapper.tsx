'use client'

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

/* ─── Types ──────────────────────────────────────────────────────── */

type Section = {
  title: string
  content: string
  list?: string[]
}

type LegalPageWrapperProps = {
  title: string
  updatedText: string
  intro: string
  sections: Section[]
  pageSlug: 'privacy-policy' | 'terms-conditions' | 'cookies-policy'
}

/* ─── Helpers ────────────────────────────────────────────────────── */

/** Derive a URL-safe slug from a section title */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0600-\u06FF-]/g, '') // keep Arabic, Latin, digits, hyphens
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Extract the leading number from a section title.
 * Supports Latin digits ("1.") and Arabic-Indic digits ("١.").
 * Returns [number, rest] or [null, fullTitle] if no number found.
 */
function splitSectionNumber(title: string): [string | null, string] {
  const match = title.match(/^([\d٠-٩]+)\.\s*(.*)$/)
  if (match) return [match[1], match[2]]
  return [null, title]
}

/* ─── Component ──────────────────────────────────────────────────── */

export default function LegalPageWrapper({
  title,
  updatedText,
  intro,
  sections,
  pageSlug,
}: LegalPageWrapperProps) {
  const locale = useLocale()
  const t = useTranslations('shared.legalPage')
  const isAR = locale === 'ar'
  const uid = useId()

  /* ── Font stacks ── */
  const fontSans = isAR
    ? "var(--font-ibm-plex-arabic), 'GE SS', 'DIN Next Arabic', sans-serif"
    : "var(--font-lato), 'Inter', sans-serif"
  const fontSerif = isAR
    ? "var(--font-ibm-plex-arabic), 'GE SS', 'DIN Next Arabic', sans-serif"
    : "'Canela', 'Reckless', 'Georgia', serif"

  /* ── Derived section data ── */
  const sectionData = useMemo(
    () =>
      sections.map((s, i) => {
        const [num, rest] = splitSectionNumber(s.title)
        const id = slugify(s.title) || `section-${i}`
        return { ...s, num, displayTitle: rest, id }
      }),
    [sections]
  )

  /* ── Scroll-spy ── */
  const [activeId, setActiveId] = useState<string>('')
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())

  const registerRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el)
    } else {
      sectionRefs.current.delete(id)
    }
  }, [])

  useEffect(() => {
    const elements = Array.from(sectionRefs.current.values())
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [sectionData])

  /* ── Mobile accordion ── */
  const [tocOpen, setTocOpen] = useState(false)
  const tocContentId = `${uid}-toc-content`

  const handleTocToggle = useCallback(() => {
    setTocOpen((prev) => !prev)
  }, [])

  const handleTocKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleTocToggle()
      }
    },
    [handleTocToggle]
  )

  /* ── Back-to-top ── */
  const handleBackToTop = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'instant' : 'smooth' })
    // Move focus to top of page
    const h1 = document.querySelector('h1')
    if (h1) {
      h1.setAttribute('tabindex', '-1')
      h1.focus()
    }
  }, [])

  /* ── Email link renderer ── */
  const renderParagraphWithLinks = (text: string) => {
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
    const parts = text.split(emailRegex)

    if (parts.length > 1) {
      return (
        <>
          {parts.map((part, index) => {
            if (emailRegex.test(part)) {
              return (
                <a key={index} href={`mailto:${part}`} className="legal-link">
                  {part}
                </a>
              )
            }
            return part
          })}
        </>
      )
    }
    return text
  }

  /* ── Cross-links ── */
  const crossLinks = useMemo(() => {
    const pages = [
      {
        slug: 'privacy-policy' as const,
        labelKey: 'privacyPolicy' as const,
        href: '/privacy-policy',
      },
      {
        slug: 'terms-conditions' as const,
        labelKey: 'termsConditions' as const,
        href: '/terms-conditions',
      },
      {
        slug: 'cookies-policy' as const,
        labelKey: 'cookiesPolicy' as const,
        href: '/cookies-policy',
      },
    ]
    return pages.map((p) => ({
      ...p,
      label: t(p.labelKey),
      isCurrent: p.slug === pageSlug,
    }))
  }, [pageSlug, t])

  /* ── TOC content (shared between desktop sidebar and mobile accordion) ── */
  const tocItems = (
    <nav aria-label={t('onThisPage')}>
      <ul className="legal-toc-list">
        {sectionData.map((s) => (
          <li key={s.id} className={`legal-toc-item ${activeId === s.id ? 'is-active' : ''}`}>
            <a href={`#${s.id}`} className="legal-toc-link">
              {s.num ? `${s.num}. ${s.displayTitle}` : s.displayTitle}
            </a>
          </li>
        ))}
      </ul>
      <div className="legal-toc-footer">
        <p className="legal-toc-updated">{updatedText}</p>
        <a href="#top" onClick={handleBackToTop} className="legal-toc-back-to-top">
          {t('backToTop')} ↑
        </a>
      </div>
    </nav>
  )

  return (
    <>
      <style>{`
        /* ─── Design Tokens (scoped) ─── */
        .legal-main {
          --lg-graphite-100: #1a2e1a;
          --lg-graphite-80: #3a3a3a;
          --lg-graphite-60: #666666;
          --lg-graphite-50: #8a8a85;
          --lg-graphite-40: #c5c2bc;
          --lg-border-subtle: #e8e4df;
          --lg-bg: #FDFCFA;
        }

        /* ─── Main Container ─── */
        .legal-main {
          width: 100%;
          min-height: 100vh;
          background-color: var(--lg-bg);
          padding: 0 1.5rem;
        }
        @media (min-width: 768px) {
          .legal-main {
            padding: 0 2rem;
          }
        }

        /* ─── Page Header ─── */
        .legal-header {
          max-width: 800px;
          margin: 0 auto;
          padding-top: 8rem;
          padding-bottom: 4rem;
          text-align: center;
        }

        .legal-eyebrow {
          font-family: ${fontSans};
          font-size: 0.6875rem;
          letter-spacing: ${isAR ? '0.05em' : '0.2em'};
          text-transform: uppercase;
          color: var(--lg-graphite-50);
          margin-bottom: 1.5rem;
          font-weight: ${isAR ? '500' : '400'};
        }

        .legal-h1 {
          font-family: ${fontSerif};
          font-size: clamp(2.5rem, 6vw, 3.5rem);
          font-weight: 200;
          letter-spacing: ${isAR ? '0' : '-0.03em'};
          text-align: center;
          color: var(--lg-graphite-100);
          line-height: ${isAR ? '1.5' : '1.15'};
          margin: 0;
        }

        /* ─── Two-Column Grid (Desktop ≥1280px) ─── */
        .legal-grid {
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 6rem;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 1280px) {
          .legal-grid {
            display: grid;
            grid-template-columns: minmax(0, 760px) 1fr minmax(240px, 300px);
            gap: 0 4rem;
            padding-bottom: 8rem;
          }
        }

        /* ─── Content Column ─── */
        .legal-content {
          max-width: 760px;
          margin: 0 auto;
          width: 100%;
        }
        @media (min-width: 1280px) {
          .legal-content {
            margin: 0;
            grid-column: 1;
          }
        }

        .legal-intro {
          font-family: ${fontSans};
          font-size: 1.0625rem;
          line-height: ${isAR ? '2' : '1.85'};
          color: var(--lg-graphite-80);
          max-width: 65ch;
          font-weight: ${isAR ? '400' : '300'};
          text-align: ${isAR ? 'right' : 'left'};
          margin-bottom: 3.5rem;
          border-bottom: 1px solid var(--lg-border-subtle);
          padding-bottom: 3.5rem;
        }

        /* ─── Sections ─── */
        .legal-section {
          scroll-margin-top: 6rem;
        }
        .legal-section + .legal-section {
          margin-top: 5rem;
        }

        /* H2: elegant and editorial */
        .legal-h2-number {
          display: block;
          font-family: ${fontSans};
          font-size: 0.8125rem;
          color: var(--lg-graphite-50);
          letter-spacing: ${isAR ? '0' : '0.1em'};
          font-weight: 500;
          margin-bottom: 0.5rem;
          text-align: ${isAR ? 'right' : 'left'};
        }
        .legal-h2 {
          font-family: ${fontSerif};
          font-size: 1.625rem;
          font-weight: ${isAR ? '500' : '300'};
          color: var(--lg-graphite-100);
          margin: 0 0 1.25rem 0;
          text-align: ${isAR ? 'right' : 'left'};
          line-height: ${isAR ? '1.5' : '1.3'};
          letter-spacing: ${isAR ? '0' : '-0.01em'};
        }

        /* Body paragraph */
        .legal-p {
          font-family: ${fontSans};
          font-size: 0.9375rem;
          line-height: ${isAR ? '2' : '1.8'};
          color: var(--lg-graphite-80);
          margin: 0 0 1.25rem 0;
          text-align: ${isAR ? 'right' : 'left'};
          font-weight: ${isAR ? '400' : '300'};
          max-width: 65ch;
        }

        /* Lists: hanging indent */
        .legal-ul {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0 1.5rem 0;
        }
        .legal-li {
          position: relative;
          padding-left: ${isAR ? '0' : '1.75rem'};
          padding-right: ${isAR ? '1.75rem' : '0'};
          margin-bottom: 0.875rem;
          font-family: ${fontSans};
          font-size: 0.9375rem;
          line-height: ${isAR ? '2' : '1.8'};
          color: var(--lg-graphite-80);
          text-align: ${isAR ? 'right' : 'left'};
          font-weight: ${isAR ? '400' : '300'};
          max-width: 65ch;
        }
        .legal-li::before {
          content: '—';
          position: absolute;
          left: ${isAR ? 'auto' : '0'};
          right: ${isAR ? '0' : 'auto'};
          color: var(--lg-graphite-40);
          font-weight: 300;
        }

        /* Links in body */
        .legal-link {
          color: var(--lg-graphite-100);
          text-decoration: none;
          border-bottom: 1px solid var(--lg-border-subtle);
          padding-bottom: 1px;
          transition: border-color 0.3s ease;
        }
        .legal-link:hover {
          border-color: var(--lg-graphite-100);
        }
        .legal-link:focus-visible {
          outline: 2px solid var(--lg-graphite-100);
          outline-offset: 2px;
          border-bottom-color: transparent;
        }

        /* ─── TOC Sidebar (Desktop) ─── */
        .legal-sidebar {
          display: none;
        }
        @media (min-width: 1280px) {
          .legal-sidebar {
            display: block;
            grid-column: 3;
            grid-row: 1;
          }
        }
        .legal-toc-container {
          position: sticky;
          top: 6rem;
          border: none;
          border-radius: 0;
          padding: 0;
        }

        /* ─── TOC Items ─── */
        .legal-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .legal-toc-item {
          margin-bottom: 0;
        }
        .legal-toc-link {
          display: block;
          font-family: ${fontSans};
          font-size: 0.8125rem;
          line-height: 1.5;
          color: var(--lg-graphite-50);
          text-decoration: none;
          padding: 0.5rem 0;
          padding-left: ${isAR ? '0' : '1rem'};
          padding-right: ${isAR ? '1rem' : '0'};
          border-left: ${isAR ? 'none' : '2px solid transparent'};
          border-right: ${isAR ? '2px solid transparent' : 'none'};
          transition: color 0.25s ease, border-color 0.25s ease;
          letter-spacing: ${isAR ? '0' : 'normal'};
          font-weight: ${isAR ? '400' : '300'};
          text-align: ${isAR ? 'right' : 'left'};
        }
        .legal-toc-link:hover {
          color: var(--lg-graphite-100);
        }
        .legal-toc-link:focus-visible {
          outline: 2px solid var(--lg-graphite-100);
          outline-offset: 2px;
        }
        .legal-toc-item.is-active .legal-toc-link {
          color: var(--lg-graphite-100);
          border-left-color: ${isAR ? 'transparent' : 'var(--lg-graphite-100)'};
          border-right-color: ${isAR ? 'var(--lg-graphite-100)' : 'transparent'};
          font-weight: 400;
        }

        /* ─── TOC Footer (updated date + back-to-top) ─── */
        .legal-toc-footer {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--lg-border-subtle);
        }
        .legal-toc-updated {
          font-family: ${fontSans};
          font-size: 0.75rem;
          letter-spacing: ${isAR ? '0' : '0.1em'};
          color: var(--lg-graphite-50);
          text-transform: uppercase;
          margin: 0 0 0.75rem 0;
          font-weight: ${isAR ? '400' : '300'};
          text-align: ${isAR ? 'right' : 'left'};
        }
        .legal-toc-back-to-top {
          display: inline-block;
          font-family: ${fontSans};
          font-size: 0.875rem;
          color: var(--lg-graphite-60);
          text-decoration: none;
          transition: color 0.2s ease;
          font-weight: ${isAR ? '400' : '300'};
          letter-spacing: ${isAR ? '0' : 'normal'};
        }
        .legal-toc-back-to-top:hover {
          color: var(--lg-graphite-100);
        }
        .legal-toc-back-to-top:focus-visible {
          outline: 2px solid var(--lg-graphite-100);
          outline-offset: 2px;
        }

        /* ─── Mobile/Tablet Accordion (<1280px) ─── */
        .legal-accordion {
          display: block;
          margin-bottom: 3rem;
          border: 1px solid var(--lg-border-subtle);
          border-radius: 0;
          background-color: #FAF9F6;
        }
        @media (min-width: 1280px) {
          .legal-accordion {
            display: none;
          }
        }
        .legal-accordion-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 1.125rem 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: ${fontSans};
          font-size: 0.8125rem;
          color: var(--lg-graphite-80);
          letter-spacing: ${isAR ? '0' : '0.12em'};
          text-transform: uppercase;
          font-weight: 500;
          text-align: ${isAR ? 'right' : 'left'};
          border-radius: 0;
        }
        .legal-accordion-trigger:focus-visible {
          outline: 2px solid var(--lg-graphite-100);
          outline-offset: 2px;
        }
        .legal-accordion-chevron {
          width: 16px;
          height: 16px;
          transition: transform 0.25s ease;
          flex-shrink: 0;
          color: var(--lg-graphite-60);
        }
        .legal-accordion-chevron.is-open {
          transform: rotate(180deg);
        }
        .legal-accordion-body {
          display: none;
          padding: 0 1.25rem 1.25rem;
        }
        .legal-accordion-body.is-open {
          display: block;
        }

        /* ─── Cross-Links ─── */
        .legal-cross-links {
          max-width: 760px;
          margin: 0 auto;
          border-top: 1px solid var(--lg-border-subtle);
          padding-top: 3.5rem;
          padding-bottom: 6rem;
        }
        @media (min-width: 1280px) {
          .legal-cross-links {
            max-width: 1200px;
          }
        }
        .legal-cross-links-label {
          font-family: ${fontSans};
          font-size: 0.6875rem;
          letter-spacing: ${isAR ? '0.05em' : '0.2em'};
          text-transform: uppercase;
          color: var(--lg-graphite-50);
          margin-bottom: 1.5rem;
          font-weight: ${isAR ? '500' : '400'};
          text-align: ${isAR ? 'right' : 'left'};
        }
        .legal-cross-links-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        @media (min-width: 768px) {
          .legal-cross-links-list {
            flex-direction: row;
            gap: 3rem;
          }
        }
        .legal-cross-link {
          font-family: ${fontSans};
          font-size: 0.875rem;
          color: var(--lg-graphite-80);
          text-decoration: none;
          border-bottom: 1px solid transparent;
          padding-bottom: 2px;
          transition: color 0.25s ease, border-bottom-color 0.25s ease;
          font-weight: ${isAR ? '400' : '300'};
          letter-spacing: ${isAR ? '0' : 'normal'};
        }
        .legal-cross-link:hover {
          color: var(--lg-graphite-100);
          border-bottom-color: var(--lg-graphite-100);
        }
        .legal-cross-link:focus-visible {
          outline: 2px solid var(--lg-graphite-100);
          outline-offset: 2px;
        }
        .legal-cross-link-current {
          font-family: ${fontSans};
          font-size: 0.875rem;
          color: var(--lg-graphite-40);
          font-weight: ${isAR ? '400' : '300'};
          letter-spacing: ${isAR ? '0' : 'normal'};
        }

        /* ─── Focus Reset ─── */
        .legal-main *:focus-visible {
          outline-color: var(--lg-graphite-100);
        }
        .legal-main *:focus:not(:focus-visible) {
          outline: none;
        }
      `}</style>

      <div className="legal-main" dir={isAR ? 'rtl' : 'ltr'} data-locale={locale} id="top">
        {/* ── Page Header ── */}
        <header className="legal-header">
          {/* Eyebrow visible on mobile only (it moves to sidebar on desktop) */}
          <p className="legal-eyebrow" style={{ display: 'block' }}>
            {updatedText}
          </p>
          <h1 className="legal-h1">{title}</h1>
        </header>

        {/* ── Two-Column Grid ── */}
        <div className="legal-grid">
          {/* ── Content Column ── */}
          <div className="legal-content">
            {/* Mobile/Tablet Accordion TOC */}
            <div className="legal-accordion">
              <button
                type="button"
                className="legal-accordion-trigger"
                aria-expanded={tocOpen}
                aria-controls={tocContentId}
                onClick={handleTocToggle}
                onKeyDown={handleTocKeyDown}
              >
                <span>{t('onThisPage')}</span>
                <svg
                  className={`legal-accordion-chevron ${tocOpen ? 'is-open' : ''}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>
              <div
                id={tocContentId}
                className={`legal-accordion-body ${tocOpen ? 'is-open' : ''}`}
                role="region"
                aria-label={t('onThisPage')}
              >
                {tocItems}
              </div>
            </div>

            {/* Intro paragraph */}
            <p className="legal-intro">{renderParagraphWithLinks(intro)}</p>

            {/* Sections */}
            {sectionData.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="legal-section"
                ref={(el) => registerRef(section.id, el)}
              >
                <h2 className="legal-h2">
                  {section.num && <span className="legal-h2-number">{section.num}</span>}
                  {section.displayTitle}
                </h2>
                <p className="legal-p">{renderParagraphWithLinks(section.content)}</p>

                {section.list && (
                  <ul className="legal-ul">
                    {section.list.map((item, i) => (
                      <li key={i} className="legal-li">
                        {renderParagraphWithLinks(item)}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* ── Desktop Sticky Sidebar ── */}
          <aside className="legal-sidebar" aria-label={t('onThisPage')}>
            <div className="legal-toc-container">{tocItems}</div>
          </aside>
        </div>

        {/* ── Cross-Links ── */}
        <div className="legal-cross-links">
          <p className="legal-cross-links-label">{t('related')}</p>
          <div className="legal-cross-links-list">
            {crossLinks.map((link) =>
              link.isCurrent ? (
                <span key={link.slug} className="legal-cross-link-current">
                  {link.label}
                </span>
              ) : (
                <Link key={link.slug} href={`/${locale}${link.href}`} className="legal-cross-link">
                  {link.label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
