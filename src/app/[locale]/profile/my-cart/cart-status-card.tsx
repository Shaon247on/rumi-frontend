import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

type CartStatusCardProps = {
  actionHref?: string
  actionLabel?: string
  onAction?: () => void
  title: string
}

export const CartStatusCard = ({
  actionHref,
  actionLabel,
  onAction,
  title,
}: CartStatusCardProps) => {
  return (
    <Card className="border-main-button/20 bg-brand-shade-10">
      <CardContent className="space-y-4 p-6 text-center">
        <p className="text-main-button text-sm">{title}</p>

        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="bg-main-button text-background mx-auto inline-flex rounded-full px-5 py-2 text-sm font-medium"
          >
            {actionLabel}
          </Link>
        ) : onAction && actionLabel ? (
          <Button
            type="button"
            className="bg-main-button text-background mx-auto rounded-full px-5 py-2 text-sm font-medium"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
