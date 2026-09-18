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
  const [categories, setCategories] = useState([])
  const [catForm, setCatForm] = useState(null) // null | {id?, name}
  const [catFormError, setCatFormError] = useState('')
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

  useEffect(() => {
    if (activeTab !== 'admin' || !isAdmin) return
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : []))
      .then(setCategories)
      .catch(() => {})
  }, [activeTab, isAdmin])

  const emptyUserForm = { login: '', password: '', role: 'user' }
  const [userForm, setUserForm] = useState(null) // null | {id?, login, password, role}
  const [userFormError, setUserFormError] = useState('')

  const authFetch = async (path, options = {}) => {
    const token = localStorage.getItem('token')
    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    })
    const data = res.status === 204 ? null : await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error || 'Ошибка сервера')
    return data
  }

  const saveUser = async (e) => {
    e.preventDefault()
    setUserFormError('')
    try {
      if (userForm.id) {
        const body = { login: userForm.login, role: userForm.role }
        if (userForm.password) body.password = userForm.password
        const updated = await authFetch(`/api/auth/users/${userForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
        setUsers(users.map((u) => (u.id === userForm.id ? updated : u)))
      } else {
        const created = await authFetch('/api/auth/users', {
          method: 'POST',
          body: JSON.stringify(userForm),
        })
        setUsers([...users, created])
      }
      setUserForm(null)
    } catch (err) {
      setUserFormError(err.message)
    }
  }

  const removeUser = async (u) => {
    if (!window.confirm(`Удалить пользователя «${u.login}»?`)) return
    try {
      await authFetch(`/api/auth/users/${u.id}`, { method: 'DELETE' })
      setUsers(users.filter((x) => x.id !== u.id))
    } catch (err) {
      alert(err.message)
    }
  }

  const saveCategory = async (e) => {
    e.preventDefault()
    setCatFormError('')
    try {
      if (catForm.id) {
        const updated = await authFetch(`/api/categories/${catForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ name: catForm.name }),
        })
        setCategories(categories.map((c) => (c.id === catForm.id ? updated : c)))
      } else {
        const created = await authFetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify({ name: catForm.name }),
        })
        setCategories([...categories, created])
      }
      setCatForm(null)
    } catch (err) {
      setCatFormError(err.message)
    }
  }

  const removeCategory = async (c) => {
    if (!window.confirm(`Удалить категорию «${c.name}»?`)) return
    try {
      await authFetch(`/api/categories/${c.id}`, { method: 'DELETE' })
      setCategories(categories.filter((x) => x.id !== c.id))
    } catch (err) {
      alert(err.message)
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
              <>
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setCatForm({ name: '' }); setCatFormError('') }}
                    className="rounded-full bg-[#a2d9f7] px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
                  >
                    + Добавить категорию
                  </button>
                </div>
                {categories.length === 0 ? (
                  <p className="text-sm text-gray-600">Категорий пока нет.</p>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                      <tbody>
                        {categories.map((c) => (
                          <tr key={c.id} className="border-b border-gray-100 last:border-0">
                            <td className="px-4 py-2.5 text-gray-900">{c.name}</td>
                            <td className="px-4 py-2.5 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => { setCatForm({ id: c.id, name: c.name }); setCatFormError('') }}
                                  className="rounded-full border border-[#a2d9f7] bg-white px-3 py-1 text-xs font-semibold text-[#0c4a6e] transition hover:brightness-95"
                                >
                                  Изменить
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeCategory(c)}
                                  className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                  Удалить
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
            {adminTab === 'users' && user?.role === 'superadmin' && (
              <>
                <div className="mb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => { setUserForm({ ...emptyUserForm }); setUserFormError('') }}
                    className="rounded-full bg-[#a2d9f7] px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
                  >
                    + Добавить пользователя
                  </button>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                        <th className="px-4 py-2.5 font-medium">ID</th>
                        <th className="px-4 py-2.5 font-medium">Логин</th>
                        <th className="px-4 py-2.5 font-medium">Роль</th>
                        <th className="px-4 py-2.5 font-medium" />
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b border-gray-100 last:border-0">
                          <td className="px-4 py-2.5 text-gray-500">{u.id}</td>
                          <td className="px-4 py-2.5 text-gray-900">{u.login}</td>
                          <td className="px-4 py-2.5 text-gray-700">{u.role}</td>
                          <td className="px-4 py-2.5 text-right">
                            {u.role !== 'superadmin' && (
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => { setUserForm({ id: u.id, login: u.login, password: '', role: u.role }); setUserFormError('') }}
                                  className="rounded-full border border-[#a2d9f7] bg-white px-3 py-1 text-xs font-semibold text-[#0c4a6e] transition hover:brightness-95"
                                >
                                  Изменить
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeUser(u)}
                                  className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                  Удалить
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
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

      {userForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setUserForm(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {userForm.id ? 'Изменить пользователя' : 'Новый пользователь'}
              </h2>
              <button
                type="button"
                onClick={() => setUserForm(null)}
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
            <form className="flex flex-col gap-4" onSubmit={saveUser}>
              <Field
                label="Логин"
                type="text"
                name="userLogin"
                value={userForm.login}
                onChange={(e) => setUserForm({ ...userForm, login: e.target.value })}
                autoComplete="off"
              />
              <Field
                label={userForm.id ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль'}
                type="password"
                name="userPassword"
                required={!userForm.id}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                autoComplete="new-password"
              />
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Роль</span>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className={inputClass}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </label>
              {userFormError && <p className="text-sm text-red-600">{userFormError}</p>}
              <button
                type="submit"
                className="mt-1 rounded-full bg-[#a2d9f7] px-4 py-2.5 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
              >
                {userForm.id ? 'Сохранить' : 'Создать'}
              </button>
            </form>
          </div>
        </div>
      )}

      {catForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setCatForm(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {catForm.id ? 'Изменить категорию' : 'Новая категория'}
              </h2>
              <button
                type="button"
                onClick={() => setCatForm(null)}
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
            <form className="flex flex-col gap-4" onSubmit={saveCategory}>
              <Field
                label="Название"
                type="text"
                name="categoryName"
                value={catForm.name}
                onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                autoComplete="off"
              />
              {catFormError && <p className="text-sm text-red-600">{catFormError}</p>}
              <button
                type="submit"
                className="mt-1 rounded-full bg-[#a2d9f7] px-4 py-2.5 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
              >
                {catForm.id ? 'Сохранить' : 'Создать'}
              </button>
            </form>
          </div>
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
