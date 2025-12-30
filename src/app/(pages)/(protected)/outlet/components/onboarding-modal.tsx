import React from 'react'
import SidePanel from './side-panel'

interface OnboardingModalProps {
    open: boolean;
    onClose: () => void;
    startDate:string;

}
const OnboardingModal: React.FC<OnboardingModalProps> = ({open, onClose,startDate}) => {
  return (
   <SidePanel isOpen={open} onClose={onClose} title='Onboarding' status='completed'  steps={[
    { label: "Onboarding of new outlet", completed: true, date:startDate },
  ]} description='' startedDate={startDate} stepNumber={1}  >

   </SidePanel>  
  )
}

export default OnboardingModal