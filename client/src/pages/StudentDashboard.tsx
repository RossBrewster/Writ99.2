import React from 'react';
import { DashboardHeader } from '../components/shared/DashboardHeader';
import { JoinClassroom } from '../components/classroom/JoinClassroom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { ClassroomSelector } from '../components/classroom/ClassroomSelector';
export const StudentDashboard: React.FC = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-[#1c2740]' : 'bg-gray-100'}`}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <ClassroomSelector />
        <JoinClassroom />
      </div>
    </div>
    );
};