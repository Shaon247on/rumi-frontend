'use client'

import { useLogout } from '@/api/api-hooks/auth.api-hook'
import newLogo from '@/assets/GLOWMI-logo.svg'
import placeholderImg from '@/assets/image/default-avatar.png'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link, usePathname as useI18nPathname, useRouter as useI18nRouter } from '@/i18n/navigation'
import { localeNames, routing } from '@/i18n/routing'
import { getImageUrl } from '@/lib/get-image-url'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useMembershipModalStore } from '@/store/membership-modal.store'
import { Globe, LogOut, Search, User, X } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ShowCardList } from './show-card-list'

type Props = {
  buttonLabel: string
  navItems: {
    name: string
    url: string
    subItems?: { name: string; url: string }[]
  }[]
}

// ── Rotating announcement messages ──────────────────────────────────────────
function AnnouncementTicker() {
  const t = useTranslations('shared.announcements')
  const locale = useLocale()
  const isAR = locale === 'ar'

  const ANNOUNCEMENTS = [
    t('bornInSaudi'),
    t('foundingMember'),
    t('scienceTimeless'),
    t('beautifulSkin'),
    t('earlyAccess'),
    t('designedForSkin'),
    t('newEra'),
  ]

  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setShow(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % ANNOUNCEMENTS.length)
        setShow(true)
      }, 500)
    }, 5000)
    return () => clearInterval(id)
  }, [ANNOUNCEMENTS.length])

  return (
    <span
      className="gx-announce-text"
      style={{
        display: 'inline-block',
        transition: 'opacity 500ms ease-in-out',
        opacity: show ? 1 : 0,
        fontSize: '13px',
        letterSpacing: isAR ? '0' : '0.12em',
        textTransform: isAR ? 'none' : 'uppercase',
        fontWeight: 500,
        lineHeight: isAR ? 1.4 : 1,
        color: '#F5F3EF',
        fontFamily: isAR ? "'IBM Plex Sans Arabic', 'Noto Kufi Arabic', sans-serif" : 'inherit',
        maxWidth: 'calc(100% - 56px)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'center',
      }}
    >
      {ANNOUNCEMENTS[idx]}
    </span>
  )
}

