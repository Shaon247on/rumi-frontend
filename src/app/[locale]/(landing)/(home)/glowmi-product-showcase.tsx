import { getTranslations, getLocale } from 'next-intl/server'
import { LazyVideo } from './lazy-video'
import { cn } from '@/lib/utils'

export const GlowmiProductShowcase = async () => {
  const t = await getTranslations('home.products_showcase')
  const locale = await getLocale()
  const isAR = locale === 'ar'

  return (
    <div className="my-16 w-full md:my-24">
      {/* Video Section with Text Overlay */}
      <div className="relative h-[450px] w-full overflow-hidden sm:h-[550px] md:h-[650px] lg:h-[750px]">
        <LazyVideo />

        {/* Text Overlay with Direction-Aware Vignette Gradient */}
        <div
          className={cn(
            'absolute inset-0 flex items-center',
            isAR ? 'justify-end text-right' : 'justify-start text-left'
          )}
          style={{
            background: isAR
              ? 'linear-gradient(270deg, rgba(10, 24, 15, 0.75) 0%, rgba(10, 24, 15, 0.45) 45%, rgba(10, 24, 15, 0) 100%)'
              : 'linear-gradient(90deg, rgba(10, 24, 15, 0.75) 0%, rgba(10, 24, 15, 0.45) 45%, rgba(10, 24, 15, 0) 100%)',
          }}
        >
          <div className="max-w-2xl px-8 py-10 select-none sm:px-16 md:px-24 lg:px-32">
            {/* Elegant, Understated Eyebrow */}
            <span
              className={cn(
                'mb-4 block text-[10px] font-medium text-[#FAF8F4]/60 uppercase md:mb-5 md:text-[11px]',
                isAR ? '' : 'tracking-[0.3em]'
              )}
              style={{
                fontFamily: isAR ? 'var(--font-amiri), serif' : 'var(--font-jost), sans-serif',
              }}
            >
              {t('eyebrow')}
            </span>

            {/* Serif Heading for LTR, beautifully-spaced Arabic header */}
            <h2
              className={cn(
                'mb-6 text-3xl leading-[1.2] font-extralight text-white sm:text-4xl md:text-5xl lg:text-6xl',
                isAR ? 'font-normal' : 'italic'
              )}
              style={{
                fontFamily: isAR ? 'var(--font-amiri), serif' : 'var(--font-jost), sans-serif',
              }}
            >
              {t('heading')}
            </h2>

            {/* Subheading / Copy */}
            <p
              className="max-w-md text-sm leading-relaxed font-light text-[#FAF8F4]/80 sm:text-base"
              style={{
                fontFamily: isAR ? 'var(--font-amiri), serif' : undefined,
              }}
            >
              {t('subheading')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
