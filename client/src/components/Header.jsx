import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Menu, LogOut, User } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-teal-950 shadow-md px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center relative z-50">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          aria-label="Toggle menu"
        >
          <Menu size={24} className="text-gray-800 dark:text-gray-200" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 truncate max-w-[150px] sm:max-w-none">
          Vendor Procurement
        </h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:block text-right">
          <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm sm:text-base">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
        </div>

        <div className="flex gap-2 sm:gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            aria-label="Profile"
          >
            <User size={20} className="text-gray-800 dark:text-gray-200" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
            aria-label="Logout"
          >
            <LogOut size={20} className="text-gray-800 dark:text-gray-200" />
          </button>
        </div>
      </div>
    </header>
  );
}