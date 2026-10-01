import { useEffect, useState } from 'react'
import { authFetch } from '../api'
import OrderDetailModal from './OrderDetailModal'
import { formatPrice, orderStatusLabels, paymentLabels } from '../utils'

const roleLabels = { user: 'Пользователь', admin: 'Администратор', superadmin: 'Суперадмин' }

export default function AccountPage({ user }) {
  const [orders, setOrders] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    authFetch('/api/orders/mine')
      .then(setOrders)
      .catch(() => setOrders([]))
  }, [])

  return (
    <section>
      <h1 className="mb-4 text-2xl font-semibold text-gray-900 xl:text-3xl">Личный кабинет</h1>
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-base font-semibold text-gray-900">{user.login}</p>
        <p className="mt-1 text-sm text-gray-600">{roleLabels[user.role] || user.role}</p>
      </div>

      <h2 className="mb-3 text-lg font-semibold text-gray-900">Мои заказы</h2>
      {orders === null ? (
        <p className="text-sm text-gray-600">Загрузка…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-600">Заказов пока нет.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((o) => (
            <div
              key={o.id}
              onClick={() => setSelected(o)}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 transition hover:border-[#a2d9f7] hover:shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-gray-900">Заказ №{o.id}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  o.status === 'done'
                    ? 'bg-green-100 text-green-700'
                    : o.status === 'cancelled'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-[#eef2f7] text-[#0c4a6e]'
                }`}>
                  {orderStatusLabels[o.status] || o.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">
                {o.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                {o.pickup_time && (
                  <span>
                    Самовывоз: {new Date(o.pickup_time).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                <span>Оплата: {paymentLabels[o.payment_method] || o.payment_method || '—'}</span>
                <span>Оформлен: {new Date(o.created_at).toLocaleString('ru-RU')}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-900">{formatPrice(o.total)}</p>
            </div>
          ))}
        </div>
      )}
      <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
