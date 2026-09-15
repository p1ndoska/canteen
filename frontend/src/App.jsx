function App() {
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
              className="inline-flex items-center rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-600 transition hover:brightness-95"
            >
              Войти
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6">
      </main>
    </>
  )
}

export default App
