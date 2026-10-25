import { Button } from '@/components/ui'
import { AlertCircle, RefreshCw } from 'lucide-react'

export function ProductDetailsMessage({
  title,
  description,
  actionLabel,
  busyLabel,
  onAction,
  isBusy = false,
}: {
  title: string
  description: string
  actionLabel?: string
  busyLabel?: string
  onAction?: () => void
  isBusy?: boolean
}) {
  return (
    <div className="bg-background min-h-screen px-6 py-12 lg:px-8">
      <div className="mx-auto flex max-w-3xl items-center justify-center">
        <div className="border-border bg-card w-full rounded-2xl border p-8 text-center shadow-sm">
          <AlertCircle className="text-main-button mx-auto size-12" />
          <h1 className="text-main-button mt-4 text-2xl font-normal">{title}</h1>
          <p className="text-main-button/70 mt-3 text-sm leading-relaxed">{description}</p>
          {onAction && actionLabel ? (
            <Button
              type="button"
              variant="outline"
              className="border-main-button text-main-button mt-6 rounded-md px-6"
              onClick={onAction}
              disabled={isBusy}
            >
              <RefreshCw className="size-4" />
              {isBusy ? (busyLabel ?? actionLabel) : actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
