import { useState } from 'react'
import { CloseIcon, HeartIcon, ImagePlaceholder } from '../ui'
import { formatPrice } from '../utils'

export default function DishDetailModal({ dish, onClose, cartQty = 0, onSave, isFav = false, onToggleFav }) {
  const [qty, setQty] = useState(Math.max(cartQty, 1))

  if (!dish) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="grid max-h-[90vh] w-full max-w-5xl overflow-y-auto xl:max-w-6xl rounded-3xl bg-white shadow-xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-4 sm:p-10">
          {dish.image_url ? (
            <img
              src={dish.image_url}
              alt={dish.name}
              className="max-h-56 w-full object-contain sm:max-h-96 xl:max-h-[28rem]"
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center text-gray-300 sm:h-96">
              <ImagePlaceholder />
            </div>
          )}
        </div>
        <div className="relative flex flex-col p-5 sm:p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
          <button
            type="button"
            onClick={() => onToggleFav(dish)}
            aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
            className={`absolute right-16 top-5 flex h-9 w-9 items-center justify-center rounded-full transition ${
              isFav ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
            }`}
          >
            <HeartIcon filled={isFav} />
          </button>
          <h2 className="pr-12 text-2xl font-semibold text-gray-900 xl:text-3xl">{dish.name}</h2>
          <p className="mt-2 text-sm text-gray-500 xl:text-base">
            {dish.category_name && `${dish.category_name} · `}{dish.weight}
          </p>
          {dish.description && (
            <p className="mt-5 whitespace-pre-line break-words text-base text-gray-700 xl:text-lg">
              {dish.description}
            </p>
          )}
          <div className="flex-1" />
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-gray-200">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(0, q - 1))}
                className="flex h-12 w-11 items-center justify-center text-lg text-gray-600 transition hover:text-gray-900"
                aria-label="Уменьшить количество"
              >
                −
              </button>
              <span className="w-8 text-center text-base font-semibold text-gray-900">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-12 w-11 items-center justify-center text-lg text-gray-600 transition hover:text-gray-900"
                aria-label="Увеличить количество"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => onSave(dish, qty)}
              className="flex-1 rounded-full bg-[#a2d9f7] px-4 py-3.5 text-base font-semibold text-[#0c4a6e] transition hover:brightness-95"
            >
              {qty === 0
                ? 'Убрать из корзины'
                : `В корзину за ${formatPrice(dish.price * qty)}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
