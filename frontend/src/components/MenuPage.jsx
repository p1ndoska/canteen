import { HeartIcon, ImagePlaceholder } from '../ui'
import { formatPrice } from '../utils'

export default function MenuPage({ dishes, onOpenDish, cartQtyById, onQtyChange, favIds = [], onToggleFav, emptyText = 'Меню пока пустое.' }) {
  return (
    <section>
      {dishes.length === 0 ? (
        <p className="text-sm text-gray-600">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {dishes.map((d) => {
            const qty = cartQtyById[d.id] ?? 0
            const isFav = favIds.includes(d.id)
            return (
            <div key={d.id} className="relative flex flex-col rounded-xl bg-white p-4 text-center transition hover:shadow-md xl:p-5">
              <button
                type="button"
                onClick={() => onToggleFav(d)}
                aria-label={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
                className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow transition xl:h-10 xl:w-10 ${
                  isFav ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
                }`}
              >
                <HeartIcon filled={isFav} />
              </button>
              <button
                type="button"
                onClick={() => onOpenDish(d)}
                className="flex flex-1 flex-col items-center"
              >
              {d.image_url ? (
                <img
                  src={d.image_url}
                  alt={d.name}
                  className="h-40 w-full rounded-lg object-contain xl:h-60"
                />
              ) : (
                <div className="flex h-40 w-full items-center justify-center text-gray-300 xl:h-60">
                  <ImagePlaceholder className="h-12 w-12 xl:h-16 xl:w-16" />
                </div>
              )}
              <p className="mt-3 text-sm font-semibold text-gray-900 xl:text-lg">{d.name}</p>
              </button>
              <div className="mt-2.5 flex w-full items-center justify-between xl:mt-3.5">
                <span className="inline-block rounded-full bg-[#eef2f7] px-4 py-1.5 text-sm font-semibold text-gray-800 xl:px-6 xl:py-2.5 xl:text-lg">
                  {formatPrice(d.price)}
                </span>
                {qty > 0 ? (
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      type="button"
                      onClick={() => onQtyChange(d, qty - 1)}
                      aria-label="Уменьшить количество"
                      className="flex h-8 w-7 items-center justify-center rounded-full text-base font-bold text-[#0c4a6e] transition hover:bg-gray-100 xl:h-11 xl:w-10 xl:text-xl"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-gray-900 xl:w-7 xl:text-lg">{qty}</span>
                    <button
                      type="button"
                      onClick={() => onQtyChange(d, qty + 1)}
                      aria-label="Увеличить количество"
                      className="flex h-8 w-7 items-center justify-center rounded-full text-base font-bold text-[#0c4a6e] transition hover:bg-gray-100 xl:h-11 xl:w-10 xl:text-xl"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onQtyChange(d, 1)}
                    aria-label="Добавить в корзину"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#a2d9f7] text-lg font-bold text-[#0c4a6e] shadow transition hover:brightness-95 xl:h-11 xl:w-11 xl:text-2xl"
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
