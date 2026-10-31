export const ORDER_STATUS_OPTIONS = [
  { value: 'pending', label: 'Order Placed' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'failed', label: 'Failed' },
]

export const getOrderStatusStyles = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-blue-500 text-white'
    case 'shipped':
      return 'bg-orange-500 text-white'
    case 'paid':
      return 'bg-teal-600 text-white'
    case 'cancelled':
    case 'failed':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

export const getOrderStatusLabel = (status: string) =>
  ORDER_STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status

export const getPaymentStatusStyles = (status: string) => {
  switch (status) {
    case 'paid':
      return 'border-green-200 bg-green-50 text-green-600'
    case 'pending':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    default:
      return 'border-red-200 bg-red-50 text-red-600'
  }
}
