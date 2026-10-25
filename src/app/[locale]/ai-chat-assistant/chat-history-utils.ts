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

export const mergeChatMessages = (historyMessages: ChatMessage[], liveMessages: ChatMessage[]) => {
  const latestHistoryTime = historyMessages.reduce((latest, message) => {
    const timestamp = Date.parse(message.createdAt)
    return Number.isNaN(timestamp) ? latest : Math.max(latest, timestamp)
  }, 0)

  const filteredLiveMessages =
    latestHistoryTime > 0
      ? liveMessages.filter((message) => {
          const timestamp = Date.parse(message.createdAt)
          return Number.isNaN(timestamp) ? true : timestamp > latestHistoryTime
        })
      : liveMessages

  return [...historyMessages, ...filteredLiveMessages]
}
