'use client'

import { Logo } from '@/components/shared/logo'
import { useLocale, useTranslations } from 'next-intl'

export const WelcomeContent = () => {
  const locale = useLocale()
  const t = useTranslations('home.welcomeDialog')
  const isArabic = locale === 'ar'
  const withArabicPunctuationFix = (text: string) =>
    isArabic && /[.!؟،:]$/.test(text) ? `${text}\u200F` : text
  const messages = [
    t('messagePrimary'),
    t('messageSecondary'),
    t('messageTertiary'),
    t('messageQuaternary'),
  ]
    .filter(Boolean)
    .map(withArabicPunctuationFix)

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`relative flex min-h-121 flex-col bg-white px-6 pt-14 pb-12 sm:px-12 sm:pt-16 sm:pb-14 ${
        isArabic ? 'items-end text-right' : 'items-center text-center'
      }`}
    >
      <div
        className={`flex w-full max-w-190 flex-col gap-6 ${isArabic ? 'items-end' : 'items-center'}`}
      >
        <Logo className="h-16 w-16 animate-spin" style={{ animationDuration: '20s' }} />

        <h2 className="text-primary text-3xl font-semibold sm:text-4xl">{t('title')}</h2>

        <div className={`flex flex-col gap-4 ${isArabic ? 'items-end' : 'items-center'}`}>
          {messages.map((message, index) => (
            <p
              key={message}
              dir={isArabic ? 'rtl' : 'ltr'}
              className={
                index === 0
                  ? 'text-primary text-base leading-relaxed sm:text-lg'
                  : 'text-primary text-sm sm:text-base'
              }
            >
              {message}
            </p>
          ))}
        </div>

        <div className="mt-2 flex items-center gap-4">
          <span className="bg-primary h-px w-28 sm:w-36" />
          <span className="bg-primary h-2.5 w-2.5 rounded-full" />
          <span className="bg-primary h-px w-28 sm:w-36" />
        </div>

        <p dir={isArabic ? 'rtl' : 'ltr'} className="text-primary text-base sm:text-lg">
          {withArabicPunctuationFix(t('tagline'))}
        </p>
        {t('thanks') ? (
          <p dir={isArabic ? 'rtl' : 'ltr'} className="text-primary text-sm sm:text-base">
            {withArabicPunctuationFix(t('thanks'))}
          </p>
        ) : null}
      </div>
    </div>
  )
}
