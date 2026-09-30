import { useEffect, useState } from 'react'
import { authFetch } from '../../api'
import { deliveryLabels, formatPrice, inputClass, orderStatusLabels, paymentLabels } from '../../utils'

export default function OrdersTab() {
  const [orders, setOrders] = useState([])

  const changeStatus = async (id, status) => {
    try {
      const updated = await authFetch(`/api/orders/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status: updated.status } : o)))
    } catch {
      // статус не меняем при ошибке
    }
  }

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
            <th className="px-4 py-2.5">Время</th>
            <th className="px-4 py-2.5">Получение</th>
            <th className="px-4 py-2.5">Оплата</th>
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
              <td className="px-4 py-2.5 text-gray-700">
                {o.pickup_time
                  ? new Date(o.pickup_time).toLocaleString('ru-RU', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : '—'}
              </td>
              <td className="px-4 py-2.5 text-gray-700">{deliveryLabels[o.delivery_method] || o.delivery_method || '—'}</td>
              <td className="px-4 py-2.5 text-gray-700">{paymentLabels[o.payment_method] || o.payment_method || '—'}</td>
              <td className="px-4 py-2.5 font-semibold text-gray-900">{formatPrice(o.total)}</td>
              <td className="px-4 py-2.5">
                <select
                  value={o.status}
                  onChange={(e) => changeStatus(o.id, e.target.value)}
                  className={inputClass}
                >
                  {Object.entries(orderStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </td>
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
