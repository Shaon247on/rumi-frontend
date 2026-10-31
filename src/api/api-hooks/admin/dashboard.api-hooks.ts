import { getApiErrorMessage } from '@/lib/api-error'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import {
  adminAnalyticsApi,
  adminAnalyzerApi,
  adminOrderApi,
  adminPolicyApi,
  adminUserApi,
  dashboardApi,
  type AnalyzerFilters,
  type CreateAdminUserData,
  type CustomerFilters,
  type ListFilters,
  type OrderFilters,
  type PolicyKind,
  type SummaryFilters,
  type UpdateAdminUserData,
} from '../../query-list/admin/dashboard-query'

/** Mutation that refreshes every dashboard query and reports the outcome with a toast. */
const useAdminMutation = <TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  successMessage: string,
  errorMessage: string,
  extraKeys: string[] = []
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,

    onSuccess: () => {
      for (const key of ['admin', ...extraKeys]) {
        queryClient.invalidateQueries({ queryKey: [key] })
      }
      toast.success(successMessage)
    },

    onError: (error: AxiosError) => {
      toast.error(getApiErrorMessage(error, errorMessage))
    },
  })
}

export const useDashboardSummary = (filters: SummaryFilters) => {
  return useQuery({
    queryKey: ['admin', 'summary', filters],
    queryFn: () => dashboardApi.getSummary(filters),
    select: (response) => response.data.data,
    placeholderData: keepPreviousData,
  })
}

// ─── Orders ────────────────────────────────────────────────────────────────────

export const useAdminOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: () => adminOrderApi.getOrders(filters),
    placeholderData: keepPreviousData,
  })
}

export const useUpdateOrderStatus = () =>
  useAdminMutation(
    ({ id, status }: { id: number; status: string }) => adminOrderApi.updateStatus(id, status),
    'Order status updated',
    'Failed to update order',
    // Cancelling an order puts its stock back on sale
    ['products']
  )

export const useDeleteOrder = () =>
  useAdminMutation((id: number) => adminOrderApi.deleteOrder(id), 'Order deleted', 'Failed to delete order')

// ─── Customers & members ───────────────────────────────────────────────────────

export const useAdminCustomers = (filters: CustomerFilters) => {
  return useQuery({
    queryKey: ['admin', 'customers', filters],
    queryFn: () => adminUserApi.getCustomers(filters),
    placeholderData: keepPreviousData,
  })
}

export const useAdminCustomer = (membershipId?: string) => {
  return useQuery({
    queryKey: ['admin', 'customer', membershipId],
    queryFn: () => adminUserApi.getCustomer(membershipId ?? ''),
    enabled: Boolean(membershipId),
    select: (response) => response.data,
  })
}

export const useAdminMembers = (filters: ListFilters) => {
  return useQuery({
    queryKey: ['admin', 'members', filters],
    queryFn: () => adminUserApi.getMembers(filters),
    placeholderData: keepPreviousData,
  })
}

export const useCreateAdminUser = () =>
  useAdminMutation(
    (data: CreateAdminUserData) => adminUserApi.createUser(data),
    'Customer created',
    'Failed to create customer'
  )

export const useUpdateAdminCustomer = () =>
  useAdminMutation(
    ({ membershipId, data }: { membershipId: string; data: UpdateAdminUserData }) =>
      adminUserApi.updateCustomer(membershipId, data),
    'Customer updated',
    'Failed to update customer'
  )

export const useDeleteAdminUser = () =>
  useAdminMutation(
    (membershipId: string) => adminUserApi.deleteUser(membershipId),
    'Deleted successfully',
    'Failed to delete'
  )

// ─── Analyzers ─────────────────────────────────────────────────────────────────

export const useAdminAnalyzers = (filters: AnalyzerFilters) => {
  return useQuery({
    queryKey: ['admin', 'analyzers', filters],
    queryFn: () => adminAnalyzerApi.getAnalyzers(filters),
    placeholderData: keepPreviousData,
  })
}

export const useAdminAnalyzer = (id?: number) => {
  return useQuery({
    queryKey: ['admin', 'analyzer', id],
    queryFn: () => adminAnalyzerApi.getAnalyzer(id ?? 0),
    enabled: id !== undefined,
    select: (response) => response.data,
  })
}

export const useDeleteAnalyses = () =>
  useAdminMutation(
    (id: number) => adminAnalyzerApi.deleteAnalyses(id),
    'Skin analyses deleted',
    'Failed to delete skin analyses'
  )

// ─── AI analytics ──────────────────────────────────────────────────────────────

export const useAiAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'ai-analytics'],
    queryFn: () => adminAnalyticsApi.getAnalytics(),
    select: (response) => response.data.data,
  })
}

// ─── Settings ──────────────────────────────────────────────────────────────────

export const useAdminPolicy = (kind: PolicyKind) => {
  return useQuery({
    queryKey: ['admin', 'policy', kind],
    queryFn: () => adminPolicyApi.getPolicy(kind),
    select: (response) => response.results[0] ?? null,
  })
}

export const useSaveAdminPolicy = (kind: PolicyKind) =>
  useAdminMutation(
    (data: { title: string; content: string }) => adminPolicyApi.savePolicy(kind, data),
    'Saved successfully',
    'Failed to save',
    ['policy-and-conditions']
  )
