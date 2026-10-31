import { DashboardNav, DashboardTabs } from '@/components/dashboard'
import { DashboardGuards } from './dashboard-guards'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardGuards>
      <div data-dashboard dir="ltr" className="bg-dashboard min-h-screen">
        <DashboardNav />
        <div className="px-6 py-6 lg:px-20">
          <DashboardTabs />
          {children}
        </div>
      </div>
    </DashboardGuards>
  )
}

export default DashboardLayout
