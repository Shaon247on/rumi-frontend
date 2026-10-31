'use client'

import { useCreateAdminUser } from '@/api/api-hooks/admin/dashboard.api-hooks'
import { Button } from '@/components/ui'
import { DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const customerSchema = z
  .object({
    name: z.string().trim().min(1, 'Customer name is required'),
    email: z.string().trim().email('Enter a valid email'),
    phoneNumber: z.string().trim().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm the password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

type CustomerFormData = z.infer<typeof customerSchema>

const fields: {
  name: keyof CustomerFormData
  label: string
  placeholder: string
  type?: string
}[] = [
  { name: 'name', label: 'Customer Name', placeholder: 'Name' },
  { name: 'email', label: 'Email', placeholder: 'name@example.com', type: 'email' },
  { name: 'phoneNumber', label: 'Phone Number', placeholder: '+966500000000' },
  { name: 'password', label: 'Password', placeholder: 'At least 8 characters', type: 'password' },
  { name: 'confirmPassword', label: 'Confirm Password', placeholder: 'Repeat it', type: 'password' },
]

export const AddCustomer = ({ onDone }: { onDone: () => void }) => {
  const { mutateAsync: createUser } = useCreateAdminUser()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  })

  const onSubmit = async (data: CustomerFormData) => {
    try {
      await createUser({
        email: data.email,
        full_name: data.name,
        contact_number: data.phoneNumber || undefined,
        role: 'user',
        password: data.password,
        confirm_password: data.confirmPassword,
      })
      onDone()
    } catch {
      // The mutation hook already shows the error toast
    }
  }

  return (
    <div className="space-y-8">
      <DialogTitle className="text-3xl font-medium text-white">Add Customer</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <div key={field.name} className="grid grid-cols-[140px_1fr] items-start gap-4">
            <label htmlFor={field.name} className="pt-2 text-white">
              {field.label}
            </label>
            <div>
              <Input
                id={field.name}
                type={field.type ?? 'text'}
                placeholder={field.placeholder}
                className="border-white/30 bg-transparent text-white placeholder:text-white/50"
                {...register(field.name)}
              />
              {errors[field.name] ? (
                <p className="mt-1 text-sm text-red-300">{errors[field.name]?.message}</p>
              ) : null}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="text-dashboard bg-white px-12 hover:bg-white/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'SAVING...' : 'SAVE'}
          </Button>
        </div>
      </form>
    </div>
  )
}
