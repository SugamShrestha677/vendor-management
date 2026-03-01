import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Users,
  ShoppingCart,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';

export default function Sidebar({ open, onLinkClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['employee', 'manager', 'vendor'],
    },
    {
      label: 'Requests',
      path: '/requests',
      icon: FileText,
      roles: ['employee', 'manager', 'vendor'],
    },
    {
      label: 'Approvals',
      path: '/approvals',
      icon: CheckCircle,
      roles: ['manager'],
    },
    {
      label: 'Vendors',
      path: '/vendors',
      icon: Users,
      roles: ['employee', 'manager'],
    },
    {
      label: 'Orders',
      path: '/orders',
      icon: ShoppingCart,
      roles: ['vendor', 'manager'],
    },
  ];

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-40
        bg-gray-900 text-white
        transition-all duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:transition-all
        ${open ? 'md:w-64' : 'md:w-20'}
      `}
    >
      <div className="p-6 font-bold text-2xl">
        {open ? 'VP' : 'V'}
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onLinkClick}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                active ? 'bg-blue-600 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Icon size={24} />
              {open && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 w-full text-left transition-colors"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          {open && <span>Theme</span>}
        </button>

        {/* Settings Link */}
        <Link
          to="/profile"
          onClick={onLinkClick}
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Settings size={24} />
          {open && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  );
}