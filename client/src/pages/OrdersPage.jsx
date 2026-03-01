import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import Layout from '../components/Layout'

export default function OrdersPage() {
  const { loading } = useApi()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Fetch orders logic
    setOrders([])
  }, [])

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Purchase Orders</h1>

        <div className="card">
          {loading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No orders found</div>
          ) : (
            <div>Orders list would appear here</div>
          )}
        </div>
      </div>
    </Layout>
  )
}
