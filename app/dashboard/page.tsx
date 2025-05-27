import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { Dashboard } from './main'
import OnboardingFlow from '@/components/onboarding/OnboardingFlow'
const DashboardPage = () => {
  return (
    // <OnboardingFlow>
    <div className='min-h-screen bg-black text-white'>
      <DashboardHeader />
      <OnboardingFlow >
        <Dashboard />
      </OnboardingFlow>
    </div>
    // </OnboardingFlow>
  )
}

export default DashboardPage


