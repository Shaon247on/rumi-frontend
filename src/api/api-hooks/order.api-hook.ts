import { useQuery } from '@tanstack/react-query'

import { orderApi } from '../query-list/order.query'

const ORDER_KEYS = {
  all: () => ['orders'] as const,
  history: () => ['orders', 'history'] as const,
}

export const useOrderHistory = (enabled = true) => {
  return useQuery({
    queryKey: ORDER_KEYS.history(),
    queryFn: () => orderApi.getHistory(),
    enabled,
    select: (response) => response.data.data,
  })
}
