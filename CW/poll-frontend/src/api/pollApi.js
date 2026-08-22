const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://pollbuilder-gateway-r33h.onrender.com'
const API_BASE = `${rawBaseUrl.replace(/\/$/, '')}/api`

async function request(url, options = {}) {
  let token = localStorage.getItem('token') || localStorage.getItem('accessToken')

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  // Tự động làm sạch và đính kèm Token
  if (token) {
    // Xóa dấu ngoặc kép bọc dư thừa nếu lỡ dùng JSON.stringify khi lưu
    token = token.replace(/^"(.*)"$/, '$1').trim()
    
    // Nếu token đã chứa sẵn chữ 'Bearer ' thì cắt bỏ để tránh bị lặp thành 'Bearer Bearer ...'
    if (token.startsWith('Bearer ')) {
      token = token.substring(7)
    }

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
