import { api } from '../axios'

/**
 * Get all audit logs with optional filtering
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.userId - Filter by user ID
 * @param {string} params.eventType - Filter by event type
 * @param {string} params.startDate - Filter by start date (ISO string)
 * @param {string} params.endDate - Filter by end date (ISO string)
 * @returns {Promise<Object>} - Paginated audit logs data
 */
export const getAuditLogs = async (params = {}) => {
  const response = await api.get('/audit-logs', { params })
  return response.data
}

/**
 * Get audit log statistics
 * @param {Object} params - Query parameters
 * @param {string} params.userId - Filter by user ID
 * @returns {Promise<Object>} - Audit log statistics
 */
export const getAuditStats = async (params = {}) => {
  const response = await api.get('/audit-logs/stats', { params })
  return response.data
}

/**
 * Get a specific audit log by ID
 * @param {string} id - Audit log ID
 * @returns {Promise<Object>} - Audit log details
 */
export const getAuditLogById = async (id) => {
  const response = await api.get(`/audit-logs/${id}`)
  return response.data
}