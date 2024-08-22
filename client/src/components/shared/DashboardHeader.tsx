import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { SideBarLogo } from './SideBarLogo';
// import { useDarkMode } from '../../contexts/DarkModeContext'; // Update the import path as needed
import { UnFixedDarkModeToggle } from './UnFixedDarkModeToggle';

export const DashboardHeader: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  // const { isDarkMode } = useDarkMode();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className={`bg-[#111827] text-white shadow-md transition-colors duration-200`}>
      <div className='flex ml-5 justify-between items-center'>
        <div>
          <SideBarLogo />
        </div>
        <div className='flex items-center gap-5 mr-8'>
          <h1 className="text-2xl font-bold hidden sm:block mr-8">
            {role === 'teacher' ? 'Teacher' : 'Student'} Dashboard
          </h1>
          <UnFixedDarkModeToggle />
        </div>
      </div>
    </header>
  );
};