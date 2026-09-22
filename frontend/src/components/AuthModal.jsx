import { useState } from 'react'
import { apiPost } from '../api'
import { CloseIcon, Field } from '../ui'

const emptyForm = { login: '', password: '', passwordConfirm: '' }

export default function AuthModal({ mode, onClose, onSwitchMode, onSuccess }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const switchMode = (next) => {
    setError('')
    onSwitchMode(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (mode === 'register' && form.password !== form.passwordConfirm) {
      setError('Пароли не совпадают')
      return
    }
    setLoading(true)
    try {
      const data = await apiPost(`/api/auth/${mode}`, {
        login: form.login,
        password: form.password,
      })
      onSuccess(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'login' ? 'Вход' : 'Регистрация'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-600"
            aria-label="Закрыть"
          >
            <CloseIcon />
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
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          {mode === 'register' && (
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
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => switchMode('register')}
              className="text-sm text-[#0c4a6e] transition hover:brightness-75"
            >
              Нет аккаунта? Зарегистрироваться
            </button>
          ) : (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="text-sm text-[#0c4a6e] transition hover:brightness-75"
            >
              Уже есть аккаунт? Войти
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
