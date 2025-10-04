export function buildPaginationParams({ page = 1, limit = 10 } = {}) {
  return { page, limit }
}

export function buildAttendanceParams({ page = 1, limit = 10, startDate, endDate } = {}) {
  const params = buildPaginationParams({ page, limit })
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate
  return params
}

export function buildEmployeeParams({ page = 1, limit = 10, search, position, role } = {}) {
  const params = buildPaginationParams({ page, limit })
  if (search) params.search = search
  if (position) params.position = position
  if (role) params.role = role
  return params
}

export function computeTotalPages(meta) {
  if (!meta) return 1
  const { total = 0, limit = 10 } = meta
  return Math.max(1, Math.ceil(total / limit))
}

export function formatDateTime(value) {
  try {
    const d = new Date(value)
    return d.toLocaleString()
  } catch {
    return String(value ?? '')
  }
}