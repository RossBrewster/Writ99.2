import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Book, Users, Settings } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

interface SidebarProps {
  userType: 'teacher' | 'student';
}

export const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  const { isDarkMode } = useDarkMode();

  const menuItems = userType === 'teacher'
    ? [
        { icon: Home, text: 'Dashboard', link: '/dashboard' },
        { icon: Book, text: 'Assignments', link: '/assignments' },
        { icon: Users, text: 'Students', link: '/students' },
        { icon: Settings, text: 'Settings', link: '/settings' },
      ]
    : [
        { icon: Home, text: 'Dashboard', link: '/dashboard' },
        { icon: Book, text: 'My Assignments', link: '/my-assignments' },
        { icon: Settings, text: 'Settings', link: '/settings' },
      ];

  return (
    <aside className={`${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'} w-64 min-h-screen p-4 transition-colors duration-200`}>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link 
                to={item.link} 
                className={`flex items-center p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} rounded transition-colors duration-200`}
              >
                <item.icon size={20} className="mr-2" />
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};