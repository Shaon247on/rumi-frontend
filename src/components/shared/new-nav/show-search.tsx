import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const ShowSearch = () => {
  const t = useTranslations('shared.nav')

  return (
    <label className="w-full max-w-sm" htmlFor="nav-search">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#7a7d77]"
          strokeWidth={1.8}
        />

        <Input
          id="nav-search"
          type="search"
          placeholder={t('searchPlaceholder')}
          aria-label={t('searchLabel')}
          className="h-11 rounded-2xl border-[#e0d9cd] bg-[#fbfaf7] pl-10 text-sm shadow-none placeholder:text-[#8a8d87] focus-visible:border-[#1a2e1a] focus-visible:ring-[#1a2e1a]"
        />
      </div>
    </label>
  )
}
