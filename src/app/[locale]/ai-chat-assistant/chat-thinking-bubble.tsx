'use client'

import { useTranslations } from 'next-intl'

export const ChatThinkingBubble = () => {
  const t = useTranslations('aiChatAssistant')

  return (
    <div className="flex justify-start" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-2xl border border-[#E6DFD5] bg-white px-5 py-3">
        <div className="flex items-center gap-1" aria-hidden="true">
          <span className="size-1.5 animate-pulse rounded-full bg-[#8C8275] [animation-delay:-0.3s]" />
          <span className="size-1.5 animate-pulse rounded-full bg-[#8C8275] [animation-delay:-0.15s]" />
          <span className="size-1.5 animate-pulse rounded-full bg-[#8C8275]" />
        </div>
        <p className="text-sm text-[#5C564E]">{t('thinking.title')}</p>
      </div>
    </div>
  )
}
