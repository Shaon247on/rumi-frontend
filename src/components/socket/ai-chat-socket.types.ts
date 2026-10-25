export type ChatRole = 'assistant' | 'system' | 'user'

export type ChatConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error' | 'idle'

export type ChatProductRecommendation = {
  brand?: string
  href?: string
  image?: string
  name: string
  price?: string
}

export type ChatImageAttachment = {
  name: string
  size: number
  src: string
  type: string
}

export type ChatMessage = {
  content: string
  createdAt: string
  id: string
  image?: ChatImageAttachment
  product?: ChatProductRecommendation
  role: ChatRole
}

export type UseAiChatSocketCopy = {
  authRequired: string
  connectionClosed: string
  connectionError: string
  connectionNotReady: string
}

export type ChatSendMessagePayload = {
  photo?: File | null
  text: string
}
