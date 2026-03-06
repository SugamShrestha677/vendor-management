import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import * as vendorService from '../services/vendorService'
import Layout from '../components/Layout'

export default function VendorsPage() {
  const { loading, request } = useApi()
  const [vendors, setVendors] = useState([])
  const [category, setCategory] = useState('')

  useEffect(() => {
    fetchVendors()
  }, [category])

  const fetchVendors = async () => {
    await request(async () => {
      const data = await vendorService.getAllVendors({ category, limit: 50 })
      setVendors(data.data)
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Vendors</h1>
        </div>

        <div className="card dark:bg-dark dark:text-white">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search vendors..."
              className="input-field dark:bg-slate-800 dark:text-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading vendors...</div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-white">No vendors found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 dark:text-white">
              {vendors.map(vendor => (
                <div key={vendor._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold">{vendor.companyName}</h3>
                  <p className="text-gray-600 text-sm">
                    {vendor.firstName} {vendor.lastName}
                  </p>
                  <p className="text-gray-600 text-sm mt-2">{vendor.email}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {vendor.vendorCategories?.map((cat, idx) => (
                      <span
                        key={idx}
                        className="badge-info text-xs"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