// ── Language Toggle (inline, Globe + label) ──────────────────────────────────
function LuxuryLangToggle() {
  const locale = useLocale()
  const router = useI18nRouter()
  const pathname = useI18nPathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex cursor-pointer items-center gap-1.5 text-[#3a3a3a] transition-colors hover:text-[#1a2e1a] focus:outline-none"
        aria-label="Change language"
      >
        <Globe strokeWidth={1.5} style={{ width: 14, height: 14 }} />
        <span
          style={{
            fontSize: 9.5,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 300,
          }}
        >
          {locale}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        style={{
          minWidth: 110,
          borderRadius: 10,
          border: '1px solid #e8e6e3',
          background: '#fff',
          boxShadow: '0 8px 30px rgba(26,46,26,0.08)',
          padding: '4px 0',
        }}
      >
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => router.replace(pathname, { locale: loc })}
            style={{
              fontSize: 9.5,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              fontWeight: locale === loc ? 500 : 300,
              color: locale === loc ? '#1a2e1a' : '#555',
              padding: '8px 14px',
              cursor: 'pointer',
            }}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export const NewNavLarge = ({ navItems }: Props) => {
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const { push } = useRouter()
  const { mutateAsync: logout } = useLogout()
  const openMembership = useMembershipModalStore((state) => state.openFromAnnouncement)
  const [scrolled, setScrolled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const pathname = usePathname()
  const t = useTranslations('shared.nav')

  // Read dismissal state from sessionStorage after hydration to prevent mismatch
  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      const dismissed = sessionStorage.getItem('glowmi-announcement-dismissed') === 'true'
      if (dismissed) {
        Promise.resolve().then(() => {
          setIsDismissed(true)
        })
      }
    }
  }, [])

  // _buttonLabel is received from server component but not used in this layout;
  // prefixed with underscore to suppress unused-variable lint.

  const handleDismiss = () => {
    sessionStorage.setItem('glowmi-announcement-dismissed', 'true')
    setIsDismissed(true)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      clearAuth()
      push('/login')
    }
  }

  const locale = useLocale()
  const isRTL = locale === 'ar'

  // Route State Engine
  const stripped = pathname.replace(/^\/[a-z]{2}/, '')
  const isEditorial =
    stripped === '' ||
    stripped === '/' ||
    stripped.startsWith('/about') ||
    stripped.startsWith('/science') ||
    stripped.startsWith('/privacy-policy') ||
    stripped.startsWith('/terms-conditions') ||
    stripped.startsWith('/terms-and-conditions') ||
    stripped.startsWith('/cookies-policy')
  const navState = isEditorial ? 'EDITORIAL_STATE' : 'COMMERCE_STATE'

  // Soft cross-fade state transition (async update to avoid sync setState in effect lint)
  const [fadeState, setFadeState] = useState(true)
  useEffect(() => {
    let active = true
    Promise.resolve().then(() => {
      if (active) {
        setFadeState(false)
        const timer = setTimeout(() => {
          if (active) setFadeState(true)
        }, 50)
        return () => clearTimeout(timer)
      }
    })
    return () => {
      active = false
    }
  }, [navState])

  const isActive = (url: string) => {
    const strippedPath = pathname.replace(/^\/[a-z]{2}/, '')
    if (url === '/') return strippedPath === '' || strippedPath === '/'
    return strippedPath.startsWith(url)
  }

  // We now use a unified global navigation (navItems) everywhere
  // No need for separate commerceLinks

  return (
    <>
      <style>{`
        /* ── Root container ────────────────────────────────────────────── */
        .gx-root {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          width: 100%;
          background: transparent;
        }

        /* ── Row 1 — Announcement bar ──────────────────────────────────── */
        .gx-announce {
          background: #1C1C1A;
          color: #FFFFFF;
          text-align: center;
          padding: 8px 16px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 38px;
          transition: height 280ms cubic-bezier(0.4,0,0.2,1),
                      opacity 280ms ease,
                      padding 280ms ease;
          overflow: hidden;
        }
        .gx-root.scrolled .gx-announce,
        .gx-announce.dismissed {
          height: 0;
          opacity: 0;
          padding-top: 0;
          padding-bottom: 0;
          pointer-events: none;
        }
        .gx-announce-close {
          position: absolute;
          right: 16px;
          background: transparent;
          border: none;
          color: #F5F3EF;
          cursor: pointer;
          opacity: 0.7;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 200ms ease;
        }
        .gx-announce-close:hover {
          opacity: 1;
        }
        [data-locale="ar"] .gx-announce-close {
          right: auto;
          left: 16px;
        }

        /* ── Row 2 — Brand row ─────────────────────────────────────────── */
        .gx-brand {
          background: #ffffff;
          transition: background 280ms cubic-bezier(0.4,0,0.2,1);
        }
        .gx-root.scrolled .gx-brand {
          backdrop-filter: blur(18px) saturate(1.3);
          -webkit-backdrop-filter: blur(18px) saturate(1.3);
          background: rgba(255,255,255,0.9);
        }
        
        /* Brand inner with flex layout and relative positioning for absolute logo centering */
        .gx-brand-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 56px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 88px;
          position: relative;
          transition: height 280ms cubic-bezier(0.4,0,0.2,1);
        }
        .gx-root.scrolled .gx-brand-inner {
          height: 64px;
        }

        /* Absolute Logo Centering (Apple/Dior Symmetrical Layout) */
        .gx-logo-wrap {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }
        .gx-logo {
          width: 160px;
          height: auto;
          display: block;
          transition: width 280ms cubic-bezier(0.4,0,0.2,1);
        }
        .gx-root.scrolled .gx-logo {
          width: 128px;
        }

        /* Left side actions (Language, Search, Skin Quiz) */
        .gx-brand-left {
          display: flex;
          align-items: center;
          gap: 32px;
          z-index: 5;
        }

        /* Right side actions (Membership, Sign In, Cart) */
        .gx-brand-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 32px;
          z-index: 5;
        }

        .gx-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #3a3a3a;
          transition: color 200ms ease, opacity 200ms ease;
        }
        .gx-icon-btn:hover {
          color: #1a2e1a;
          opacity: 0.7;
        }

        /* Join Glowmi Circle default button */
        .gx-circle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          border-radius: 0px;
          background: transparent;
          color: #2B2B2B;
          border: 1px solid #2B2B2B;
          transition: background 250ms ease, color 250ms ease, border-color 250ms ease;
          cursor: pointer;
        }
        .gx-circle-btn:hover {
          background: #2B2B2B;
          color: #FFFFFF;
          border-color: #2B2B2B;
        }

        /* Dynamic Commerce Scan Button (Apple/Dior Minimalist Style) */
        .gx-commerce-scan-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 38px;
          padding: 0 24px;
          border-radius: 0px;
          font-size: 11.5px;
          font-weight: 400;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          background: #111111;
          color: #ffffff;
          border: 1px solid transparent;
          transition: all 250ms ease;
          cursor: pointer;
          text-decoration: none;
        }
        .gx-commerce-scan-btn:hover {
          background: #FBFBFA;
          color: #111111;
          border-color: #111111;
        }

        .gx-sign-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          color: #3a3a3a;
          transition: background 200ms ease, color 200ms ease;
        }
        .gx-sign-btn:hover {
          background: rgba(26,46,26,0.05);
          color: #1a2e1a;
        }
        .gx-sign-btn svg {
          width: 14px;
          height: 14px;
        }

        /* ── Row 3 — Primary navigation ───────────────────────────────── */
        .gx-nav-row {
          background: #ffffff;
          border-top: 1px solid rgba(26,46,26,0.05);
          border-bottom: 1px solid rgba(26,46,26,0.07);
          transition: background 280ms ease,
                      box-shadow 280ms ease,
                      margin-top 280ms ease;
        }
        .gx-root:not(.scrolled) .gx-nav-row {
          margin-top: 12px;
        }
        .gx-root.scrolled .gx-nav-row {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(18px) saturate(1.3);
          -webkit-backdrop-filter: blur(18px) saturate(1.3);
          box-shadow: 0 1px 20px rgba(26,46,26,0.07);
        }
        .gx-nav-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          height: 38px;
          transition: height 280ms cubic-bezier(0.4,0,0.2,1);
        }
        .gx-root.scrolled .gx-nav-inner {
          height: 34px;
        }

        /* Nav links */
        .gx-nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #555555;
          padding: 0 28px;
          height: 100%;
          text-decoration: none;
          white-space: nowrap;
          transition: color 220ms ease;
        }
        .gx-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 28px;
          right: 28px;
          height: 1px;
          background: #333333;
          transform: scaleX(0);
          transform-origin: center;
          transition: transform 200ms cubic-bezier(0.4,0,0.2,1);
        }
        .gx-nav-link:hover,
        .gx-nav-link.active {
          color: #333333;
        }
        .gx-nav-link:hover::after,
        .gx-nav-link.active::after {
          opacity: 1;
        }

        /* ── Luxury Mega-Dropdown ──────────────────────────────────────── */
        .gx-dropdown-container {
          position: relative;
          display: inline-block;
        }
        .gx-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(8px);
          opacity: 0;
          visibility: hidden;
          background: #fff;
          border: 1px solid #E8E4DF;
          padding: 20px 28px;
          min-width: 240px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08);
          transition: all 300ms cubic-bezier(0.2, 0, 0, 1);
          z-index: 100;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .gx-dropdown-container:hover .gx-dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        /* Invisible hover bridge to prevent losing hover state */
        .gx-dropdown-menu::before {
          content: "";
          position: absolute;
          top: -20px;
          left: 0;
          right: 0;
          height: 20px;
        }

        .gx-dropdown-item {
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.16em;
          color: #555555;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
          padding: 2px 0;
          display: flex;
          align-items: center;
        }
        
        .gx-dropdown-item:hover {
          color: #1a2e1a;
          padding-left: 6px;
        }
        
        [data-locale="ar"] .gx-dropdown-item {
          letter-spacing: 0.02em;
          font-weight: 500;
        }
        [data-locale="ar"] .gx-dropdown-item:hover {
          padding-left: 0;
          padding-right: 6px;
        }

        /* ── Mobile/Small Screens (hide row 3) ─────────────────────────── */
        .gx-skin-quiz-link {
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
          color: #6B6B6B;
          text-decoration: none;
          padding: 4px 2px;
          transition: color 200ms ease;
          white-space: nowrap;
          position: relative;
        }
        .gx-skin-quiz-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 1.5px;
          background: #2B2B2B;
          transition: width 200ms ease, left 200ms ease;
        }
        .gx-skin-quiz-link:hover {
          color: #2B2B2B;
        }
        .gx-skin-quiz-link:hover::after {
          width: 100%;
          left: 0;
        }

        /* Cross-fade animations */
        .state-fade {
          opacity: 1;
          transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .state-fade-out {
          opacity: 0;
        }

        /* ── RTL Localization ──────────────────────────────────────────── */
        [data-locale="ar"] .gx-brand-inner {
          direction: rtl;
        }
        [data-locale="ar"] .gx-brand-left {
          justify-content: flex-start;
        }
        [data-locale="ar"] .gx-brand-right {
          justify-content: flex-end;
        }
        [data-locale="ar"] .gx-nav-inner {
          direction: rtl;
        }
        [data-locale="ar"] .gx-announce {
          direction: rtl;
        }
        [data-locale="ar"] .gx-nav-link {
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: none;
          line-height: 1.8;
        }
        [data-locale="ar"] .gx-circle-btn {
          letter-spacing: 0.04em;
          text-transform: none;
        }
      `}</style>

      {/* ── Fixed Spacer to prevent layout thrashing ─────────────────────── */}
      <div
        className="gx-header-spacer hidden lg:block"
        style={{
          height: isDismissed ? '138px' : '176px',
          transition: 'height 280ms cubic-bezier(0.4,0,0.2,1)',
        }}
      />

      {/* ── Root wrapper (fixed) ─────────────────────────────────────────── */}
      <div
        className={cn('gx-root hidden lg:block', scrolled && 'scrolled')}
        aria-label="Site header"
      >
        {/* ── Row 1: Announcement bar ──────────────────────────────────────── */}
        <div className={cn('gx-announce', isDismissed && 'dismissed')} aria-live="polite">
          <AnnouncementTicker />
          <button
            type="button"
            className="gx-announce-close"
            onClick={handleDismiss}
            aria-label={isRTL ? 'إغلاق الإعلان' : 'Dismiss announcement'}
          >
            <X strokeWidth={1} style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* ── Row 2: Brand row ─────────────────────────────────────────────── */}
        <div className="gx-brand">
          <div className="gx-brand-inner">
            {/* LEFT — Language, Search, Skin Quiz */}
            <div className="gx-brand-left">
              <LuxuryLangToggle />

              <Link href="/products" className="gx-icon-btn" aria-label={t('searchLabel')}>
                <Search strokeWidth={1.5} style={{ width: 14, height: 14 }} />
              </Link>

              <Link
                href="/skin-analyzer/skin-intelligence"
                className="gx-skin-quiz-link"
                aria-label={t('skinQuiz')}
              >
                {t('skinQuiz')}
              </Link>
            </div>

            {/* CENTER — Symmetrical Logo absolute-positioned */}
            <div className="gx-logo-wrap">
              <Link href="/" aria-label="GLOWMI — Return to home">
                <Image
                  src={newLogo}
                  alt="GLOWMI"
                  width={500}
                  height={152}
                  className="gx-logo"
                  priority
                />
              </Link>
            </div>

            {/* RIGHT — Account Utilities */}
            <div className="gx-brand-right">
              {/* Dynamic Context-Aware Action Button */}
              <button
                type="button"
                className={cn('gx-circle-btn state-fade', !fadeState && 'state-fade-out')}
                onClick={openMembership}
                aria-label={t('joinGlowmiCircle')}
              >
                {t('joinGlowmiCircle')}
              </button>

              {/* Sign In / Avatar */}
              {user?.full_name ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="gx-icon-btn" aria-label="Account">
                    <Avatar className="size-[26px] rounded-full ring-1 ring-[#1a2e1a]/20">
                      <AvatarImage src={getImageUrl(user?.image) || placeholderImg.src} />
                      <AvatarFallback
                        style={{
                          background: '#1a2e1a',
                          color: '#fff',
                          fontSize: 10,
                          fontWeight: 400,
                        }}
                      >
                        {user.full_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    style={{
                      minWidth: 140,
                      borderRadius: 10,
                      border: '1px solid #e8e6e3',
                      background: '#fff',
                      boxShadow: '0 8px 30px rgba(26,46,26,0.08)',
                      padding: '4px 0',
                    }}
                  >
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        style={{
                          fontSize: 9.5,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          fontWeight: 300,
                          color: '#363739',
                          padding: '8px 14px',
                          cursor: 'pointer',
                        }}
                        onClick={() => push('/profile')}
                      >
                        {t('profile')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator style={{ background: '#f0ece6', margin: '2px 0' }} />
                      <DropdownMenuItem
                        style={{
                          fontSize: 9.5,
                          letterSpacing: '0.16em',
                          textTransform: 'uppercase',
                          fontWeight: 300,
                          padding: '8px 14px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                        onClick={handleLogout}
                      >
                        <LogOut
                          style={{ width: 12, height: 12, color: '#c0392b', strokeWidth: 1.5 }}
                        />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" className="gx-sign-btn" aria-label="Sign in to your account">
                  <User strokeWidth={1.5} style={{ width: 14, height: 14 }} />
                </Link>
              )}

              {/* Cart */}
              <ShowCardList />
            </div>
          </div>
        </div>

        {/* ── Row 3: Primary Navigation ── */}
        <nav className="gx-nav-row" aria-label="Primary navigation">
          <div className={cn('gx-nav-inner state-fade', !fadeState && 'state-fade-out')}>
            {navItems.map((item) => {
              if (item.subItems) {
                return (
                  <div key={item.name} className="gx-dropdown-container">
                    <Link
                      href={{ pathname: item.url }}
                      className={cn('gx-nav-link', isActive(item.url) && 'active')}
                    >
                      {item.name}
                    </Link>
                    <div className="gx-dropdown-menu">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          href={{ pathname: sub.url }}
                          className="gx-dropdown-item"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={item.name}
                  href={{ pathname: item.url }}
                  className={cn('gx-nav-link', isActive(item.url) && 'active')}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}
