'use client'

import newLogo from '@/assets/GLOWMI-logo.svg'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Link } from '@/i18n/navigation'
import { usePathname as useI18nPathname, useRouter as useI18nRouter } from '@/i18n/navigation'
import { routing, localeNames } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useMembershipModalStore } from '@/store/membership-modal.store'
import { Menu, X, Search, Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShowCardList } from './show-card-list'

// ── Rotating announcement messages (mobile) ──────────────────────────────────
function MobileAnnouncementTicker() {
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
      className="gxm-announce-text"
      style={{
        display: 'inline-block',
        transition: 'opacity 500ms ease-in-out',
        opacity: show ? 1 : 0,
        fontSize: '11px',
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
        padding: '0 10px',
      }}
    >
      {ANNOUNCEMENTS[idx]}
    </span>
  )
}

type Props = {
  navItems: {
    name: string
    url: string
    subItems?: { name: string; url: string }[]
  }[]
}

export const NewNavMobile = ({ navItems }: Props) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const locale = useLocale()
  const isRTL = locale === 'ar'
  const user = useAuthStore((state) => state.user)
  const openMembership = useMembershipModalStore((state) => state.openFromAnnouncement)
  const routerI18n = useI18nRouter()
  const pathnameI18n = useI18nPathname()
  const rawPathname = usePathname()
  const tNav = useTranslations('shared.nav')

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

  const handleDismiss = () => {
    sessionStorage.setItem('glowmi-announcement-dismissed', 'true')
    setIsDismissed(true)
  }

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  const isActive = (url: string) => {
    const strippedPath = rawPathname.replace(/^\/[a-z]{2}/, '')
    if (url === '/') return strippedPath === '' || strippedPath === '/'
    return strippedPath.startsWith(url)
  }

  // We now use a unified global navigation (navItems) everywhere

  return (
    <>
      <style>{`
        /* ── Mobile root ─────────────────────────────────────────────── */
        .gxm-root {
          position: sticky;
          top: 0;
          z-index: 50;
        }

        /* ── Announcement bar (mobile) ───────────────────────────────── */
        .gxm-announce {
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-announcement-bg);
          color: #F5F3EF;
          overflow: hidden;
          position: relative;
          padding: 8px 16px;
          transition: height 300ms ease, opacity 300ms ease, padding 300ms ease;
        }
        .gxm-root.scrolled .gxm-announce,
        .gxm-announce.dismissed {
          height: 0 !important;
          opacity: 0 !important;
          pointer-events: none !important;
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        .gxm-announce-close {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #F5F3EF;
          opacity: 0.7;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 200ms ease;
        }
        .gxm-announce-close:hover {
          opacity: 1;
        }
        [data-locale="ar"] .gxm-announce-close {
          right: auto;
          left: 14px;
        }

        /* ── Brand row (mobile) ──────────────────────────────────────── */
        .gxm-brand {
          background: #ffffff;
          border-bottom: 1px solid rgba(26,46,26,0.08);
          transition: background 280ms ease;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 20px;
          height: 52px;
        }
        .gxm-root.scrolled .gxm-brand {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(18px) saturate(1.3);
          -webkit-backdrop-filter: blur(18px) saturate(1.3);
          box-shadow: 0 1px 20px rgba(26,46,26,0.07);
        }

        .gxm-brand-left  { display: flex; align-items: center; gap: 2px; }
        .gxm-brand-right { display: flex; align-items: center; justify-content: flex-end; gap: 4px; }

        .gxm-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          color: #3a3a3a;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 200ms ease, color 200ms ease;
          flex-shrink: 0;
          text-decoration: none;
        }
        .gxm-icon-btn:hover {
          background: rgba(26,46,26,0.07);
          color: #1a2e1a;
        }
        .gxm-icon-btn svg { stroke-width: 1.5; width: 17px; height: 17px; }

        .gxm-logo-img {
          width: 96px;
          height: auto;
          display: block;
          transition: width 280ms ease;
        }
        .gxm-root.scrolled .gxm-logo-img { width: 80px; }

        /* ── Drawer styles ───────────────────────────────────────────── */
        .gxm-drawer-link {
          display: block;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #2a2a2a;
          padding: 15px 0;
          border-bottom: 1px solid rgba(26,46,26,0.07);
          text-decoration: none;
          transition: color 180ms ease;
        }
        .gxm-drawer-link:hover,
        .gxm-drawer-link.active { color: #1a2e1a; }

        .gxm-drawer-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #1a2e1a;
          border: 1px solid rgba(26,46,26,0.3);
          border-radius: 0px;
          padding: 12px 20px;
          background: transparent;
          cursor: pointer;
          transition: background 220ms ease, color 220ms ease;
        }
        .gxm-drawer-cta:hover {
          background: #1a2e1a;
          color: #f5f0e8;
        }

        /* Centered Dynamic Scan Button for mobile drawer */
        .gxm-drawer-cta-scan {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #333333;
          border: 1px solid rgba(51, 51, 51, 0.2);
          border-radius: 0px; /* absolute hard edges */
          padding: 12px 20px;
          text-decoration: none;
          background: transparent;
          transition: background 220ms ease, color 220ms ease;
        }
        .gxm-drawer-cta-scan:hover {
          background: #FBFBFA;
          color: #111111;
        }

        .gxm-drawer-signin {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-size: 9px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #fff;
          background: #1a2e1a;
          border-radius: 0px;
          padding: 12px 20px;
          text-decoration: none;
          transition: background 220ms ease;
        }
        .gxm-drawer-signin:hover { background: #243524; }

        /* ── RTL Localization Mirroring ─────────────────────────────── */
        [data-locale="ar"] .gxm-brand {
          direction: rtl;
        }
        [data-locale="ar"] .gxm-brand-left {
          flex-direction: row;
        }
        [data-locale="ar"] .gxm-brand-right {
          flex-direction: row-reverse;
        }
        [data-locale="ar"] .gxm-announce {
          direction: rtl;
        }
      `}</style>

      <div className={cn('gxm-root lg:hidden', scrolled && 'scrolled')}>
        {/* Announcement bar */}
        <div className={cn('gxm-announce', isDismissed && 'dismissed')} aria-live="polite">
          <MobileAnnouncementTicker />
          <button
            type="button"
            className="gxm-announce-close"
            onClick={handleDismiss}
            aria-label={isRTL ? 'إغلاق الإعلان' : 'Dismiss announcement'}
          >
            <X strokeWidth={1} style={{ width: 14, height: 14 }} />
          </button>
        </div>

        {/* Brand row */}
        <div className="gxm-brand" role="banner">
          {/* LEFT — Menu + Search */}
          <div className="gxm-brand-left">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="gxm-icon-btn" aria-label={tNav('searchLabel')}>
                <Menu />
              </SheetTrigger>

              <SheetContent
                side={isRTL ? 'right' : 'left'}
                className="w-[300px] border-0 bg-white p-0"
                showCloseButton={false}
              >
                {/* Drawer Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid rgba(26,46,26,0.07)',
                  }}
                >
                  <Image
                    src={newLogo}
                    alt="GLOWMI"
                    width={300}
                    height={91}
                    style={{ width: 100, height: 'auto' }}
                  />
                  <SheetClose className="gxm-icon-btn" aria-label="Close menu">
                    <X />
                  </SheetClose>
                </div>

                {/* Nav links */}
                <nav style={{ padding: '8px 24px 16px' }} aria-label="Mobile navigation">
                  {navItems.map((item) => {
                    if (item.subItems) {
                      return (
                        <div key={item.name} style={{ display: 'flex', flexDirection: 'column' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Link
                              href={{ pathname: item.url }}
                              className={cn('gxm-drawer-link', isActive(item.url) && 'active')}
                              onClick={() => setOpen(false)}
                              style={{ flexGrow: 1 }}
                            >
                              {item.name}
                            </Link>
                          </div>
                          <div
                            style={{
                              paddingLeft: '16px',
                              borderLeft: '1px solid #E8E4DF',
                              marginLeft: '8px',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            {item.subItems.map((sub, idx) => (
                              <Link
                                key={sub.name}
                                href={{ pathname: sub.url }}
                                className={cn('gxm-drawer-link', isActive(sub.url) && 'active')}
                                onClick={() => setOpen(false)}
                                style={{
                                  fontSize: '11px',
                                  padding: '8px 0',
                                  marginTop:
                                    (sub.url.includes('new') || sub.url.includes('best-seller')) &&
                                    !item.subItems?.[idx - 1]?.url.includes('new') &&
                                    !item.subItems?.[idx - 1]?.url.includes('best-seller')
                                      ? '12px'
                                      : '0',
                                }}
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
                        className={cn('gxm-drawer-link', isActive(item.url) && 'active')}
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                {/* CTAs */}
                <div
                  style={{
                    padding: '8px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    borderTop: '1px solid rgba(26,46,26,0.07)',
                  }}
                >
                  <button
                    type="button"
                    className="gxm-drawer-cta"
                    onClick={() => {
                      setOpen(false)
                      openMembership()
                    }}
                  >
                    {tNav('joinGlowmiCircle')}
                  </button>
                  {!user && (
                    <Link
                      href="/login"
                      className="gxm-drawer-signin"
                      onClick={() => setOpen(false)}
                    >
                      {tNav('button_text')}
                    </Link>
                  )}
                </div>

                {/* Language switcher */}
                <div
                  style={{
                    padding: '16px 24px',
                    borderTop: '1px solid rgba(26,46,26,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <Globe
                    strokeWidth={1.5}
                    style={{ width: 13, height: 13, color: '#888', flexShrink: 0 }}
                  />
                  {routing.locales.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        routerI18n.replace(pathnameI18n, { locale: loc })
                        setOpen(false)
                      }}
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        fontWeight: locale === loc ? 500 : 300,
                        color: locale === loc ? '#1a2e1a' : '#888',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      {localeNames[loc]}
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/products" className="gxm-icon-btn" aria-label="Search">
              <Search />
            </Link>
          </div>

          {/* CENTER — Logo */}
          <Link
            href="/"
            aria-label="GLOWMI — Home"
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <Image
              src={newLogo}
              alt="GLOWMI"
              width={500}
              height={152}
              className="gxm-logo-img"
              priority
            />
          </Link>

          {/* RIGHT — Cart */}
          <div className="gxm-brand-right">
            <div className="gxm-icon-btn" style={{ position: 'relative' }}>
              <ShowCardList />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
