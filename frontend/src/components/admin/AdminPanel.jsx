import { useEffect, useState } from 'react'
import CategoriesTab from './CategoriesTab'
import DishesTab from './DishesTab'
import UsersTab from './UsersTab'

export default function AdminPanel({ user }) {
  const [adminTab, setAdminTab] = useState('menu')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : []))
      .then(setCategories)
      .catch(() => {})
  }, [])

  const tabs = [
    { id: 'menu', label: 'Меню' },
    { id: 'categories', label: 'Категории' },
    ...(user?.role === 'superadmin'
      ? [{ id: 'users', label: 'Пользователи' }]
      : []),
  ]

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900">Админ-панель</h1>
      <div className="mb-5 flex items-center gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
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
      {adminTab === 'menu' && <DishesTab categories={categories} />}
      {adminTab === 'categories' && (
        <CategoriesTab categories={categories} onCategoriesChange={setCategories} />
      )}
      {adminTab === 'users' && user?.role === 'superadmin' && <UsersTab />}
    </section>
  )
}
