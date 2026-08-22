const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  'https://pollbuilder-gateway-r33h.onrender.com'

const API_BASE = `${rawBaseUrl.replace(/\/$/, '')}/api`

async function request(url, options = {}) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
    // Không bắt buộc credentials nếu dùng Bearer token
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `HTTP ${res.status}`)
  }

  // 204 No Content
  if (res.status === 204) return null
  return res.json()
}

export const pollApi = {
  create(question, options) {
    return request('/polls', {
      method: 'POST',
      body: JSON.stringify({ question, options })
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
      body: JSON.stringify({ pollCode: code, optionIndex })
    })
  },
  close(code) {
    return request(`/polls/${code}/close`, {
      method: 'PATCH'
    })
  },
  myPolls() {
    return request('/polls/my-polls')
  }
}
