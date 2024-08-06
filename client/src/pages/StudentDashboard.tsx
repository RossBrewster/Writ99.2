import React from 'react';
import { DashboardHeader } from '../components/shared/DashboardHeader';

export const StudentDashboard: React.FC = () => {
  return (
    <div className='flex flex-col h-full w-full justify-start'>
      <DashboardHeader />
    </div>
    );
};