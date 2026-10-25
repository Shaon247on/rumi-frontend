import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { forwardRef } from 'react'

const inputVariants = cva('', {
  variants: {
    variant: {
      auth: 'border-input h-12 rounded-none border-0 border-b 0 border-b-black shadow-none',
      default: 'bg-[#F8F5EE] border-input h-12 rounded-lg border shadow-none',
    },
  },
  defaultVariants: {
    variant: 'auth',
  },
})

type AuthInputProps = {
  icon?: LucideIcon
  label?: string
  placeholder: string
  type?: string
  className?: string
  labelClassName?: string
  error?: string
} & VariantProps<typeof inputVariants> &
  React.ComponentPropsWithRef<'input'>

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      icon: Icon,
      label,
      placeholder,
      type = 'text',
      className,
      labelClassName,
      error,
      variant,
      ...props
    },
    ref
  ) => {
    // Default variant with label (no icon)
    if (variant === 'default') {
      return (
        <div className="space-y-1.5">
          {label && <label className={cn('text-sm font-medium', labelClassName)}>{label}</label>}
          <Input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={cn('h-12 rounded-md text-base', error && 'border-destructive', className)}
            aria-invalid={!!error}
            {...props}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
      )
    }

    // Auth variant with icon and underline
    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <InputGroup
          className={cn(inputVariants({ variant }), error && 'border-destructive', className)}
        >
          {Icon && (
            <InputGroupAddon className={cn('text-muted-foreground', error && 'text-destructive')}>
              <Icon className="size-5" />
            </InputGroupAddon>
          )}
          <InputGroupInput
            ref={ref}
            type={type}
            placeholder={placeholder}
            className="placeholder:text-muted-foreground h-full text-base"
            aria-invalid={!!error}
            {...props}
          />
        </InputGroup>
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    )
  }
)

AuthInput.displayName = 'AuthInput'
