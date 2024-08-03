import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useAuth } from '../../contexts/AuthContext';

export const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isAuthenticated, username, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null; // Or you could redirect to login page
  }

  return (
    <header className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-md p-4 transition-colors duration-200`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {role === 'teacher' ? 'Teacher' : 'Student'} Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <button className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>
            <Bell size={24} />
          </button>
          <span>{username}</span>
          <button 
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 flex items-center"
          >
            <LogOut size={24} className="mr-1" />
            Logout
          </button>
          <button 
            onClick={toggleDarkMode}
            className={`${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'} px-3 py-1 rounded`}
          >
            {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>
    </header>
  );
};