'use client'

import { useTranslations } from 'next-intl'

export const ChatThinkingBubble = () => {
  const t = useTranslations('aiChatAssistant')

  return (
    <div className="flex justify-start">
      <div className="max-w-[88%] rounded-3xl border border-dashed border-[#6956CB]/30 bg-[#F4F1FF] px-5 py-4 shadow-sm md:max-w-[72%]">
        <p className="text-main-button text-sm font-medium">{t('thinking.title')}</p>
        <div className="mt-3 flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2 animate-pulse rounded-full bg-[#6956CB] [animation-delay:-0.3s]" />
          <span className="size-2 animate-pulse rounded-full bg-[#6956CB] [animation-delay:-0.15s]" />
          <span className="size-2 animate-pulse rounded-full bg-[#6956CB]" />
        </div>
      </div>
    </div>
  )
}
