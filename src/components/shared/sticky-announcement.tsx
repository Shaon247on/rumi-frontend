'use client'

import { useExpiringDismissal } from '@/hooks/use-expiring-dismissal'
import { useMembershipModalStore } from '@/store/membership-modal.store'
import { useTranslations } from 'next-intl'

export const StickyAnnouncement = () => {
  const t = useTranslations('home.JoinGlowmiCircle')
  const openFromAnnouncement = useMembershipModalStore((state) => state.openFromAnnouncement)
  const { isReady, isDismissed } = useExpiringDismissal(
    'sticky-announcement-dismissed',
    24 * 60 * 60 * 1000
  )

  if (!isReady || isDismissed) return null

  return (
    <section>
      <button
        type="button"
        onClick={openFromAnnouncement}
        className="animate-bounce-kfm text-primary! border-primary! cursor-pointer rounded-full border px-6 py-1 text-[20px] focus:outline-none lg:text-[20px]"
      >
        {t('title')}
      </button>
    </section>
  )
}
