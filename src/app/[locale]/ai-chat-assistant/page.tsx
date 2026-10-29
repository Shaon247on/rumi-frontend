'use client'

import { CommonNav } from '@/components/shared'
import { useAiChatSocket } from '@/components/socket'
import { useTranslations } from 'next-intl'
import { AiChatContent } from './ai-chat-content'
import { AiChatBox } from './ai-chatbox'

const AiChatAssistant = () => {
  const t = useTranslations('aiChatAssistant')
  const {
    connectionError,
    connectionState,
    draft,
    isThinking,
    messages,
    retry,
    sendMessage,
    setDraft,
  } = useAiChatSocket({
    authRequired: t('errors.authRequired'),
    connectionClosed: t('errors.connectionClosed'),
    connectionError: t('errors.connectionError'),
    connectionNotReady: t('errors.connectionNotReady'),
  })

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-ivory">
      <CommonNav />

      <header className="shrink-0 border-b border-[#E6DFD5] px-4 py-5 text-center md:py-6">
        <p className="text-[11px] tracking-[0.3em] text-[#8C8275] uppercase">{t('header.eyebrow')}</p>
        <h1 className="mt-1 font-serif text-2xl font-light text-[#1C1C1A] md:text-3xl">
          {t('header.title')}
        </h1>
        <p className="mt-1 text-xs text-[#5C564E] md:text-sm">{t('header.subtitle')}</p>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 md:px-6">
          <AiChatContent
            connectionError={connectionError}
            connectionState={connectionState}
            isThinking={isThinking}
            messages={messages}
            onRetry={retry}
          />
        </div>

        <div className="shrink-0 border-t border-[#E6DFD5] bg-ivory px-4 md:px-6">
          <AiChatBox
            connectionError={connectionError}
            connectionState={connectionState}
            draft={draft}
            onDraftChange={setDraft}
            onRetry={retry}
            onSend={sendMessage}
          />
        </div>
      </main>
    </div>
  )
}

export default AiChatAssistant
