export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || 'Ошибка сервера')
  }
  return data
}

export async function authFetch(path, options = {}) {
  const token = localStorage.getItem('token')
  const isFormData = options.body instanceof FormData
  const res = await fetch(path, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  })
  const data = res.status === 204 ? null : await res.json().catch(() => ({}))
  if (res.status === 401 && (token || localStorage.getItem('user'))) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.reload()
  }
  if (!res.ok) {
    throw new Error(data?.error || (res.status === 413 ? 'Файл слишком большой' : 'Ошибка сервера'))
  }
  return data
}
