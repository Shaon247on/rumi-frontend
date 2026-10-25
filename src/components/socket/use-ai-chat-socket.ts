'use client'

import { useAuthStore } from '@/store/auth.store'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createMessageId } from './ai-chat-socket-message'
import { createChatImageAttachment } from './ai-chat-socket-file'
import { buildWebSocketUrl } from './ai-chat-socket-url'
import { parseSocketPayload, readSocketText } from './ai-chat-socket-payload'
import type {
  ChatConnectionState,
  ChatMessage,
  ChatSendMessagePayload,
  UseAiChatSocketCopy,
} from './ai-chat-socket.types'

export const useAiChatSocket = (
  copy: UseAiChatSocketCopy = {
    authRequired: 'Please sign in to start chatting.',
    connectionClosed: 'The chat connection was closed. Retry to continue.',
    connectionError: 'Could not connect to the chat server.',
    connectionNotReady: 'The chat connection is not ready.',
  }
) => {
  const accessToken = useAuthStore((state) => state.token.accessToken)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [connectionState, setConnectionState] = useState<ChatConnectionState>(() =>
    accessToken ? 'connecting' : 'idle'
  )
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const socketRef = useRef<WebSocket | null>(null)
  const isClosingRef = useRef(false)
  const activeStreamingMessageIdRef = useRef<string | null>(null)
  const streamingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const shouldClearThinking = useCallback((incomingMessages: ChatMessage[]) => {
    return incomingMessages.some((message) => message.role !== 'user')
  }, [])

  const clearStreamingState = useCallback(() => {
    activeStreamingMessageIdRef.current = null

    if (streamingStopTimerRef.current) {
      clearTimeout(streamingStopTimerRef.current)
      streamingStopTimerRef.current = null
    }
  }, [])

  const scheduleStreamingStop = useCallback(() => {
    if (streamingStopTimerRef.current) {
      clearTimeout(streamingStopTimerRef.current)
    }

    streamingStopTimerRef.current = setTimeout(() => {
      activeStreamingMessageIdRef.current = null
      streamingStopTimerRef.current = null
      setIsThinking(false)
    }, 450)
  }, [])

  const mergeChatMessageChunk = useCallback(
    (currentMessages: ChatMessage[], incomingMessage: ChatMessage) => {
      if (incomingMessage.role === 'user') {
        clearStreamingState()
        return [...currentMessages, incomingMessage]
      }

      const activeMessageId = activeStreamingMessageIdRef.current

      if (activeMessageId) {
        const activeMessageIndex = currentMessages.findIndex(
          (message) => message.id === activeMessageId
        )

        if (activeMessageIndex >= 0) {
          const activeMessage = currentMessages[activeMessageIndex]

          const mergedMessage: ChatMessage = {
            ...activeMessage,
            content: `${activeMessage.content}${incomingMessage.content}`,
            createdAt: activeMessage.createdAt,
            image: incomingMessage.image ?? activeMessage.image,
            product: incomingMessage.product ?? activeMessage.product,
          }

          const nextMessages = [...currentMessages]
          nextMessages[activeMessageIndex] = mergedMessage
          return nextMessages
        }
      }

      activeStreamingMessageIdRef.current = incomingMessage.id
      return [...currentMessages, incomingMessage]
    },
    [clearStreamingState]
  )

  const closeSocket = useCallback(() => {
    isClosingRef.current = true
    clearStreamingState()

    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
  }, [clearStreamingState])

  const retry = useCallback(() => {
    setConnectionState('connecting')
    setRetryCount((current) => current + 1)
    setConnectionError(null)
    setIsThinking(false)
  }, [])

  const sendMessage = useCallback(
    async ({ text, photo }: ChatSendMessagePayload) => {
      const content = text.trim()
      const socket = socketRef.current

      if (!content && !photo) {
        return false
      }

      if (!accessToken) {
        setConnectionState('error')
        setConnectionError(copy.authRequired)
        return false
      }

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        setConnectionState('disconnected')
        setConnectionError(copy.connectionNotReady)
        return false
      }

      const imageAttachment = photo ? await createChatImageAttachment(photo) : undefined
      const outgoingMessageId = createMessageId()

      const outgoingMessage: ChatMessage = {
        content,
        createdAt: new Date().toISOString(),
        id: outgoingMessageId,
        image: imageAttachment,
        role: 'user',
      }

      clearStreamingState()
      setChatMessages((current) => [...current, outgoingMessage])

      try {
        socket.send(
          JSON.stringify({
            content,
            photo: imageAttachment?.src,
            photo_name: imageAttachment?.name,
            photo_size: imageAttachment?.size,
            photo_type: imageAttachment?.type,
            message: content,
            text: content,
            type: 'message',
          })
        )
        setIsThinking(true)
        setDraft('')
      } catch {
        setChatMessages((current) => current.filter((message) => message.id !== outgoingMessageId))
        setConnectionState('error')
        setConnectionError(copy.connectionError)
        setIsThinking(false)
        return false
      }

      return true
    },
    [
      accessToken,
      clearStreamingState,
      copy.authRequired,
      copy.connectionError,
      copy.connectionNotReady,
    ]
  )

  useEffect(() => {
    if (!accessToken) {
      closeSocket()
      return
    }

    let isActive = true

    const socket = new WebSocket(buildWebSocketUrl(accessToken))
    socketRef.current = socket
    isClosingRef.current = false

    socket.onopen = () => {
      if (!isActive) {
        return
      }

      setConnectionState('connected')
      setConnectionError(null)
    }

    socket.onmessage = (event) => {
      void (async () => {
        const text = await readSocketText(event.data)

        if (!text.trim()) {
          return
        }

        let parsedPayload: unknown = text

        try {
          parsedPayload = JSON.parse(text)
        } catch {
          parsedPayload = text
        }

        const normalized = parseSocketPayload(parsedPayload)

        if (!normalized) {
          return
        }

        if (normalized.mode === 'error') {
          setConnectionState('error')
          setConnectionError(normalized.error ?? copy.connectionError)
          setIsThinking(false)
          return
        }

        if (normalized.mode === 'replace') {
          clearStreamingState()
          if (shouldClearThinking(normalized.messages)) {
            setIsThinking(false)
          }
          setChatMessages(normalized.messages)
          return
        }

        setChatMessages((current) => mergeChatMessageChunk(current, normalized.message))

        if (normalized.message.role !== 'user') {
          setIsThinking(true)
          scheduleStreamingStop()
          return
        }
      })()
    }

    socket.onerror = () => {
      if (!isActive) {
        return
      }

      setConnectionState('error')
      setConnectionError(copy.connectionError)
      setIsThinking(false)
    }

    socket.onclose = () => {
      if (!isActive || isClosingRef.current) {
        return
      }

      setConnectionState('disconnected')
      setConnectionError(copy.connectionClosed)
      setIsThinking(false)
    }

    return () => {
      isActive = false
      closeSocket()
    }
  }, [
    accessToken,
    closeSocket,
    copy.connectionClosed,
    copy.connectionError,
    mergeChatMessageChunk,
    shouldClearThinking,
    scheduleStreamingStop,
    retryCount,
    clearStreamingState,
  ])

  const hasMessages = chatMessages.length > 0
  const resolvedConnectionState = !accessToken
    ? 'error'
    : connectionState === 'idle'
      ? 'connecting'
      : connectionState
  const resolvedConnectionError = !accessToken
    ? copy.authRequired
    : resolvedConnectionState === 'connecting'
      ? null
      : connectionError
  const resolvedIsThinking = accessToken ? isThinking : false
  const isConnected = resolvedConnectionState === 'connected'
  const isReady = Boolean(accessToken) && isConnected

  return useMemo(
    () => ({
      connectionError: resolvedConnectionError,
      connectionState: resolvedConnectionState,
      draft,
      hasMessages,
      isConnected,
      isReady,
      isThinking: resolvedIsThinking,
      messages: chatMessages,
      retry,
      sendMessage,
      setDraft,
    }),
    [
      resolvedConnectionError,
      resolvedConnectionState,
      draft,
      hasMessages,
      isConnected,
      isReady,
      resolvedIsThinking,
      chatMessages,
      retry,
      sendMessage,
    ]
  )
}
