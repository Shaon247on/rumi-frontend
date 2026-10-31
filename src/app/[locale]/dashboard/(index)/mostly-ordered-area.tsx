import type { DashboardSummary } from '@/api/query-list/admin/dashboard-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const MostlyOrderedArea = ({ areas }: { areas: DashboardSummary['top_areas'] }) => {
  const topCity = areas[0]?.city
  const mapQuery = encodeURIComponent(topCity ? `${topCity}, Saudi Arabia` : 'Saudi Arabia')

  return (
    <Card className="border-0">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xl font-medium">Mostly Ordered Area</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full overflow-hidden rounded-xl">
          <iframe
            src={`https://www.google.com/maps?q=${mapQuery}&z=${topCity ? 10 : 5}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mostly Ordered Area Map"
          />
        </div>

        {areas.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {areas.map((area) => (
              <li key={area.city} className="rounded bg-[#F7F5ED] px-3 py-1 text-sm">
                {area.city} <span className="text-muted-foreground">· {area.orders}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  )
}
