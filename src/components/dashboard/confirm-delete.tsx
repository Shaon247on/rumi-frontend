'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'
import type { ReactElement } from 'react'
import { useState } from 'react'

export const ConfirmDelete = ({
  title,
  description,
  onConfirm,
  trigger,
}: {
  title: string
  description: string
  /** Resolves once the delete has finished; the dialog closes either way. */
  onConfirm: () => Promise<unknown>
  trigger?: ReactElement
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleConfirm = async () => {
    setIsPending(true)
    try {
      await onConfirm()
    } catch {
      // The mutation hook already shows the error toast
    } finally {
      setIsPending(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => (!isPending ? setIsOpen(open) : null)}>
      <AlertDialogTrigger
        render={
          trigger ?? (
            <button
              type="button"
              aria-label={title}
              className="cursor-pointer p-1 text-red-500 transition-colors hover:text-red-600"
            >
              <Trash2 className="size-4" />
            </button>
          )
        }
      />
      <AlertDialogContent className="data-[size=default]:max-w-xl!">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => void handleConfirm()} disabled={isPending}>
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
