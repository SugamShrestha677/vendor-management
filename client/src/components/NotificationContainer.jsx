import React from 'react'
import { useNotification } from '../hooks/useNotification'

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {notifications.map(notif => (
        <div
          key={notif.id}
          className={`p-4 rounded-lg shadow-lg text-white ${
            notif.type === 'success'
              ? 'bg-green-500'
              : notif.type === 'error'
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{notif.message}</span>
            <button
              onClick={() => removeNotification(notif.id)}
              className="ml-4 font-bold"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
