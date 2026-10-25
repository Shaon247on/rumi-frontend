import type {
  ChatImageAttachment,
  ChatMessage,
  ChatProductRecommendation,
  ChatRole,
} from './ai-chat-socket.types'
import { isRecord, toStringValue } from './ai-chat-socket-guards'

export const createMessageId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const normalizeRole = (value: unknown): ChatRole => {
  const role = toStringValue(value).toLowerCase()

  if (role === 'user' || role === 'assistant' || role === 'system') {
    return role
  }

  return 'assistant'
}

const formatPrice = (value: unknown) => {
  if (typeof value === 'number') {
    return `$${value.toFixed(2)}`
  }

  const price = toStringValue(value)

  return price || undefined
}

const toContentValue = (value: unknown) => {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return ''
}

const normalizeProduct = (value: unknown): ChatProductRecommendation | undefined => {
  if (!isRecord(value)) {
    return undefined
  }

  const name =
    toStringValue(value.name) ||
    toStringValue(value.product_name) ||
    toStringValue(value.title) ||
    toStringValue(value.productName)

  if (!name) {
    return undefined
  }

  return {
    brand:
      toStringValue(value.brand) ||
      toStringValue(value.brand_name) ||
      toStringValue(value.manufacturer) ||
      undefined,
    href:
      toStringValue(value.href) ||
      toStringValue(value.url) ||
      toStringValue(value.product_url) ||
      toStringValue(value.productUrl) ||
      undefined,
    image:
      toStringValue(value.image) ||
      toStringValue(value.image_url) ||
      toStringValue(value.imageUrl) ||
      toStringValue(value.thumbnail) ||
      undefined,
    name,
    price: formatPrice(value.price),
  }
}

const normalizeImage = (value: unknown): ChatImageAttachment | undefined => {
  if (typeof value === 'string') {
    const src = value.trim()

    if (!src) {
      return undefined
    }

    return {
      name: 'selected-image',
      size: 0,
      src,
      type: 'image/*',
    }
  }

  if (!isRecord(value)) {
    return undefined
  }

  const src =
    toStringValue(value.src) ||
    toStringValue(value.photo) ||
    toStringValue(value.image) ||
    toStringValue(value.image_url) ||
    toStringValue(value.imageUrl) ||
    toStringValue(value.photo_url) ||
    toStringValue(value.photoUrl)

  if (!src) {
    return undefined
  }

  return {
    name: toStringValue(value.name) || 'selected-image',
    size: Number(value.size) || 0,
    src,
    type: toStringValue(value.type) || 'image/*',
  }
}

export const normalizeChatMessage = (
  payload: unknown,
  fallbackRole: ChatRole = 'assistant'
): ChatMessage | null => {
  if (typeof payload === 'string') {
    const content = payload

    if (!content.trim()) {
      return null
    }

    return {
      content,
      createdAt: new Date().toISOString(),
      id: createMessageId(),
      role: fallbackRole,
    }
  }

  if (!isRecord(payload)) {
    return null
  }

  const content =
    toContentValue(payload.content) ||
    toContentValue(payload.message) ||
    toContentValue(payload.text) ||
    toContentValue(payload.response) ||
    toContentValue(payload.answer)

  const image = normalizeImage(
    payload.image ??
      payload.photo ??
      payload.attachment ??
      payload.media ??
      payload.file ??
      payload.image_url ??
      payload.photo_url
  )
  const product = normalizeProduct(payload.product ?? payload.products)
  const role = normalizeRole(payload.role ?? payload.sender ?? payload.type)
  const hasContent = content.trim().length > 0

  if (!hasContent && !product && !image) {
    return null
  }

  return {
    content,
    createdAt: new Date().toISOString(),
    id: createMessageId(),
    image,
    product,
    role: hasContent ? role : 'assistant',
  }
}

export const normalizeChatMessageList = (value: unknown) => {
  if (!Array.isArray(value)) {
    return []
  }

  const messages: ChatMessage[] = []

  for (const item of value) {
    const message = normalizeChatMessage(item)

    if (message) {
      messages.push(message)
    }
  }

  return messages
}
