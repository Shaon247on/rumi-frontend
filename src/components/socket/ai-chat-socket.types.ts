export type ChatRole = 'assistant' | 'system' | 'user'

export type ChatConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error' | 'idle'

export type ChatProductRecommendation = {
  id?: number
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
  products?: ChatProductRecommendation[]
  /** The consultant suggested running the full skin analysis */
  suggestAnalysis?: boolean
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
