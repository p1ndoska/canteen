import { ImagePlaceholder } from '../ui'
import { formatPrice } from '../utils'

export default function MenuPage({ dishes, onOpenDish, cartQtyById, onQtyChange }) {
  return (
    <section>
      {dishes.length === 0 ? (
        <p className="text-sm text-gray-600">Меню пока пустое.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {dishes.map((d) => {
            const qty = cartQtyById[d.id] ?? 0
            return (
            <div key={d.id} className="flex flex-col rounded-xl bg-white p-4 text-center transition hover:shadow-md">
              <button
                type="button"
                onClick={() => onOpenDish(d)}
                className="flex flex-1 flex-col items-center"
              >
              {d.image_url ? (
                <img
                  src={d.image_url}
                  alt={d.name}
                  className="h-40 w-full rounded-lg object-contain"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center text-gray-300">
                  <ImagePlaceholder className="h-12 w-12" />
                </div>
              )}
              <p className="mt-3 text-sm font-semibold text-gray-900">{d.name}</p>
              </button>
              <div className="mt-2.5 flex w-full items-center justify-between">
                <span className="inline-block rounded-full bg-[#eef2f7] px-4 py-1.5 text-sm font-semibold text-gray-800">
                  {formatPrice(d.price)}
                </span>
                {qty > 0 ? (
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      type="button"
                      onClick={() => onQtyChange(d, qty - 1)}
                      aria-label="Уменьшить количество"
                      className="flex h-8 w-7 items-center justify-center rounded-full text-base font-bold text-[#0c4a6e] transition hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-gray-900">{qty}</span>
                    <button
                      type="button"
                      onClick={() => onQtyChange(d, qty + 1)}
                      aria-label="Увеличить количество"
                      className="flex h-8 w-7 items-center justify-center rounded-full text-base font-bold text-[#0c4a6e] transition hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onQtyChange(d, 1)}
                    aria-label="Добавить в корзину"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a2d9f7] text-lg font-bold text-[#0c4a6e] shadow transition hover:brightness-95"
                  >
                    +
                  </button>
                )}
              </div>
            </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
