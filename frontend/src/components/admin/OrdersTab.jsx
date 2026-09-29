import { useEffect, useState } from 'react'
import { authFetch } from '../../api'
import { formatPrice } from '../../utils'

const statusLabels = { new: 'Новый', done: 'Выдан', cancelled: 'Отменён' }

export default function OrdersTab() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    authFetch('/api/orders')
      .then(setOrders)
      .catch(() => {})
  }, [])

  if (orders.length === 0) {
    return <p className="text-sm text-gray-600">Заказов пока нет.</p>
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
            <th className="px-4 py-2.5">№</th>
            <th className="px-4 py-2.5">Пользователь</th>
            <th className="px-4 py-2.5">Позиции</th>
            <th className="px-4 py-2.5">Сумма</th>
            <th className="px-4 py-2.5">Статус</th>
            <th className="px-4 py-2.5">Дата</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-gray-100 last:border-0">
              <td className="px-4 py-2.5 text-gray-900">{o.id}</td>
              <td className="px-4 py-2.5 text-gray-900">{o.user_login || 'Гость'}</td>
              <td className="px-4 py-2.5 text-gray-700">
                {o.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}
              </td>
              <td className="px-4 py-2.5 font-semibold text-gray-900">{formatPrice(o.total)}</td>
              <td className="px-4 py-2.5 text-gray-700">{statusLabels[o.status] || o.status}</td>
              <td className="px-4 py-2.5 text-gray-700">
                {new Date(o.created_at).toLocaleString('ru-RU')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
