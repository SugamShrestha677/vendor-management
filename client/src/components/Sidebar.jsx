import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { LayoutDashboard, FileText, CheckCircle, Users, ShoppingCart, Settings } from 'lucide-react'

export default function Sidebar({ open }) {
  const { user } = useAuth()
  const location = useLocation()

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['employee', 'manager', 'vendor']
    },
    {
      label: 'Requests',
      path: '/requests',
      icon: FileText,
      roles: ['employee', 'manager', 'vendor']
    },
    {
      label: 'Approvals',
      path: '/approvals',
      icon: CheckCircle,
      roles: ['manager']
    },
    {
      label: 'Vendors',
      path: '/vendors',
      icon: Users,
      roles: ['employee', 'manager']
    },
    {
      label: 'Orders',
      path: '/orders',
      icon: ShoppingCart,
      roles: ['vendor', 'manager']
    }
  ]

  const visibleItems = menuItems.filter(item =>
    item.roles.includes(user?.role)
  )

  const isActive = (path) => location.pathname === path

  return (
    <aside
      className={`${
        open ? 'w-64' : 'w-20'
      } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
    >
      <div className="p-6 font-bold text-2xl">
        {open ? 'VP' : 'V'}
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {visibleItems.map(item => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-800'
              }`}
            >
              <Icon size={24} />
              {open && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <Link
          to="/profile"
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Settings size={24} />
          {open && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  )
}
