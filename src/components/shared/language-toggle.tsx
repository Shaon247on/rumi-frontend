'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePathname, useRouter } from '@/i18n/navigation'
import { localeNames, routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'
import { Globe } from 'lucide-react'

export function LanguageToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-full text-[#363739] transition-colors hover:bg-[rgba(26,46,26,0.06)] hover:text-[#1a2e1a] focus:outline-none"
        aria-label="Change language"
      >
        <Globe className="size-4" strokeWidth={1.5} />
        <span className="sr-only">Toggle language</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[120px] rounded-xl border-[#e8e6e3] bg-white py-1 shadow-lg"
      >
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={cn(
              'cursor-pointer px-4 py-2 text-[10px] font-light tracking-[0.18em] text-[#363739] uppercase',
              locale === loc ? 'font-medium text-[#1a2e1a]' : ''
            )}
          >
            {localeNames[loc]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
