'use client'

import React, { useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Minus,
} from 'lucide-react'

export function ContactForm() {
  const t = useTranslations('contact')
  const locale = useLocale()
  const isAr = locale === 'ar'

  // Input refs for smooth scroll and focusing
  const formSectionRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState<'product' | 'order' | 'general'>('product')
  const [message, setMessage] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // FAQ Accordion open states
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Typography Settings
  const fontSans = isAr ? 'var(--font-ibm-plex-arabic), sans-serif' : 'var(--font-lato), sans-serif'
  const fontSerif = isAr
    ? 'var(--font-noto-naskh-arabic), serif'
    : 'var(--font-cormorant-garamond), serif'

  const categories = [
    { value: 'product', label: t('form.categories.product') },
    { value: 'order', label: t('form.categories.order') },
    { value: 'general', label: t('form.categories.general') },
  ] as const

  const serviceCards = [
    {
      id: 'product-advice',
      title: t('services.productAdvice.title'),
      desc: t('services.productAdvice.desc'),
      cta: t('services.productAdvice.cta'),
      icon: Sparkles,
      targetCategory: 'product',
    },
    {
      id: 'order-support',
      title: t('services.orderSupport.title'),
      desc: t('services.orderSupport.desc'),
      cta: t('services.orderSupport.cta'),
      icon: ShoppingBag,
      targetCategory: 'order',
    },
    {
      id: 'general-inquiry',
      title: t('services.generalInquiry.title'),
      desc: t('services.generalInquiry.desc'),
      cta: t('services.generalInquiry.cta'),
      icon: Mail,
      targetCategory: 'general',
    },
  ] as const

  const contactInfo = [
    {
      label: t('details.email.label'),
      value: t('details.email.value'),
      href: `mailto:${t('details.email.value')}`,
      icon: Mail,
    },
    {
      label: t('details.phone.label'),
      value: t('details.phone.value'),
      href: `https://wa.me/966500000000`, // Standardize link
      icon: Phone,
    },
    {
      label: t('details.hours.label'),
      value: t('details.hours.value'),
      icon: Clock,
    },
    {
      label: t('details.location.label'),
      value: t('details.location.value'),
      icon: MapPin,
    },
  ]

  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1'),
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2'),
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3'),
    },
  ]

  const handleServiceAction = (targetCategory: 'product' | 'order' | 'general') => {
    setCategory(targetCategory)

    // Smooth scroll to form section
    if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Focus name input after scrolling finishes
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus({ preventScroll: true })
      }
    }, 800)
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) {
      newErrors.name = t('form.errors.nameRequired')
    }
    if (!email.trim()) {
      newErrors.email = t('form.errors.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('form.errors.emailInvalid')
    }
    if (!message.trim()) {
      newErrors.message = t('form.errors.messageRequired')
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return

    setIsSubmitting(true)
    try {
      // Simulate luxury API submission
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setIsSuccess(true)
    } catch {
      setSubmitError(t('form.errors.generic'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetForm = () => {
    setName('')
    setEmail('')
    setPhone('')
    setCategory('product')
    setMessage('')
    setErrors({})
    setIsSuccess(false)
    setSubmitError(null)
  }

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className="mx-auto max-w-7xl px-6 pt-12 pb-24 selection:bg-[var(--color-deep-green)]/10 selection:text-[var(--color-deep-green)] md:px-12 lg:px-16 xl:px-24"
      style={{ fontFamily: fontSans }}
    >
      {/* ─── 1. HERO SECTION ─── */}
      <section className="mx-auto mb-20 flex max-w-2xl flex-col items-center text-center md:mb-28">
        <h1
          className="mb-4 text-3xl font-extralight tracking-tight text-[var(--color-charcoal)] md:text-4xl lg:text-5xl"
          style={{ fontFamily: fontSerif }}
        >
          {t('headline')}
        </h1>
        <p className="max-w-lg text-sm leading-relaxed font-light text-[#5A5852] md:text-base">
          {t('supporting')}
        </p>
      </section>

      {/* ─── 2. CONTACT SERVICES CARDS ─── */}
      <section className="mb-24 md:mb-32">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {serviceCards.map((card) => {
            const IconComponent = card.icon
            return (
              <div
                key={card.id}
                onClick={() => handleServiceAction(card.targetCategory)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleServiceAction(card.targetCategory)
                  }
                }}
                role="button"
                tabIndex={0}
                className="group flex min-h-[240px] cursor-pointer flex-col justify-between border border-[#E5E2DC] bg-[var(--color-ivory)]/30 p-8 text-start transition-all duration-300 ease-out outline-none hover:border-[var(--color-deep-green)] hover:bg-white focus:ring-1 focus:ring-[var(--color-deep-green)]"
              >
                <div>
                  <div className="mb-6 flex h-10 w-10 items-center justify-center bg-[var(--color-deep-green)]/5 transition-colors duration-300 group-hover:bg-[var(--color-deep-green)]/10">
                    <IconComponent className="h-5 w-5 stroke-[1.2] text-[var(--color-deep-green)]" />
                  </div>
                  <h3
                    className="mb-2.5 text-lg font-medium text-[var(--color-charcoal)] transition-colors duration-200 group-hover:text-[var(--color-deep-green)]"
                    style={{ fontFamily: fontSans }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-light text-[#7C7A74]">{card.desc}</p>
                </div>

                <div className="mt-8 flex items-center gap-2 border-t border-[#E5E2DC]/40 pt-4 text-xs font-semibold tracking-wider text-[var(--color-deep-green)] uppercase">
                  <span>{card.cta}</span>
                  {isAr ? (
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── 3. CONTACT INFORMATION ─── */}
      <section className="mb-24 border-t border-[#E5E2DC] pt-16 md:mb-32">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="group flex flex-col text-start">
                <div className="mb-4 flex h-8 w-8 items-center justify-center border border-[#E5E2DC] bg-white transition-colors duration-300 group-hover:border-[var(--color-deep-green)]">
                  <Icon className="h-4 w-4 text-[#7C7A74] transition-colors duration-300 group-hover:text-[var(--color-deep-green)]" />
                </div>
                <span className="mb-1 text-[10px] font-semibold tracking-wider text-[#7C7A74] uppercase">
                  {item.label}
                </span>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-sm font-light break-words text-[var(--color-charcoal)] transition-colors duration-150 hover:text-[var(--color-deep-green)]"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-light text-[var(--color-charcoal)]">{item.value}</p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ─── 4. CONTACT FORM ─── */}
      <section
        ref={formSectionRef}
        className="relative mx-auto mb-24 max-w-2xl scroll-mt-24 border border-[#E5E2DC] bg-[var(--color-ivory)]/30 px-6 py-12 md:mb-32 md:p-12"
      >
        {isSuccess ? (
          <div aria-live="polite" className="flex flex-col items-center py-8 text-center">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-deep-green)]/5">
              <CheckCircle2 className="h-6 w-6 stroke-[1.2] text-[var(--color-deep-green)]" />
            </div>
            <h2
              className="mb-3 text-2xl font-light text-[var(--color-charcoal)]"
              style={{ fontFamily: fontSerif }}
            >
              {t('form.success')}
            </h2>
            <p className="mb-8 max-w-md text-sm leading-relaxed font-light text-[#5A5852]">
              {t('form.successDesc')}
            </p>
            <button
              type="button"
              onClick={handleResetForm}
              className="cursor-pointer bg-[var(--color-deep-green)] px-8 py-3 text-xs font-semibold tracking-wider text-white uppercase transition-colors duration-300 outline-none hover:bg-[#253f25]"
            >
              {t('form.successCta')}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-10 text-start">
              <h2
                className="mb-2 text-2xl font-light text-[var(--color-charcoal)] md:text-3xl"
                style={{ fontFamily: fontSerif }}
              >
                {t('form.title')}
              </h2>
              <p className="text-xs font-light tracking-wide text-[#7C7A74] uppercase">
                {t('form.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Reason Segmented Buttons */}
              <div className="space-y-2 text-start">
                <span className="block text-[10px] font-semibold tracking-wider text-[#7C7A74] uppercase">
                  {t('form.category')}
                </span>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value)}
                      className={cn(
                        'flex h-11 cursor-pointer items-center justify-center border text-center text-xs font-light tracking-wide transition-all duration-300 outline-none select-none',
                        category === cat.value
                          ? 'border-[var(--color-deep-green)] bg-[var(--color-deep-green)] font-medium text-white'
                          : 'border-[#E5E2DC] bg-white text-[var(--color-charcoal)] hover:border-[var(--color-deep-green)]/55 hover:bg-[var(--color-deep-green)]/5'
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name field */}
              <div className="flex flex-col text-start">
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-[10px] font-semibold tracking-wider text-[#7C7A74] uppercase"
                >
                  {t('form.name')}
                </label>
                <input
                  id="name"
                  type="text"
                  ref={nameInputRef}
                  placeholder={t('form.namePlaceholder')}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                  }}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  className={cn(
                    'h-11 w-full rounded-none border bg-white px-4 py-3 text-sm font-light text-[var(--color-charcoal)] transition-all duration-300 outline-none placeholder:text-[#A19E95]',
                    errors.name
                      ? 'border-destructive focus:border-destructive'
                      : 'border-[#E5E2DC] hover:border-[var(--color-deep-green)]/40 focus:border-[var(--color-deep-green)] focus:ring-1 focus:ring-[var(--color-deep-green)]'
                  )}
                />
                {errors.name && (
                  <p id="name-error" className="text-destructive mt-1.5 text-xs font-light">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email field */}
              <div className="flex flex-col text-start">
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[10px] font-semibold tracking-wider text-[#7C7A74] uppercase"
                >
                  {t('form.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder={t('form.emailPlaceholder')}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                  }}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={cn(
                    'h-11 w-full rounded-none border bg-white px-4 py-3 text-sm font-light text-[var(--color-charcoal)] transition-all duration-300 outline-none placeholder:text-[#A19E95]',
                    errors.email
                      ? 'border-destructive focus:border-destructive'
                      : 'border-[#E5E2DC] hover:border-[var(--color-deep-green)]/40 focus:border-[var(--color-deep-green)] focus:ring-1 focus:ring-[var(--color-deep-green)]'
                  )}
                />
                {errors.email && (
                  <p id="email-error" className="text-destructive mt-1.5 text-xs font-light">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone field */}
              <div className="flex flex-col text-start">
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-[10px] font-semibold tracking-wider text-[#7C7A74] uppercase"
                >
                  {t('form.phone')}
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder={t('form.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-11 w-full rounded-none border border-[#E5E2DC] bg-white px-4 py-3 text-sm font-light text-[var(--color-charcoal)] transition-all duration-300 outline-none placeholder:text-[#A19E95] hover:border-[var(--color-deep-green)]/40 focus:border-[var(--color-deep-green)] focus:ring-1 focus:ring-[var(--color-deep-green)]"
                />
              </div>

              {/* Message field */}
              <div className="flex flex-col text-start">
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-[10px] font-semibold tracking-wider text-[#7C7A74] uppercase"
                >
                  {t('form.message')}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder={t('form.messagePlaceholder')}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (errors.message) setErrors((prev) => ({ ...prev, message: '' }))
                  }}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  className={cn(
                    'w-full resize-none rounded-none border bg-white px-4 py-3 text-sm font-light text-[var(--color-charcoal)] transition-all duration-300 outline-none placeholder:text-[#A19E95]',
                    errors.message
                      ? 'border-destructive focus:border-destructive'
                      : 'border-[#E5E2DC] hover:border-[var(--color-deep-green)]/40 focus:border-[var(--color-deep-green)] focus:ring-1 focus:ring-[var(--color-deep-green)]'
                  )}
                />
                {errors.message && (
                  <p id="message-error" className="text-destructive mt-1.5 text-xs font-light">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit / Reassurance Row */}
              <div className="flex flex-col gap-6 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[11px] font-light text-[#7C7A74]">{t('form.reassurance')}</p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'h-11 w-full cursor-pointer bg-[var(--color-deep-green)] px-10 text-xs font-semibold tracking-widest text-white uppercase transition-colors duration-300 outline-none hover:bg-[#253f25] disabled:pointer-events-none disabled:opacity-50 sm:w-auto'
                  )}
                  style={{ letterSpacing: isAr ? '0' : '0.15em' }}
                >
                  {isSubmitting ? t('form.submitting') : t('form.submit')}
                </button>
              </div>

              {submitError && (
                <div
                  aria-live="polite"
                  className="text-destructive mt-4 text-start text-xs font-light"
                >
                  {submitError}
                </div>
              )}
            </form>
          </div>
        )}
      </section>

      {/* ─── 5. FAQ SECTION ─── */}
      <section className="mx-auto mb-12 max-w-3xl">
        <div className="mb-12 text-center">
          <h2
            className="mb-2 text-2xl font-light text-[var(--color-charcoal)] md:text-3xl"
            style={{ fontFamily: fontSerif }}
          >
            {t('faq.title')}
          </h2>
          <p className="text-sm font-light text-[#7C7A74]">{t('faq.subtitle')}</p>
        </div>

        <div className="space-y-2 border-t border-[#E5E2DC] pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className="border-b border-[#E5E2DC]/60 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="group flex w-full cursor-pointer items-center justify-between py-5 text-start outline-none"
                  aria-expanded={isOpen}
                >
                  <h3
                    className={cn(
                      'pr-4 text-sm font-light transition-colors duration-200 md:text-base rtl:pr-0 rtl:pl-4',
                      isOpen
                        ? 'font-medium text-[var(--color-deep-green)]'
                        : 'text-[var(--color-charcoal)] group-hover:text-[var(--color-deep-green)]'
                    )}
                  >
                    {faq.question}
                  </h3>
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center text-[#7C7A74] transition-colors duration-200 group-hover:text-[var(--color-deep-green)]">
                    {isOpen ? (
                      <Minus className="h-4 w-4 stroke-[1.2]" />
                    ) : (
                      <Plus className="h-4 w-4 stroke-[1.2]" />
                    )}
                  </div>
                </button>

                <div
                  className={cn(
                    'grid transition-all duration-300 ease-in-out',
                    isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed font-light text-[#5A5852]">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
