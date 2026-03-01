import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../hooks/useAuth'
import * as requestService from '../services/requestService'
import * as approvalService from '../services/approvalService'
import Layout from '../components/Layout'

export default function RequestDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { loading, request: apiRequest } = useApi()
  const [requestData, setRequestData] = useState(null)
  const [comment, setComment] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)

  useEffect(() => {
    fetchRequestDetails()
  }, [id])

  const fetchRequestDetails = async () => {
    await apiRequest(async () => {
      const data = await requestService.getRequestById(id)
      setRequestData(data.data)
    })
  }

  const handleApprove = async () => {
    await apiRequest(
      () => approvalService.approveRequest(id, comment),
      { successMessage: 'Request approved successfully' }
    )
    fetchRequestDetails()
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    await apiRequest(
      () => approvalService.rejectRequest(id, rejectionReason),
      { successMessage: 'Request rejected' }
    )
    fetchRequestDetails()
    setShowRejectForm(false)
  }

  const handleSubmit = async () => {
    await apiRequest(
      () => requestService.submitRequest(id),
      { successMessage: 'Request submitted for approval' }
    )
    fetchRequestDetails()
  }

  if (loading || !requestData) {
    return (
      <Layout>
        <div className="text-center py-8">Loading...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Request {requestData.requestNumber}
          </h1>
          <button onClick={() => navigate('/requests')} className="btn-secondary">
            Back
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="card">
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-xl font-bold capitalize">{requestData.status}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Total Amount</p>
            <p className="text-xl font-bold">${requestData.totalAmount?.toLocaleString()}</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm">Priority</p>
            <p className="text-xl font-bold capitalize">{requestData.priority}</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Department</p>
              <p className="font-semibold">{requestData.department}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Purpose</p>
              <p className="font-semibold">{requestData.purpose}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Budget Code</p>
              <p className="font-semibold">{requestData.budgetCode || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Cost Center</p>
              <p className="font-semibold">{requestData.costCenter || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-left py-3 px-4">Quantity</th>
                  <th className="text-left py-3 px-4">Unit Price</th>
                  <th className="text-left py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {requestData.items?.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-3 px-4">{item.description}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4">${item.estimatedUnitPrice}</td>
                    <td className="py-3 px-4">${(item.quantity * item.estimatedUnitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manager Approval Actions */}
        {user?.role === 'manager' && requestData.status === 'submitted' && (
          <div className="card space-y-4">
            <h2 className="text-xl font-bold">Approval Actions</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add any comments..."
                rows="3"
                className="input-field"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleApprove}
                className="btn-primary"
              >
                Approve
              </button>
              <button
                onClick={() => setShowRejectForm(!showRejectForm)}
                className="btn-danger"
              >
                Reject
              </button>
            </div>

            {showRejectForm && (
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why you're rejecting this request..."
                  rows="3"
                  className="input-field"
                  required
                />
                <button
                  onClick={handleReject}
                  className="mt-4 btn-danger"
                >
                  Confirm Rejection
                </button>
              </div>
            )}
          </div>
        )}

        {/* Employee Submit Action */}
        {user?.role === 'employee' && requestData.status === 'draft' && (
          <div className="card">
            <button
              onClick={handleSubmit}
              className="btn-primary"
            >
              Submit for Approval
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}
