import type { DashboardSummary } from '@/api/query-list/admin/dashboard-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatSAR } from '@/lib/price'
import { format } from 'date-fns'

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-600',
  pending: 'bg-amber-100 text-amber-700',
}

export const RecentTransactions = ({
  transactions,
}: {
  transactions: DashboardSummary['recent_transactions']
}) => {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-muted-foreground border-b border-gray-200 text-left text-sm">
              <th className="pb-3 font-normal">Name</th>
              <th className="pb-3 font-normal">Date</th>
              <th className="pb-3 font-normal">Amount</th>
              <th className="pb-3 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100">
                <td className="py-4 font-medium">{transaction.name}</td>
                <td className="py-4">{format(new Date(transaction.date), 'dd.MM.yyyy')}</td>
                <td className="py-4">{formatSAR(transaction.amount)}</td>
                <td className="py-4">
                  <span
                    className={`rounded px-3 py-1 text-sm capitalize ${STATUS_STYLES[transaction.status] ?? STATUS_STYLES.pending}`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-muted-foreground py-8 text-center text-sm">
                  No transactions yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
