import { useState, useCallback } from 'react'

export const usePagination = (initialPage = 1, initialLimit = 10) => {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)
  const [total, setTotal] = useState(0)

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage)
  }, [])

  const handleLimitChange = useCallback((newLimit) => {
    setLimit(newLimit)
    setPage(1)
  }, [])

  const pages = Math.ceil(total / limit)

  return {
    page,
    limit,
    total,
    pages,
    setTotal,
    handlePageChange,
    handleLimitChange
  }
}
