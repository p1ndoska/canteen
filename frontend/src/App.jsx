import { useState } from 'react'

const inputClass =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100'

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input className={inputClass} {...props} />
    </label>
  )
}

function App() {
  const [authMode, setAuthMode] = useState(null) // null | 'login' | 'register'

  const close = () => setAuthMode(null)

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
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="inline-flex items-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition hover:brightness-95"
            >
              Войти
            </button>
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

            {authMode === 'login' ? (
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <Field label="Логин" type="text" name="login" autoComplete="username" />
                <Field label="Пароль" type="password" name="password" autoComplete="current-password" />
                <button
                  type="submit"
                  className="mt-1 rounded-full bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  Войти
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-sm text-sky-600 transition hover:text-sky-700"
                >
                  Нет аккаунта? Зарегистрироваться
                </button>
              </form>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => e.preventDefault()}
              >
                <Field label="Логин" type="text" name="login" autoComplete="username" />
                <Field label="Пароль" type="password" name="password" autoComplete="new-password" />
                <Field label="Повторите пароль" type="password" name="passwordConfirm" autoComplete="new-password" />
                <button
                  type="submit"
                  className="mt-1 rounded-full bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                >
                  Зарегистрироваться
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-sm text-sky-600 transition hover:text-sky-700"
                >
                  Уже есть аккаунт? Войти
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default App
