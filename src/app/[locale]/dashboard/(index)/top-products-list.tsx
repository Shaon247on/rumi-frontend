import type { DashboardSummary } from '@/api/query-list/admin/dashboard-query'
import productFallbackImage from '@/assets/image/no-image-placeholder.svg'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatSAR } from '@/lib/price'
import Image from 'next/image'

export const TopProductsList = ({ products }: { products: DashboardSummary['top_products'] }) => {
  return (
    <Card className="border-0">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Top Products by Units Sold</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full">
          <thead>
            <tr className="text-muted-foreground text-left text-sm">
              <th className="pb-4 font-normal">Name</th>
              <th className="pb-4 font-normal">Price</th>
              <th className="pb-4 font-normal">Units Sold</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-gray-200">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.image || productFallbackImage}
                      alt={product.name}
                      width={40}
                      height={40}
                      unoptimized
                      className="size-10 rounded object-contain"
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="py-4">{formatSAR(product.price)}</td>
                <td className="py-4">{product.units_sold}</td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr className="border-t border-gray-200">
                <td colSpan={3} className="text-muted-foreground py-8 text-center text-sm">
                  No sales yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
