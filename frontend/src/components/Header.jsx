import { HeartIcon } from '../ui'

export default function Header({ activeTab, onTabChange, isAdmin, user, cartCount, favCount, onCartOpen, onLogin, onLogout }) {
  const tabs = [
    { id: 'menu', label: 'Меню' },
    { id: 'about', label: 'О нас' },
    { id: 'contacts', label: 'Контакты' },
    ...(isAdmin ? [{ id: 'admin', label: 'Админ-панель' }] : []),
  ]

  return (
    <header className="w-full border-b border-[#1a2b4a] bg-[#213659]">
      <div className="mx-auto flex min-h-14 w-full max-w-[1200px] flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:flex-nowrap sm:py-0">
        <button
          type="button"
          onClick={() => onTabChange('menu')}
          className="text-base font-semibold text-white transition hover:text-white/80 sm:text-lg"
        >
          Столовая Минского центра УВД
        </button>
        <nav className="order-last flex w-full items-center gap-1 overflow-x-auto sm:order-none sm:ml-6 sm:mr-auto sm:w-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition sm:px-3.5 sm:py-1.5 sm:text-sm ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2 sm:order-last sm:gap-2.5">
          <button
            type="button"
            onClick={() => onTabChange('favorites')}
            aria-label="Избранное"
            className={`relative flex h-9 w-9 items-center justify-center rounded-full bg-white transition sm:h-10 sm:w-10 ${
              activeTab === 'favorites' ? 'text-red-500' : 'text-[#0c4a6e] hover:text-red-400'
            }`}
          >
            <HeartIcon filled={activeTab === 'favorites'} />
            {favCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                {favCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onCartOpen}
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[#a2d9f7] px-3 py-1.5 text-xs font-semibold text-[#0c4a6e] transition hover:brightness-95 sm:px-4 sm:py-2 sm:text-sm"
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
            <span className="hidden sm:inline">Корзина</span>
            {cartCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0c4a6e] px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          {user ? (
            <>
              <span className="hidden text-sm font-medium text-white sm:inline">{user.login}</span>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center rounded-full border border-[#a2d9f7] bg-white px-3 py-1.5 text-xs font-semibold text-[#0c4a6e] transition hover:brightness-95 sm:px-4 sm:py-2 sm:text-sm"
              >
                Выйти
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex items-center rounded-full border border-[#a2d9f7] bg-white px-3 py-1.5 text-xs font-semibold text-[#0c4a6e] transition hover:brightness-95 sm:px-4 sm:py-2 sm:text-sm"
            >
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
