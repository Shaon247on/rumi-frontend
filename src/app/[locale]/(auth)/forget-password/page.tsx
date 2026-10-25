'use client'

import { Link } from '@/i18n/navigation'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { FinalyResetForgetPassword } from './finaly-reset-forget-password'
import { SendForgetPasswordOtp } from './send-forget-password-otp'
import { VerifyForgetPasswordOtp } from './verify-forget-password-otp'

type Step = 'send' | 'verify' | 'reset'

const ForgetPassword = () => {
  const [step, setStep] = useState<Step>('send')
  const [email, setEmail] = useState('')

  const handleSendSuccess = (sentEmail: string) => {
    setEmail(sentEmail)
    setStep('verify')
  }

  const handleVerifySuccess = () => {
    setStep('reset')
  }

  return (
    <div className="auth-container">
      <Link href="/login" className="auth-back-btn">
        <ArrowLeft className="size-5" />
      </Link>

      {step === 'send' && <SendForgetPasswordOtp onSuccess={handleSendSuccess} />}
      {step === 'verify' && (
        <VerifyForgetPasswordOtp email={email} onSuccess={handleVerifySuccess} />
      )}
      {step === 'reset' && <FinalyResetForgetPassword email={email} />}
    </div>
  )
}

export default ForgetPassword
