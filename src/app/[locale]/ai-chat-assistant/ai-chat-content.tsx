'use client'

import { useChatHistory } from '@/api/api-hooks/shop.api-hooks'
import { type ChatConnectionState, type ChatMessage } from '@/components/socket'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useRef } from 'react'
import { ChatConnectionBadge } from './chat-connection-badge'
import { ChatEmptyState } from './chat-empty-state'
import { ChatLoadingSkeleton } from './chat-loading-skeleton'
import { ChatMessageBubble } from './chat-message-bubble'
import { ChatThinkingBubble } from './chat-thinking-bubble'
import { mapChatHistoryMessage, mergeChatMessages } from './chat-history-utils'

type AiChatContentProps = {
  connectionError: string | null
  connectionState: ChatConnectionState
  isThinking: boolean
  messages: ChatMessage[]
  onRetry: () => void
}

export const AiChatContent = ({
  connectionError,
  connectionState,
  isThinking,
  messages,
  onRetry,
}: AiChatContentProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const t = useTranslations('aiChatAssistant')
  const { data: chatHistory, refetch: refetchChatHistory } = useChatHistory()

  const historyMessages = useMemo(
    () => (chatHistory?.messages ?? []).map(mapChatHistoryMessage),
    [chatHistory]
  )

  const visibleMessages = useMemo(
    () => mergeChatMessages(historyMessages, messages),
    [historyMessages, messages]
  )

  const hasVisibleMessages = visibleMessages.length > 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [connectionState, isThinking, visibleMessages.length])

  useEffect(() => {
    if (connectionState !== 'connected' || isThinking || messages.length === 0) {
      return
    }

    void refetchChatHistory()
  }, [connectionState, isThinking, messages.length, refetchChatHistory])

  return (
    <div className="flex min-h-full flex-col gap-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <ChatConnectionBadge state={connectionState} />
        {connectionError ? <p className="text-xs text-red-600">{connectionError}</p> : null}
      </div>

      {!hasVisibleMessages && connectionState === 'connecting' ? <ChatLoadingSkeleton /> : null}

      {!hasVisibleMessages && connectionState === 'error' ? (
        <ChatEmptyState onRetry={onRetry} />
      ) : null}

      {!hasVisibleMessages && connectionState === 'connected' ? (
        <div className="flex min-h-full items-center justify-center py-16">
          <div className="max-w-xl rounded-3xl border border-black/5 bg-white/70 p-8 text-center shadow-sm backdrop-blur-sm">
            <h2 className="text-main-button text-2xl font-semibold">{t('empty.title')}</h2>
            <p className="text-main-button/70 mt-3 text-sm leading-6">{t('empty.description')}</p>
          </div>
        </div>
      ) : null}

      {visibleMessages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}

      {isThinking ? <ChatThinkingBubble /> : null}

      <div ref={bottomRef} />
    </div>
  )
}
