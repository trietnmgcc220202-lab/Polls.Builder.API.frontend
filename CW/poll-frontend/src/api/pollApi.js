// [FRONTEND] File: src/api/pollApi.js

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
    token = token.replace(/^"(.*)"$/, '$1').trim()
    
    if (token.startsWith('Bearer ')) {
      token = token.substring(7)
    }

    headers['Authorization'] = `Bearer ${token}`
    console.log('✅ [CHECK TOKEN]: Đã gửi Header -> Authorization: Bearer ' + token.substring(0, 20) + '...')
  } else {
    console.error('❌ [CHECK TOKEN]: KHÔNG tìm thấy Token trong LocalStorage! Request chắc chắn bị 401.')
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
  getMyPolls() {
    return request('/polls/my-polls')
  }
}
