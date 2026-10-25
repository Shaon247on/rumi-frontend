'use client'

import joinModalIcon from '@/assets/image/Join-modal-icon.png'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

type BeMemberContentProps = {
  onJoinClick: () => void
}

export const BeMemberContent = ({ onJoinClick }: BeMemberContentProps) => {
  const t = useTranslations('home.beMemberDialog')

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Video */}
      <div className="flex size-full! items-center justify-center rounded-full">
        <video
          src="/dialog/be-member-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="mt-4 size-32 rounded-full! object-cover md:mt-0 md:size-110"
        />
      </div>

      {/* Right Side - Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 md:gap-12 md:px-12 md:py-16">
        {/* Header */}
        <div className="flex flex-col items-center gap-1 text-center md:gap-2">
          <h2 className="font-leto text-primary text-xl font-normal md:text-4xl">{t('title')}</h2>
          <p className="max-w-87 text-xs text-[#3E4259] md:text-base">{t('subtitle')}</p>
        </div>

        {/* Benefits Section */}
        <div className="flex w-full flex-col gap-4 md:gap-16">
          <div className="flex flex-col gap-4">
            {/* First Offer with Icon */}
            <div className="flex items-start gap-2">
              <div className="relative size-8 shrink-0">
                <Image src={joinModalIcon} alt="Image" />
              </div>
              <p className="text-xs text-[#3e4259] md:text-base">{t('firstOffer')}</p>
            </div>

            {/* Additional Benefits */}
            <p className="text-xs text-[#3e4259] md:text-base">{t('benefits')}</p>
          </div>

          {/* CTA Button */}
          <button
            type="button"
            onClick={onJoinClick}
            className="bg-primary mx-auto flex h-12 w-fit cursor-pointer items-center justify-center rounded px-12 py-5 text-white transition-colors hover:bg-gray-900 lg:text-xl"
          >
            {t('cta')}
          </button>
        </div>
      </div>
    </div>
  )
}
