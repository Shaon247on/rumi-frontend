import type { ChatImageAttachment } from './ai-chat-socket.types'

export const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => {
      reject(reader.error ?? new Error('Unable to read the selected image.'))
    }

    reader.onload = () => {
      const result = reader.result

      if (typeof result === 'string') {
        resolve(result)
        return
      }

      reject(new Error('Unable to read the selected image.'))
    }

    reader.readAsDataURL(file)
  })

export const createChatImageAttachment = async (file: File): Promise<ChatImageAttachment> => {
  const src = await readFileAsDataUrl(file)

  return {
    name: file.name,
    size: file.size,
    src,
    type: file.type,
  }
}
