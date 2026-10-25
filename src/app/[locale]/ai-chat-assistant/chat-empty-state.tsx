'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export const ChatEmptyState = ({ onRetry }: { onRetry: () => void }) => {
  const t = useTranslations('aiChatAssistant')

  return (
    <div className="flex min-h-full items-center justify-center py-16">
      <div className="max-w-xl rounded-3xl border border-black/5 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm">
        <h2 className="text-main-button text-2xl font-semibold">{t('empty.title')}</h2>
        <p className="text-main-button/70 mt-3 text-sm leading-6">{t('empty.description')}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button type="button" onClick={onRetry} variant="outline">
            {t('actions.retry')}
          </Button>
        </div>
      </div>
    </div>
  )
}
