import { Inter, Noto_Naskh_Arabic, Cormorant_Garamond, Amiri } from 'next/font/google'
import localFont from 'next/font/local'

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant-garamond',
})

export const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-amiri',
})

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'sans-serif'],
})

// Alias lato to inter to satisfy existing imports without using the actual Lato typeface
export const lato = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
  fallback: ['system-ui', 'sans-serif'],
})

export const ibmPlexArabic = localFont({
  src: [
    {
      path: '../../public/fonts/ibm-plex-arabic-400-arabic.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm-plex-arabic-400-latin.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm-plex-arabic-500-arabic.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm-plex-arabic-500-latin.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm-plex-arabic-600-arabic.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/ibm-plex-arabic-600-latin.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-ibm-plex-arabic',
  fallback: ['Noto Kufi Arabic', 'sans-serif'],
})

export const notoNaskhArabic = Noto_Naskh_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-noto-naskh-arabic',
  fallback: ['sans-serif'],
})

export const jost = localFont({
  src: [
    {
      path: '../../public/fonts/jost-300-latin.woff2',
      weight: '300',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-jost',
  fallback: ['sans-serif'],
})

const fontList = [inter, ibmPlexArabic, notoNaskhArabic, jost, lato, cormorantGaramond, amiri]
export const fonts = fontList.map((f) => f.variable).join(' ')
