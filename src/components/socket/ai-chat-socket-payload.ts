import { normalizeChatMessage, normalizeChatMessageList } from './ai-chat-socket-message'
import { isRecord, toStringValue } from './ai-chat-socket-guards'
import type { ChatMessage } from './ai-chat-socket.types'

export const readSocketText = async (data: MessageEvent['data']) => {
  if (typeof data === 'string') {
    return data
  }

  if (data instanceof Blob) {
    return data.text()
  }

  if (data instanceof ArrayBuffer) {
    return new TextDecoder().decode(data)
  }

  if (ArrayBuffer.isView(data)) {
    const bytes = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)
    return new TextDecoder().decode(bytes)
  }

  return String(data)
}

type ParsedSocketPayload =
  | {
      error?: string
      message: ChatMessage
      mode: 'append'
    }
  | {
      messages: ChatMessage[]
      mode: 'replace'
    }
  | {
      error?: string
      mode: 'error'
    }
  | null

export const parseSocketPayload = (payload: unknown): ParsedSocketPayload => {
  if (Array.isArray(payload)) {
    return {
      mode: 'replace',
      messages: normalizeChatMessageList(payload),
    }
  }

  if (!isRecord(payload)) {
    const message = normalizeChatMessage(payload)

    return message
      ? {
          mode: 'append',
          message,
        }
      : null
  }

  if (Array.isArray(payload.messages)) {
    return {
      mode: 'replace',
      messages: normalizeChatMessageList(payload.messages),
    }
  }

  if (Array.isArray(payload.history)) {
    return {
      mode: 'replace',
      messages: normalizeChatMessageList(payload.history),
    }
  }

  const nestedData = payload.data

  if (Array.isArray(nestedData)) {
    return {
      mode: 'replace',
      messages: normalizeChatMessageList(nestedData),
    }
  }

  if (isRecord(nestedData)) {
    if (Array.isArray(nestedData.messages)) {
      return {
        mode: 'replace',
        messages: normalizeChatMessageList(nestedData.messages),
      }
    }

    if (Array.isArray(nestedData.history)) {
      return {
        mode: 'replace',
        messages: normalizeChatMessageList(nestedData.history),
      }
    }

    const nestedMessage = normalizeChatMessage(nestedData)

    if (nestedMessage) {
      return {
        mode: 'append',
        message: nestedMessage,
      }
    }
  }

  const errorText =
    toStringValue(payload.error) || toStringValue(payload.detail) || toStringValue(payload.message)
  const status = toStringValue(payload.status).toLowerCase()
  const type = toStringValue(payload.type).toLowerCase()

  if (errorText && (type === 'error' || status === 'error' || !normalizeChatMessage(payload))) {
    return {
      error: errorText,
      mode: 'error',
    }
  }

  const message = normalizeChatMessage(payload)

  return message
    ? {
        mode: 'append',
        message,
      }
    : null
}
