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
  // History is fetched once per visit; everything after that comes from the live socket
  // (live messages keep product cards and photos that history does not store).
  const { data: chatHistory } = useChatHistory()

  const historyMessages = useMemo(
    () => (chatHistory?.messages ?? []).map(mapChatHistoryMessage),
    [chatHistory]
  )

  const visibleMessages = useMemo(
    () => mergeChatMessages(historyMessages, messages),
    [historyMessages, messages]
  )

  const hasVisibleMessages = visibleMessages.length > 0
  const lastMessage = visibleMessages[visibleMessages.length - 1]
  const lastContentLength = lastMessage?.content.length ?? 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [connectionState, isThinking, visibleMessages.length, lastContentLength])

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col gap-4 py-6">
      {connectionState !== 'connected' || connectionError ? (
        <div className="flex items-center justify-between gap-3">
          <ChatConnectionBadge state={connectionState} />
          {connectionError ? <p className="text-xs text-red-700">{connectionError}</p> : null}
        </div>
      ) : null}

      {!hasVisibleMessages && connectionState === 'connecting' ? <ChatLoadingSkeleton /> : null}

      {!hasVisibleMessages && connectionState === 'error' ? (
        <ChatEmptyState onRetry={onRetry} />
      ) : null}

      {!hasVisibleMessages && connectionState === 'connected' ? (
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="max-w-md text-center">
            <h2 className="font-serif text-2xl font-light text-[#1C1C1A] md:text-3xl">
              {t('empty.title')}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#5C564E]">{t('empty.description')}</p>
          </div>
        </div>
      ) : null}

      {visibleMessages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}

      {isThinking && lastMessage?.role === 'user' ? <ChatThinkingBubble /> : null}

      <div ref={bottomRef} />
    </div>
  )
}
