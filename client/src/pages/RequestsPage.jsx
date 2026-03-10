import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import * as requestService from '../services/requestService'
import Layout from '../components/Layout'
import { usePagination } from '../hooks/usePagination'

export default function RequestsPage() {
  const navigate = useNavigate()
  const { loading, request } = useApi()
  const [requests, setRequests] = useState([])
  const [status, setStatus] = useState('')
  const { page, limit, total, pages, setTotal, handlePageChange } = usePagination()

  useEffect(() => {
    fetchRequests()
  }, [page, status])

  const fetchRequests = async () => {
    await request(async () => {
      const data = await requestService.getAllRequests({ status, page, limit })
      setRequests(data.data)
      setTotal(data.total)
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Purchase Requests</h1>
          <button
            onClick={() => navigate('/requests/create')}
            className="btn-primary"
          >
            Create New Request
          </button>
        </div>

        <div className="card dark:bg-dark dark:text-white">
          <div className="mb-6 flex gap-4 ">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                handlePageChange(1)
              }}
              className="input-field w-48 dark:bg-slate-800 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="processing">Processing</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="rejected">Rejected</option>
              <option value="purchased">Shipped</option>
              <option value="cancelled">Completed</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-white">No requests found</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Request #</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Priority</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map(req => (
                      <tr key={req._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold">{req.requestNumber}</td>
                        <td className="py-3 px-4">${req.totalAmount?.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`badge badge-${req.status}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 capitalize">{req.priority}</td>
                        <td className="py-3 px-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => navigate(`/requests/${req._id}`)}
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pages > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">{page} of {pages}</span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === pages}
                    className="btn-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
