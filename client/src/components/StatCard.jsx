import React from 'react'

export default function StatCard({ title, value, color }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`${color} w-16 h-16 rounded-lg opacity-20`}></div>
      </div>
    </div>
  )
}
