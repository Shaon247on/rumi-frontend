import { NewFooter } from '@/components/shared/new-footer'
import { NewNav } from '@/components/shared/new-nav'
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NewNav />
      {children}
      <NewFooter />
    </>
  )
}

export default AuthLayout
