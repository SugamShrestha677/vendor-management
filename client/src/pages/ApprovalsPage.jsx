import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import * as approvalService from '../services/approvalService';
import Layout from '../components/Layout';
import { usePagination } from '../hooks/usePagination';

export default function ApprovalsPage() {
  const { loading, request } = useApi();
  const [approvals, setApprovals] = useState([]);
  const { page, limit, total, pages, setTotal, handlePageChange } = usePagination();
  const [selectedApprovalId, setSelectedApprovalId] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchApprovals();
  }, [page]);

  const fetchApprovals = async () => {
    await request(async () => {
      const data = await approvalService.getPendingApprovals({ page, limit });
      setApprovals(data.data);
      setTotal(data.total);
    });
  };

  const handleApprove = async (approvalId) => {
    await request(
      () => approvalService.approveRequest(approvalId, comment),
      { successMessage: 'Request approved' }
    );
    setSelectedApprovalId(null);
    setComment('');
    fetchApprovals();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Pending Approvals
        </h1>

        {loading ? (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        ) : approvals.length === 0 ? (
          <div className="bg-white dark:bg-teal-950 border border-gray-200 dark:border-gray-200 rounded-lg p-8 text-center text-gray-500 dark:text-gray-400">
            No pending approvals
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval._id}
                className="bg-white dark:bg-teal-950 border border-gray-200 dark:border-gray-200 rounded-lg p-6"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {approval.purchaseRequest?.requestNumber}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      ${approval.purchaseRequest?.totalAmount?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      {approval.purchaseRequest?.purpose}
                    </p>
                  </div>

                  {selectedApprovalId === approval._id ? (
                    <div className="w-full md:w-96 space-y-2">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add comment..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-bg dark:text-gray-200 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(approval._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setSelectedApprovalId(null)}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedApprovalId(approval._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-800 dark:text-gray-200">
                  {page} of {pages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pages}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}