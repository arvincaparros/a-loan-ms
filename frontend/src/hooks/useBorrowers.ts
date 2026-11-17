import { useEffect, useState } from 'react'
import type { ApiBorrowerListResponse, BorrowerStatus } from '../types'

const PAGE_SIZE = 20

// Backend CORS (backend/app/core/config.py) is configured for cross-origin
// calls from the Vite dev server to the API's own port, not a dev proxy -
// so this needs an absolute base URL, not a relative "/api/..." path.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

interface UseBorrowersParams {
  search: string
  status: BorrowerStatus | null
  page: number
}

interface UseBorrowersResult {
  data: ApiBorrowerListResponse | null
  loading: boolean
  error: string | null
}

export function useBorrowers({ search, status, page }: UseBorrowersParams): UseBorrowersResult {
  const [data, setData] = useState<ApiBorrowerListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    params.set('page', String(page))
    params.set('page_size', String(PAGE_SIZE))

    Promise.resolve().then(() => {
      if (controller.signal.aborted) return
      setLoading(true)
      setError(null)
    })

    fetch(`${API_BASE_URL}/api/borrowers?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
        return res.json() as Promise<ApiBorrowerListResponse>
      })
      .then((json) => setData(json))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Failed to load borrowers')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [search, status, page])

  return { data, loading, error }
}
