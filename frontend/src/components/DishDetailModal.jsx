import { CloseIcon, ImagePlaceholder } from '../ui'
import { formatPrice } from '../utils'

export default function DishDetailModal({ dish, onClose, onAddToCart }) {
  if (!dish) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center p-10">
          {dish.image_url ? (
            <img
              src={dish.image_url}
              alt={dish.name}
              className="max-h-96 w-full object-contain"
            />
          ) : (
            <div className="flex h-96 w-full items-center justify-center text-gray-300">
              <ImagePlaceholder />
            </div>
          )}
        </div>
        <div className="relative flex flex-col p-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Закрыть"
          >
            <CloseIcon />
          </button>
          <h2 className="pr-12 text-2xl font-semibold text-gray-900">{dish.name}</h2>
          <p className="mt-2 text-sm text-gray-500">
            {dish.category_name && `${dish.category_name} · `}{dish.weight}
          </p>
          {dish.description && (
            <p className="mt-5 whitespace-pre-line break-words text-base text-gray-700">
              {dish.description}
            </p>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => onAddToCart(dish)}
            className="mt-8 w-full rounded-full bg-[#a2d9f7] px-4 py-3.5 text-base font-semibold text-[#0c4a6e] transition hover:brightness-95"
          >
            В корзину за {formatPrice(dish.price)}
          </button>
        </div>
      </div>
    </div>
  )
}
