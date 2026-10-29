import type { ShopChatHistoryMessage } from '@/api/query-list/shop.query'
import type { ChatMessage } from '@/components/socket'

export const mapChatHistoryMessage = (message: ShopChatHistoryMessage): ChatMessage => {
  return {
    content: message.content,
    createdAt: message.created_at,
    id: String(message.id),
    role: message.role,
  }
}

// History is a snapshot taken when the page opens, and live messages are everything sent
// since, so the two never overlap and can simply be joined.
export const mergeChatMessages = (historyMessages: ChatMessage[], liveMessages: ChatMessage[]) => [
  ...historyMessages,
  ...liveMessages,
]
