import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Menu, LogOut, User } from 'lucide-react'

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-200 rounded-lg"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Vendor Procurement</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
          <p className="text-sm text-gray-600 capitalize">{user?.role}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <User size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
