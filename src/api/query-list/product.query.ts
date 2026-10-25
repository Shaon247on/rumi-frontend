import { axiosClient } from '@/lib/axios'

export const DEFAULT_PRODUCT_PAGE_SIZE = 6

export const PRODUCT_SKIN_TYPES = [
  'all',
  'oily',
  'dry',
  'normal',
  'combination',
  'sensitive',
] as const

export type ProductSkinType = (typeof PRODUCT_SKIN_TYPES)[number]

export interface ProductImage {
  id: number
  image: string
}

export interface Product {
  id: number
  category: number
  category_name?: string | null
  title: string
  sub_title?: string | null
  skin_type?: string | null
  description?: string | null
  key_ingredients?: string | null
  how_to_use: string | null
  key_benefits?: string | null
  size?: string | null
  sku?: string
  price: string
  discount?: string | null
  stock?: number | null
  reserved_stock?: number
  is_available?: boolean
  video?: string
  images: ProductImage[]
  order_count?: number | null
  created_at?: string
  updated_at?: string
}

export interface ProductDetails extends Product {
  related_products?: Product[]
}

export interface ProductsResponse {
  success: boolean
  message: string
  data: Product[] | PaginatedProductsData
}

export interface SingleProductsResponse {
  success: boolean
  message: string
  data: ProductDetails
}

export interface ProductFilters {
  category?: number
  max_price?: number
  min_price?: number
  page?: number
  page_size?: number
  search?: string
  skin_type?: ProductSkinType
}

export interface PaginatedProductsData {
  count: number
  next: string | null
  previous: string | null
  results: Product[]
}

export type UserProductsResponse = ProductsResponse

export interface NormalizedProductsResponse {
  count: number
  items: Product[]
  next: string | null
  page: number
  pageSize: number
  previous: string | null
  totalPages: number
}

const buildProductFiltersQuery = (filters?: ProductFilters) => {
  const params = new URLSearchParams()

  if (!filters) {
    return params
  }

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim())
  }

  if (filters.category !== undefined) {
    params.set('category', filters.category.toString())
  }

  if (filters.skin_type && filters.skin_type !== 'all') {
    params.set('skin_type', filters.skin_type)
  }

  if (filters.min_price !== undefined) {
    params.set('min_price', filters.min_price.toString())
  }

  if (filters.max_price !== undefined) {
    params.set('max_price', filters.max_price.toString())
  }

  if (filters.page !== undefined) {
    params.set('page', filters.page.toString())
  }

  if (filters.page_size !== undefined) {
    params.set('page_size', filters.page_size.toString())
  }

  return params
}

const isPaginatedProductsData = (data: ProductsResponse['data']): data is PaginatedProductsData => {
  return typeof data === 'object' && data !== null && 'results' in data
}

export const normalizeProductsResponse = (
  response: UserProductsResponse,
  filters?: ProductFilters
): NormalizedProductsResponse => {
  const page = filters?.page && filters.page > 0 ? filters.page : 1
  const pageSize =
    filters?.page_size && filters.page_size > 0 ? filters.page_size : DEFAULT_PRODUCT_PAGE_SIZE

  if (isPaginatedProductsData(response.data)) {
    const items = Array.isArray(response.data.results) ? response.data.results : []
    return {
      items,
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(response.data.count / pageSize)),
    }
  }

  const items = Array.isArray(response.data) ? response.data : []
  return {
    items,
    count: items.length,
    next: null,
    previous: null,
    page: 1,
    pageSize,
    totalPages: 1,
  }
}

export const productApi = {
  // Existing — user-scoped via /userapi/
  getProducts: () => axiosClient.get<ProductsResponse>('/userapi/products/'),

  getProductById: (id: number | string) =>
    axiosClient.get<SingleProductsResponse>(`/productapi/user/products/${id}/`),

  // Best products — sorted by order_count desc
  getBestProducts: () => axiosClient.get<ProductsResponse>('/productapi/products/best/'),

  // User-scoped via /productapi/user/products/
  getUserProducts: (filters?: ProductFilters) => {
    const query = buildProductFiltersQuery(filters).toString()
    const url = query ? `/productapi/user/products/?${query}` : '/productapi/user/products/'

    return axiosClient.get<UserProductsResponse>(url)
  },

  getUserProductById: (id: number | string) =>
    axiosClient.get<SingleProductsResponse>(`/productapi/products/user/${id}/`),
}
