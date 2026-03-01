import { useState, useCallback } from 'react'
import { useNotification } from './useNotification'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { addNotification } = useNotification()

  const request = useCallback(async (fn, options = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fn()
      if (options.successMessage) {
        addNotification(options.successMessage, 'success')
      }
      return response
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred'
      setError(message)
      if (options.showError !== false) {
        addNotification(message, 'error')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [addNotification])

  return { loading, error, request }
}
