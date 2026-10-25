'use client'

import type { ChatMessage } from '@/components/socket'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ChatProductRecommendationCard } from './chat-product-recommendation-card'

export const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[88%] rounded-3xl px-5 py-4 shadow-sm md:max-w-[72%]',
          isUser ? 'bg-[#6956CB] text-white' : 'bg-[#7D7D7D] text-white'
        )}
      >
        {message.image ? (
          <div className="mb-3 overflow-hidden rounded-2xl bg-white/10">
            <Image
              src={message.image.src}
              alt={message.image.name}
              width={640}
              height={384}
              unoptimized
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        {message.content.trim() ? (
          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>
        ) : null}

        {message.product ? <ChatProductRecommendationCard product={message.product} /> : null}
      </div>
    </div>
  )
}
