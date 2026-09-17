import { useEffect, useState } from 'react'

const inputClass =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#a2d9f7] focus:ring-2 focus:ring-[#a2d9f7]/40'

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input className={inputClass} required {...props} />
    </label>
  )
}

async function apiPost(path, body) {
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

const emptyForm = { login: '', password: '', passwordConfirm: '' }

function App() {
  const [authMode, setAuthMode] = useState(null) // null | 'login' | 'register'
  const [cartOpen, setCartOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('menu') // 'menu' | 'about' | 'contacts'
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [adminTab, setAdminTab] = useState('menu') // 'menu' | 'categories' | 'users'

  const isAdmin = !!user && ['admin', 'superadmin'].includes(user.role)

  useEffect(() => {
    if (activeTab !== 'admin' || user?.role !== 'superadmin') return
    const token = localStorage.getItem('token')
    fetch('/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then(setUsers)
      .catch(() => {})
  }, [activeTab, user])

  const setRole = async (id, role) => {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/auth/users/${id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    })
    if (res.ok) {
      const updated = await res.json()
      setUsers(users.map((u) => (u.id === id ? { ...u, role: updated.role } : u)))
    }
  }

  const close = () => {
    setAuthMode(null)
    setError('')
    setForm(emptyForm)
  }

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const saveSession = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    close()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (authMode === 'register' && form.password !== form.passwordConfirm) {
      setError('Пароли не совпадают')
      return
    }
    setLoading(true)
    try {
      const data = await apiPost(`/api/auth/${authMode}`, {
        login: form.login,
        password: form.password,
      })
      saveSession(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    if (activeTab === 'admin') setActiveTab('menu')
  }

  return (
    <>
      <header className="w-full bg-[#213659] border-b border-[#1a2b4a]">
        <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <span className="text-lg font-semibold text-white">
              Столовая Минского центра УВД
            </span>
            <nav className="flex items-center gap-1">
              {[
                { id: 'menu', label: 'Меню' },
                { id: 'about', label: 'О нас' },
                { id: 'contacts', label: 'Контакты' },
                ...(isAdmin ? [{ id: 'admin', label: 'Админ-панель' }] : []),
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    activeTab === tab.id
                      ? 'bg-white/15 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[#a2d9f7] px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
            >
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 7h12l1.5 13.5a1 1 0 0 1-1 1.1H5.5a1 1 0 0 1-1-1.1L6 7z" />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" />
              </svg>
              Корзина
            </button>
            {user ? (
              <>
                <span className="text-sm font-medium text-white">{user.login}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center rounded-full border border-[#a2d9f7] bg-white px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
                >
                  Выйти
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="inline-flex items-center rounded-full border border-[#a2d9f7] bg-white px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6">
        {activeTab === 'menu' && null}
        {activeTab === 'about' && (
          <section>
            <h1 className="mb-4 text-2xl font-semibold text-gray-900">О нас</h1>
            <p className="text-sm text-gray-600">
              Столовая Минского центра УВД — раздел в разработке.
            </p>
          </section>
        )}
        {activeTab === 'contacts' && (
          <section>
            <h1 className="mb-4 text-2xl font-semibold text-gray-900">Контакты</h1>
            <p className="text-sm text-gray-600">
              Контактная информация появится здесь позже.
            </p>
          </section>
        )}
        {activeTab === 'admin' && isAdmin && (
          <section>
            <h1 className="mb-4 text-2xl font-semibold text-gray-900">Админ-панель</h1>
            <div className="mb-5 flex items-center gap-1 border-b border-gray-200">
              {[
                { id: 'menu', label: 'Меню' },
                { id: 'categories', label: 'Категории' },
                ...(user?.role === 'superadmin'
                  ? [{ id: 'users', label: 'Пользователи' }]
                  : []),
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAdminTab(tab.id)}
                  className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
                    adminTab === tab.id
                      ? 'border-[#a2d9f7] text-[#0c4a6e]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {adminTab === 'menu' && (
              <p className="text-sm text-gray-600">Управление меню — раздел в разработке.</p>
            )}
            {adminTab === 'categories' && (
              <p className="text-sm text-gray-600">
                Управление категориями — раздел в разработке.
              </p>
            )}
            {adminTab === 'users' && user?.role === 'superadmin' && (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                      <th className="px-4 py-2.5 font-medium">ID</th>
                      <th className="px-4 py-2.5 font-medium">Логин</th>
                      <th className="px-4 py-2.5 font-medium">Роль</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-2.5 text-gray-500">{u.id}</td>
                        <td className="px-4 py-2.5 text-gray-900">{u.login}</td>
                        <td className="px-4 py-2.5">
                          {u.role === 'superadmin' ? (
                            <span className="text-gray-500">superadmin</span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => setRole(u.id, e.target.value)}
                              className="rounded-md border border-gray-300 px-2 py-1 text-sm outline-none focus:border-[#a2d9f7]"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Корзина</h2>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="text-gray-400 transition hover:text-gray-600"
                aria-label="Закрыть"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center p-6">
              <p className="text-sm text-gray-500">Корзина пуста</p>
            </div>
          </aside>
        </div>
      )}

      {authMode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={close}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {authMode === 'login' ? 'Вход' : 'Регистрация'}
              </h2>
              <button
                type="button"
                onClick={close}
                className="text-gray-400 transition hover:text-gray-600"
                aria-label="Закрыть"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Field
                label="Логин"
                type="text"
                name="login"
                value={form.login}
                onChange={update}
                autoComplete="username"
              />
              <Field
                label="Пароль"
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />
              {authMode === 'register' && (
                <Field
                  label="Повторите пароль"
                  type="password"
                  name="passwordConfirm"
                  value={form.passwordConfirm}
                  onChange={update}
                  autoComplete="new-password"
                />
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 rounded-full bg-[#a2d9f7] px-4 py-2.5 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95 disabled:opacity-60"
              >
                {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
              </button>
              {authMode === 'login' ? (
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setError('') }}
                  className="text-sm text-[#0c4a6e] transition hover:brightness-75"
                >
                  Нет аккаунта? Зарегистрироваться
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setError('') }}
                  className="text-sm text-[#0c4a6e] transition hover:brightness-75"
                >
                  Уже есть аккаунт? Войти
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default App
