'use client'

import { type ChatConnectionState } from '@/components/socket'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

export const ChatConnectionBadge = ({ state }: { state: ChatConnectionState }) => {
  const t = useTranslations('aiChatAssistant')

  const labelMap: Record<ChatConnectionState, string> = {
    connected: t('status.connected'),
    connecting: t('status.connecting'),
    disconnected: t('status.disconnected'),
    error: t('status.error'),
    idle: t('status.idle'),
  }

  const toneClassMap: Record<ChatConnectionState, string> = {
    connected: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    connecting: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    disconnected: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
    error: 'bg-red-500/10 text-red-700 border-red-500/20',
    idle: 'bg-slate-500/10 text-slate-700 border-slate-500/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs',
        toneClassMap[state]
      )}
    >
      {labelMap[state]}
    </span>
  )
}
