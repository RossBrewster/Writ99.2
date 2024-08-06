import React from 'react';
import { DashboardHeader } from '../components/shared/DashboardHeader';
import { useMenu } from '../contexts/MenuContext';
import { Sidebar } from '../components/shared/SideBar';
import { useDarkMode } from '../contexts/DarkModeContext'; // Import useDarkMode

export const TeacherDashboard: React.FC = () => {
  const { isMenuOpen } = useMenu();
  const { isDarkMode } = useDarkMode(); // Use the useDarkMode hook

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className={`flex-1 flex overflow-x-hidden overflow-y-auto p-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {isMenuOpen && (
            <Sidebar userType="teacher"/>
          )}
        </main>
      </div>
    </div>
  );
};