'use client'

import { cn } from '@/lib/utils'

export const ChatLoadingSkeleton = () => {
  return (
    <div className="space-y-4 py-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`chat-skeleton-${index}`}
          className={cn('flex', index % 2 === 0 ? 'justify-start' : 'justify-end')}
        >
          <div className="space-y-2">
            <div className="h-4 w-28 animate-pulse rounded-full bg-black/10" />
            <div className="h-16 w-72 animate-pulse rounded-2xl bg-black/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
