// Tự động lấy URL từ Vercel Env, nếu không có sẽ tự chạy về Localhost
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://pollbuilder-gateway-r33h.onrender.com'
const API_BASE = `${rawBaseUrl.replace(/\/$/, '')}/api`

async function request(url, options = {}) {
  // Lấy JWT Token từ localStorage
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  // Tự động đính kèm Token nếu có
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export const pollApi = {
  create(question, options) {
    return request('/polls', {
      method: 'POST',
      body: JSON.stringify({ question, options }),
    })
  },
  get(code) {
    return request(`/polls/${code}`)
  },
  results(code) {
    return request(`/polls/${code}/results`)
  },
  vote(code, optionIndex) {
    return request('/votes', {
      method: 'POST',
      body: JSON.stringify({ pollCode: code, optionIndex }),
    })
  },
  close(code) {
    return request(`/polls/${code}/close`, {
      method: 'PATCH',
    })
  },
}
