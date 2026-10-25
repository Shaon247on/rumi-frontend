const getBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (baseUrl) {
    return baseUrl
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return 'http://localhost:3000'
}

export const buildWebSocketUrl = (accessToken: string) => {
  const url = new URL('/ws/chat/', getBaseUrl())
  url.protocol = url.protocol === 'https:' || url.protocol === 'wss:' ? 'wss:' : 'ws:'
  url.searchParams.set('token', accessToken)
  return url.toString()
}
