import { create } from 'zustand'

export type MembershipModalStep = 'be-member' | 'create-account' | 'verify-otp' | 'welcome'

type MembershipModalState = {
  isOpen: boolean
  step: MembershipModalStep | null
  registeredEmail: string | null
  open: (step?: MembershipModalStep) => void
  close: () => void
  setStep: (step: MembershipModalStep) => void
  setRegisteredEmail: (email: string) => void
  openFromAnnouncement: () => void
}

export const useMembershipModalStore = create<MembershipModalState>((set) => ({
  isOpen: false,
  step: null,
  registeredEmail: null,
  open: (step = 'be-member') => set({ isOpen: true, step }),
  close: () => set({ isOpen: false, step: null }),
  setStep: (step) => set({ isOpen: true, step }),
  setRegisteredEmail: (email) => set({ registeredEmail: email }),
  openFromAnnouncement: () => set({ isOpen: true, step: 'create-account' }),
}))
