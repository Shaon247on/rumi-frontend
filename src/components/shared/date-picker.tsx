'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { endOfDay, startOfDay } from 'date-fns'
import { useState } from 'react'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  className?: string
  labelName?: string
  minDate?: Date
  maxDate?: Date
}

export function DatePicker(props: DatePickerProps) {
  const { value, onChange, className, labelName = 'Select date', minDate, maxDate } = props
  const [open, setOpen] = useState(false)
  const [internalDate, setInternalDate] = useState<Date | undefined>(value)
  const isControlled = 'value' in props
  const selectedDate = isControlled ? value : internalDate

  const isDateDisabled = (selectedDate: Date) => {
    if (minDate && selectedDate < startOfDay(minDate)) {
      return true
    }

    if (maxDate && selectedDate > endOfDay(maxDate)) {
      return true
    }

    return false
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            id="date"
            className={cn('justify-start rounded-full font-normal', className)}
          >
            {selectedDate ? selectedDate.toLocaleDateString() : labelName}
          </Button>
        }
      />
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          defaultMonth={selectedDate}
          captionLayout="dropdown"
          disabled={minDate || maxDate ? isDateDisabled : undefined}
          onSelect={(date) => {
            if (!isControlled) {
              setInternalDate(date)
            }

            setOpen(false)
            onChange?.(date)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
