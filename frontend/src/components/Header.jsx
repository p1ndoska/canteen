export default function Header({ activeTab, onTabChange, isAdmin, user, cartCount, onCartOpen, onLogin, onLogout }) {
  const tabs = [
    { id: 'menu', label: 'Меню' },
    { id: 'about', label: 'О нас' },
    { id: 'contacts', label: 'Контакты' },
    ...(isAdmin ? [{ id: 'admin', label: 'Админ-панель' }] : []),
  ]

  return (
    <header className="w-full border-b border-[#1a2b4a] bg-[#213659]">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-white">
            Столовая Минского центра УВД
          </span>
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
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
            onClick={onCartOpen}
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
            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0c4a6e] px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          {user ? (
            <>
              <span className="text-sm font-medium text-white">{user.login}</span>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center rounded-full border border-[#a2d9f7] bg-white px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex items-center rounded-full border border-[#a2d9f7] bg-white px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
