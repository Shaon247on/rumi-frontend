import { axiosClient } from '@/lib/axios'

// DRF list endpoints return this shape directly
export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export interface ListFilters {
  page?: number
  page_size?: number
  search?: string
}

/** Removes empty values so they never reach the query string. */
export const cleanParams = <T extends object>(params: T) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== 'all')
  )

export const fetchAdminList = async <T>(url: string, params: object) => {
  const response = await axiosClient.get<Paginated<T>>(url, { params: cleanParams(params) })
  return response.data
}

// ─── Dashboard summary ─────────────────────────────────────────────────────────

export interface SaleChartPoint {
  month: string
  thisMonth: number
  lastMonth: number
}

export interface WeeklyChart {
  points: { day: number; thisWeek: number; lastWeek: number; label: string }[]
  this_week: number
  last_week: number
  change: number
  range_label: string
}

export interface DashboardSummary {
  total_revenue: number
  total_orders: number
  total_customers: number
  product_views: number
  conversion_rate: number
  changes: Record<'revenue' | 'orders' | 'customers' | 'views' | 'conversion', number>
  performance: {
    new_orders: number
    shipped_orders: number
    delivered_orders: number
    cancelled_orders: number
    total: number
  }
  sale_chart: { year: number; range: string; points: SaleChartPoint[] }
  order_chart: WeeklyChart
  customer_chart: WeeklyChart
  top_products: {
    id: number
    name: string
    price: number
    units_sold: number
    image: string | null
  }[]
  recent_transactions: {
    id: number
    name: string
    date: string
    amount: number
    status: string
  }[]
  recent_orders: {
    id: number
    product: string
    sku: string | null
    image: string | null
    extra_items: number
    quantity: number
    date: string
    status: string
    amount: number
  }[]
  top_areas: { city: string; orders: number }[]
}

export interface SummaryFilters {
  range?: 'year' | '7' | '30'
  year?: number
}

export const dashboardApi = {
  getSummary: (filters: SummaryFilters) =>
    axiosClient.get<ApiEnvelope<DashboardSummary>>('/adminapi/dashboard/summary/', {
      params: filters,
    }),
}

// ─── Orders ────────────────────────────────────────────────────────────────────

export interface AdminOrderItem {
  id: number
  product: number
  product_name: string
  product_image: string | null
  quantity: number
  price: string
}

export interface AdminOrder {
  id: number
  user: number
  user_email: string
  user_membership: string
  total_amount: string
  status: string
  payment_status: string
  payment_method: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string | null
  postal_code: string
  country: string
  created_at: string
  items: AdminOrderItem[]
}

export interface OrderFilters extends ListFilters {
  status?: string
}

export const adminOrderApi = {
  getOrders: (filters: OrderFilters) => fetchAdminList<AdminOrder>('/adminapi/orders/', filters),

  updateStatus: (id: number, status: string) =>
    axiosClient.post<ApiEnvelope<AdminOrder>>(`/adminapi/orders/${id}/mark-delivered/`, { status }),

  deleteOrder: (id: number) => axiosClient.delete(`/adminapi/orders/${id}/`),
}

// ─── Customers & members ───────────────────────────────────────────────────────

export interface AdminCustomer {
  id: number
  membership_id: string
  id_format: string
  customer_name?: string
  location: string
  orders: number
  total_spent: string
  phone_number: string
}

export interface AdminCustomerDetail {
  id: number
  membership_id: string
  email: string
  role: string
  is_active: boolean
  name?: string
  contact_number?: string | null
  skin_type?: string | null
  birth_date?: string | null
  gender?: string | null
  image?: string | null
  address: string
  order_count: number
  total_spent: string | number
  orders: AdminOrder[]
  join_date: string
}

export interface AdminMember {
  membership_id: string
  name?: string
  email: string
  role: string
  contact_number?: string | null
  skin_type?: string | null
  birth_date?: string | null
  join_date: string
}

export interface CreateAdminUserData {
  email: string
  full_name: string
  contact_number?: string
  role: 'user' | 'admin'
  password: string
  confirm_password: string
}

export interface UpdateAdminUserData {
  email?: string
  full_name?: string
  contact_number?: string
  is_active?: boolean
}

export interface CustomerFilters extends ListFilters {
  sort?: string
}

export const adminUserApi = {
  getCustomers: (filters: CustomerFilters) =>
    fetchAdminList<AdminCustomer>('/adminapi/customers/', filters),

  getMembers: (filters: ListFilters) => fetchAdminList<AdminMember>('/adminapi/users/', filters),

  getCustomer: (membershipId: string) =>
    axiosClient.get<AdminCustomerDetail>(`/adminapi/customer/${membershipId}/`),

  createUser: (data: CreateAdminUserData) => axiosClient.post('/adminapi/users/', data),

  updateCustomer: (membershipId: string, data: UpdateAdminUserData) =>
    axiosClient.patch(`/adminapi/customer/${membershipId}/`, data),

  deleteUser: (membershipId: string) =>
    axiosClient.delete(`/adminapi/users/${membershipId}/delete/`),
}

// ─── Analyzers ─────────────────────────────────────────────────────────────────

export interface AdminAnalyzer {
  id: number
  full_name?: string
  email: string
  join_date: string
  active_status: 'active' | 'inactive'
}

export interface AdminRoutineStep {
  step?: string
  product_name?: string
  rationale?: string
}

export interface AdminRoutine {
  id: number
  skin_profile: {
    age?: number
    skin_type?: string
    concerns?: string[]
    additional_details?: string
  } | null
  routine_data: {
    am_routine?: AdminRoutineStep[]
    pm_routine?: AdminRoutineStep[]
    reasoning?: string
  } | null
  created_at: string
}

export interface AdminAnalyzerDetail extends AdminAnalyzer {
  image?: string | null
  location: string
  order_count: number
  routines: AdminRoutine[]
}

export interface AnalyzerFilters extends ListFilters {
  status?: string
}

export const adminAnalyzerApi = {
  getAnalyzers: (filters: AnalyzerFilters) =>
    fetchAdminList<AdminAnalyzer>('/adminapi/analyser/', filters),

  getAnalyzer: (id: number) => axiosClient.get<AdminAnalyzerDetail>(`/adminapi/analyser/${id}/`),

  deleteAnalyses: (id: number) => axiosClient.delete(`/adminapi/analyser/${id}/delete/`),
}

// ─── AI analytics ──────────────────────────────────────────────────────────────

export interface AiAnalytics {
  products: {
    id: number
    product_name: string
    sub_title: string | null
    category: string
    recommendations: number
    trend: string
    top_for: string
    image: string
  }[]
  performance_by_category: { category: string; current: number; previous: number }[]
}

export const adminAnalyticsApi = {
  getAnalytics: () => axiosClient.get<ApiEnvelope<AiAnalytics>>('/adminapi/ai-analytics/products/'),
}

// ─── Settings (privacy policy / terms) ─────────────────────────────────────────

export type PolicyKind = 'privacy-policy' | 'terms-and-conditions'

export interface AdminPolicy {
  id: number
  title: string
  content: string
  updated_at: string
}

export const adminPolicyApi = {
  getPolicy: (kind: PolicyKind) => fetchAdminList<AdminPolicy>(`/adminapi/${kind}/`, {}),

  // The backend keeps one document per kind: POST creates it or replaces it
  savePolicy: (kind: PolicyKind, data: { title: string; content: string }) =>
    axiosClient.post<ApiEnvelope<AdminPolicy>>(`/adminapi/${kind}/`, data),
}
