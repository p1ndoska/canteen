import { useState } from 'react'

function App() {
  const [loginOpen, setLoginOpen] = useState(false)

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
              onClick={() => setLoginOpen(true)}
              className="inline-flex items-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition hover:brightness-95"
            >
              Войти
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6">
      </main>

      {loginOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setLoginOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Вход</h2>
              <button
                type="button"
                onClick={() => setLoginOpen(false)}
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
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Логин</span>
                <input
                  type="text"
                  name="login"
                  autoComplete="username"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Пароль</span>
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </label>
              <button
                type="submit"
                className="mt-1 rounded-full bg-sky-400 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
              >
                Войти
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default App
