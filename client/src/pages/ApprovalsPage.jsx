import React, { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'
import * as approvalService from '../services/approvalService'
import Layout from '../components/Layout'
import { usePagination } from '../hooks/usePagination'

export default function ApprovalsPage() {
  const { loading, request } = useApi()
  const [approvals, setApprovals] = useState([])
  const { page, limit, total, pages, setTotal, handlePageChange } = usePagination()
  const [selectedApprovalId, setSelectedApprovalId] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => {
    fetchApprovals()
  }, [page])

  const fetchApprovals = async () => {
    await request(async () => {
      const data = await approvalService.getPendingApprovals({ page, limit })
      setApprovals(data.data)
      setTotal(data.total)
    })
  }

  const handleApprove = async (approvalId) => {
    await request(
      () => approvalService.approveRequest(approvalId, comment),
      { successMessage: 'Request approved' }
    )
    setSelectedApprovalId(null)
    setComment('')
    fetchApprovals()
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Pending Approvals</h1>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : approvals.length === 0 ? (
          <div className="card text-center py-8 text-gray-500">
            No pending approvals
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map(approval => (
              <div key={approval._id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">
                      {approval.purchaseRequest?.requestNumber}
                    </h3>
                    <p className="text-gray-600">
                      ${approval.purchaseRequest?.totalAmount?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {approval.purchaseRequest?.purpose}
                    </p>
                  </div>
                  {selectedApprovalId === approval._id ? (
                    <div className="w-96 space-y-2">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add comment..."
                        rows="3"
                        className="input-field text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(approval._id)}
                          className="btn-primary text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setSelectedApprovalId(null)}
                          className="btn-secondary text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedApprovalId(approval._id)}
                      className="btn-primary"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            ))}

            {pages > 1 && (
              <div className="flex justify-center gap-2">
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
          </div>
        )}
      </div>
    </Layout>
  )
}
