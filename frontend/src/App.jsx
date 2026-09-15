import './App.css'

function App() {
  return (
    <>
      <header className="header">
        <div className="container header-inner">
          <span className="header-title">Столовая Минского центра УВД</span>
          <div className="header-actions">
            <button type="button" className="btn btn-cart">
              <svg
                className="btn-icon"
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
            <button type="button" className="btn btn-login">
              Войти
            </button>
          </div>
        </div>
      </header>
      <main className="container main">
      </main>
    </>
  )
}

export default App
