'use client'

import { useSessionStorage } from '@/hooks/useSessionStorage'
import { MembershipModalStep, useMembershipModalStore } from '@/store/membership-modal.store'
import { useEffect } from 'react'
import { BeMemberContent } from './Dialog/be-member-content'
import { CreateAccountContent } from './Dialog/create-account-content'
import { ModalContainer } from './Dialog/modal-container'
import { VerifyOtpMember } from './Dialog/verify-otp-memeber'
import { WelcomeContent } from './Dialog/welcome-content'

export const ShowModals = () => {
  const [hasClosedModal, setHasClosedModal] = useSessionStorage<boolean>('modal-closed', false)
  const { isOpen, step, open, close, setStep } = useMembershipModalStore()

  useEffect(() => {
    if (!hasClosedModal && !isOpen) {
      open('be-member')
    }
  }, [hasClosedModal, isOpen, open])

  const handleClose = () => {
    close()
    setHasClosedModal(true)
  }

  const handleJoinClick = () => {
    setStep('create-account')
  }

  return (
    <ModalContainer isOpen={isOpen} onClose={handleClose}>
      {step === 'be-member' && <BeMemberContent onJoinClick={handleJoinClick} />}
      {step === 'create-account' && <CreateAccountContent setCurrentStep={setStep} />}
      {step === 'verify-otp' && <VerifyOtpMember setCurrentStep={setStep} />}
      {step === 'welcome' && <WelcomeContent />}
    </ModalContainer>
  )
}

export type ModalStep = MembershipModalStep | null
