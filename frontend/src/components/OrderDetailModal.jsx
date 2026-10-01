import { CloseIcon } from '../ui'
import { deliveryLabels, formatPrice, orderStatusLabels, paymentLabels } from '../utils'

const statusClass = {
  done: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  new: 'bg-[#eef2f7] text-[#0c4a6e]',
}

const Row = ({ label, children }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-right text-sm font-medium text-gray-900">{children}</span>
  </div>
)

export default function OrderDetailModal({ order, onClose }) {
  if (!order) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Заказ №{order.id}</h2>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[order.status] || statusClass.new}`}>
              {orderStatusLabels[order.status] || order.status}
            </span>
            <button type="button" onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800">
              <CloseIcon />
            </button>
          </div>
        </div>

        <ul className="mt-4 divide-y divide-gray-100 rounded-lg border border-gray-200">
          {order.items.map((i, idx) => (
            <li key={idx} className="flex items-center justify-between gap-3 px-4 py-2.5">
              <span className="text-sm text-gray-900">
                {i.name} <span className="text-gray-500">×{i.qty}</span>
              </span>
              <span className="shrink-0 text-sm text-gray-700">
                {formatPrice(Number(i.price) * i.qty)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col gap-2">
          {order.user_login !== undefined && (
            <Row label="Пользователь">{order.user_login || 'Гость'}</Row>
          )}
          <Row label="Получение">{deliveryLabels[order.delivery_method] || order.delivery_method || '—'}</Row>
          <Row label="Время">
            {order.pickup_time
              ? new Date(order.pickup_time).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
              : '—'}
          </Row>
          <Row label="Оплата">{paymentLabels[order.payment_method] || order.payment_method || '—'}</Row>
          <Row label="Оформлен">{new Date(order.created_at).toLocaleString('ru-RU')}</Row>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
          <span className="text-sm text-gray-600">Итого</span>
          <span className="text-base font-semibold text-gray-900">{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  )
}
