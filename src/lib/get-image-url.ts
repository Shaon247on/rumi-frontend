export const getImageUrl = (path: string | undefined | null) => {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  return `${BASE_URL}${path}`
}
