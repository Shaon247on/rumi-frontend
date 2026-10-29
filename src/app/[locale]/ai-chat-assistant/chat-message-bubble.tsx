'use client'

import type { ChatMessage } from '@/components/socket'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ChatProductRecommendationCard } from './chat-product-recommendation-card'

// Compact markdown styles sized for chat replies
const chatMarkdownComponents: Components = {
  h1: ({ children }) => <p className="mt-4 mb-2 font-semibold first:mt-0">{children}</p>,
  h2: ({ children }) => <p className="mt-4 mb-2 font-semibold first:mt-0">{children}</p>,
  h3: ({ children }) => <p className="mt-4 mb-2 font-semibold first:mt-0">{children}</p>,
  h4: ({ children }) => <p className="mt-3 mb-1.5 font-semibold first:mt-0">{children}</p>,
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 ps-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mb-3 list-decimal space-y-1 ps-5 last:mb-0">{children}</ol>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  a: ({ children, href }) => (
    <a href={href} className="underline underline-offset-2" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
}

export const ChatMessageBubble = ({ message }: { message: ChatMessage }) => {
  const t = useTranslations('aiChatAssistant')
  const isUser = message.role === 'user'
  const products = message.products?.length
    ? message.products
    : message.product
      ? [message.product]
      : []

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[90%] text-sm leading-relaxed md:max-w-[72%]',
          isUser
            ? 'rounded-2xl rounded-ee-md bg-[#1C1C1A] px-5 py-3 text-ivory'
            : 'rounded-2xl rounded-es-md border border-[#E6DFD5] bg-white px-5 py-4 text-[#2B2B2B]'
        )}
      >
        {message.image ? (
          <div className="mb-3 overflow-hidden rounded-xl">
            <Image
              src={message.image.src}
              alt={message.image.name}
              width={640}
              height={384}
              unoptimized
              className="h-auto max-h-72 w-full object-cover"
            />
          </div>
        ) : null}

        {message.content.trim() ? (
          isUser ? (
            <p className="break-words whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={chatMarkdownComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
          )
        ) : null}

        {products.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2">
            {products.map((product) => (
              <ChatProductRecommendationCard
                key={product.id ?? product.name}
                product={product}
              />
            ))}
          </div>
        ) : null}

        {message.suggestAnalysis ? (
          <div className="mt-4 rounded-xl bg-ivory p-4">
            <p className="text-sm text-[#2B2B2B]">{t('suggestAnalysis.title')}</p>
            <Link
              href="/skin-analyzer/skin-intelligence"
              className="mt-3 inline-flex rounded-full bg-[#1C1C1A] px-5 py-2.5 text-xs font-medium tracking-wide text-ivory transition-colors hover:bg-[#2C2A29]"
            >
              {t('suggestAnalysis.button')}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  )
}
