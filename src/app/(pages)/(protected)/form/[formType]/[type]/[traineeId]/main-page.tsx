'use client';
import React from 'react';

import { ChecklistApiResponse } from '@/app/libs/types';
import ChecklistForm from '@/app/components/checklist-form';

interface MainPageProps {
  formData: ChecklistApiResponse[];
  traineeId: string;
  formType: string;
  traineeName: string;
}
const MainPage:React.FC<MainPageProps> = ({ formData, traineeId, formType, traineeName}) => (

    <ChecklistForm traineeName={traineeName} formType={formType} formData={formData} traineeId={traineeId} />
);

export default MainPage;
