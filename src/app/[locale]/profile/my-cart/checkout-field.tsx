'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

type InputFieldProps = {
  error?: string
  helperText?: string
  id: string
  label: string
} & ComponentProps<typeof Input>

export const CheckoutField = ({
  className,
  error,
  helperText,
  id,
  label,
  ...props
}: InputFieldProps) => {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-main-button text-sm font-medium">
        {label}
      </Label>
      <Input
        id={id}
        className={cn(
          'text-main-button placeholder:text-main-button/45 h-12 rounded-md bg-[#F8F5EE] shadow-none',
          error && 'border-destructive',
          className
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
      {helperText ? <p className="text-main-button/55 text-xs">{helperText}</p> : null}
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
