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
    <div className="bg-background flex h-dvh flex-col overflow-hidden">
      <CommonNav />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 lg:px-40">
          <AiChatContent
            connectionError={connectionError}
            connectionState={connectionState}
            isThinking={isThinking}
            messages={messages}
            onRetry={retry}
          />
        </div>

        <div className="bg-background shrink-0 border-t border-black/5 px-6 lg:px-40">
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
