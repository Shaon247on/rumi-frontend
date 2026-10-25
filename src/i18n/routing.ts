import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
})

export const localeNames: Record<string, string> = {
  en: 'English',
  ar: 'العربية',
  // fr: 'Français',
}
