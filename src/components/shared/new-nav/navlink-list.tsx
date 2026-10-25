'use client'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import Image, { StaticImageData } from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useId } from 'react'

export type NavLinkItem = {
  id: string | number
  icon?: StaticImageData
  label: string
  href: string
}

type NavLinkListProps = {
  items: NavLinkItem[]
  basePath?: string
  className?: string
  linkClassName?: string
  activeClassName?: string
  inactiveClassName?: string
  iconClassName?: string
  wrapperClassName?: string
}

export const NavLinkList = ({
  items,
  basePath,
  className,
  linkClassName,
  activeClassName = 'border-main-button',
  inactiveClassName = 'border-transparent',
  iconClassName = 'size-6',
}: NavLinkListProps) => {
  const pathname = usePathname()

  const isActive = (href: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
    const base = basePath || items[0]?.href

    if (href === base) {
      return pathWithoutLocale === base
    }
    return pathWithoutLocale.startsWith(href)
  }

  return (
    <div aria-label="tab-list" className={cn('mt-8 mb-10', className)}>
      <nav className="flex gap-8">
        {items.map((item) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const id = useId()
          return (
            <Link
              key={id}
              href={{ pathname: item.href }}
              className={cn(
                'text-main-button hover:text-main-button/80 flex items-center gap-2 border-b-2 pb-3 text-2xl leading-none font-normal transition-colors',
                linkClassName,
                isActive(item.href) ? activeClassName : inactiveClassName
              )}
            >
              {/* {item.icon && <item.icon className={iconClassName} />} */}
              {item.icon && <Image src={item.icon} alt="Icon" className={iconClassName} />}
              {item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
