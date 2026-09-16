import { useState } from 'react'

const inputClass =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'

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

const emptyForm = { login: '', password: '', passwordConfirm: '', phone: '', code: '' }

function App() {
  const [authMode, setAuthMode] = useState(null) // null | 'phone' | 'login' | 'register'
  const [codeSent, setCodeSent] = useState(false)
  const [devCode, setDevCode] = useState('')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const close = () => {
    setAuthMode(null)
    setCodeSent(false)
    setDevCode('')
    setError('')
    setForm(emptyForm)
  }

  const switchMode = (mode) => {
    setAuthMode(mode)
    setCodeSent(false)
    setDevCode('')
    setError('')
  }

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const saveSession = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    close()
  }

  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiPost('/api/auth/request-code', { phone: form.phone })
      setCodeSent(true)
      setDevCode(data.devCode || '')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiPost('/api/auth/verify-code', {
        phone: form.phone,
        code: form.code,
      })
      saveSession(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
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
  }

  const modalTitle = {
    phone: 'Вход по номеру телефона',
    login: 'Вход',
    register: 'Регистрация',
  }[authMode]

  return (
    <>
      <header className="w-full bg-gray-200 border-b border-gray-300">
        <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4">
          <span className="text-lg font-semibold text-gray-900">
            Столовая Минского центра УВД
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-transparent bg-sky-400 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
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
                <span className="text-sm font-medium text-gray-700">{user.login}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition hover:brightness-95"
                >
                  Выйти
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => switchMode('phone')}
                className="inline-flex items-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition hover:brightness-95"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6">
      </main>

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
              <h2 className="text-lg font-semibold text-gray-900">{modalTitle}</h2>
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

            {authMode === 'phone' && !codeSent && (
              <form className="flex flex-col gap-4" onSubmit={handleRequestCode}>
                <Field
                  label="Номер телефона"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={update}
                  placeholder="+375 29 123 45 67"
                  autoComplete="tel"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 rounded-full bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
                >
                  Получить код
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-sm text-sky-600 transition hover:text-sky-700"
                >
                  Войти по паролю
                </button>
              </form>
            )}

            {authMode === 'phone' && codeSent && (
              <form className="flex flex-col gap-4" onSubmit={handleVerifyCode}>
                <p className="text-sm text-gray-600">
                  Код отправлен на {form.phone}
                  {devCode && (
                    <span className="mt-1 block text-xs text-gray-400">
                      dev-режим без SMS-провайдера — код: {devCode}
                    </span>
                  )}
                </p>
                <Field
                  label="Код из SMS"
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={update}
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  autoComplete="one-time-code"
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 rounded-full bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
                >
                  Войти
                </button>
                <button
                  type="button"
                  onClick={() => { setCodeSent(false); setDevCode(''); setError('') }}
                  className="text-sm text-sky-600 transition hover:text-sky-700"
                >
                  Изменить номер
                </button>
              </form>
            )}

            {(authMode === 'login' || authMode === 'register') && (
              <form className="flex flex-col gap-4" onSubmit={handlePasswordSubmit}>
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
                  className="mt-1 rounded-full bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
                >
                  {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                </button>
                {authMode === 'login' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => switchMode('register')}
                      className="text-sm text-sky-600 transition hover:text-sky-700"
                    >
                      Нет аккаунта? Зарегистрироваться
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('phone')}
                      className="text-sm text-sky-600 transition hover:text-sky-700"
                    >
                      Войти по номеру телефона
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-sm text-sky-600 transition hover:text-sky-700"
                  >
                    Уже есть аккаунт? Войти
                  </button>
                )}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default App
