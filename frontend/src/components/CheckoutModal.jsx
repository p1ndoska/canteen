import { useState } from 'react'
import { CloseIcon } from '../ui'
import { formatPrice, inputClass } from '../utils'

const deliveryOptions = [{ value: 'pickup', label: 'Самовывоз' }]
const paymentOptions = [
  { value: 'cash', label: 'Наличные' },
  { value: 'card', label: 'Карта' },
]

const nowLocal = () => {
  const d = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  return d.toISOString().slice(0, 16)
}

export default function CheckoutModal({ total, busy, error, onClose, onSubmit }) {
  const [pickupTime, setPickupTime] = useState('')
  const [delivery, setDelivery] = useState('pickup')
  const [payment, setPayment] = useState('cash')

  const submit = (e) => {
    e.preventDefault()
    onSubmit({ pickup_time: pickupTime, delivery_method: delivery, payment_method: payment })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Оформление заказа</h2>
          <button type="button" onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800">
            <CloseIcon />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Время получения</span>
            <input
              type="datetime-local"
              required
              min={nowLocal()}
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Способ получения</span>
            <select
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              className={inputClass}
            >
              {deliveryOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Способ оплаты</span>
            <select
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className={inputClass}
            >
              {paymentOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 w-full rounded-full bg-[#a2d9f7] px-4 py-3 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95 disabled:opacity-60"
        >
          {busy ? 'Оформляем…' : `Подтвердить заказ на ${formatPrice(total)}`}
        </button>
      </form>
    </div>
  )
}
