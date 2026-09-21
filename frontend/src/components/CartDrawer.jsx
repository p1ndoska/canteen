import { CloseIcon } from '../ui'
import { formatPrice } from '../utils'

export default function CartDrawer({ open, items, onClose, onRemove }) {
  if (!open) return null
  const total = items.reduce((sum, item) => sum + Number(item.price), 0)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40"
      onClick={onClose}
    >
      <aside
        className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Корзина</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 transition hover:text-gray-600"
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-500">Корзина пуста</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-gray-100" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.weight}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(item.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemove(i)}
                    className="text-gray-400 transition hover:text-gray-600"
                    aria-label="Убрать"
                  >
                    <CloseIcon className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Итого</span>
              <span className="text-base font-semibold text-gray-900">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}
