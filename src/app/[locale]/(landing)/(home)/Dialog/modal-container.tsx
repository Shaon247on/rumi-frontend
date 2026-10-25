'use client'

import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { ReactNode, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../../../lib/utils'

const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

type ModalContainerProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  showCloseButton?: boolean
}

export const ModalContainer = ({
  isOpen,
  onClose,
  children,
  className = '',
  showCloseButton = true,
}: ModalContainerProps) => {
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isMounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-primary/50 fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
              `relative w-full max-w-225 overflow-hidden rounded-lg bg-white shadow-xl`,
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 z-20 flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                aria-label="Close dialog"
              >
                <X className="size-5 text-gray-700" />
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
