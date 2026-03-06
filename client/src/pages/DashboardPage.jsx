import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useApi } from '../hooks/useApi'
import * as dashboardService from '../services/dashboardService'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { user } = useAuth()
  const { loading, request } = useApi()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    await request(async () => {
      const data = await dashboardService.getDashboardStats()
      setStats(data.data)
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-white mt-2">
            You are logged in as: <span className="font-semibold capitalize">{user?.role}</span>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading dashboard...</div>
          </div>
        ) : stats ? (
          <div className="space-y-6">
            {/* Stats Cards */}
            {user?.role === 'employee' && stats.totalRequests !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Requests"
                  value={stats.totalRequests}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Draft"
                  value={stats.draftRequests}
                  color="bg-yellow-500"
                />
                <StatCard
                  title="Approved"
                  value={stats.approvedRequests}
                  color="bg-green-500"
                />
                <StatCard
                  title="Rejected"
                  value={stats.rejectedRequests}
                  color="bg-red-500"
                />
              </div>
            )}

            {user?.role === 'manager' && stats.pendingApprovals !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Pending Approvals"
                  value={stats.pendingApprovals}
                  color="bg-orange-500"
                />
                <StatCard
                  title="Total Requests"
                  value={stats.totalRequests}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Approved"
                  value={stats.approvedRequests}
                  color="bg-green-500"
                />
                <StatCard
                  title="Total Spend"
                  value={`$${stats.totalSpend?.toLocaleString()}`}
                  color="bg-purple-500"
                />
              </div>
            )}

            {user?.role === 'vendor' && stats.totalOrders !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Pending"
                  value={stats.pendingOrders}
                  color="bg-yellow-500"
                />
                <StatCard
                  title="Delivered"
                  value={stats.deliveredOrders}
                  color="bg-green-500"
                />
                <StatCard
                  title="Revenue"
                  value={`$${stats.revenue?.toLocaleString()}`}
                  color="bg-emerald-500"
                />
              </div>
            )}

            {/* Recent Activity */}
            {stats.recentRequests && (
              <div className="card">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Requests</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Request #</th>
                        <th className="text-left py-3 px-4">Amount</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentRequests?.map(req => (
                        <tr key={req._id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{req.requestNumber}</td>
                          <td className="py-3 px-4">${req.totalAmount}</td>
                          <td className="py-3 px-4">
                            <span className={`badge badge-${req.status}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Layout>
  )
}
