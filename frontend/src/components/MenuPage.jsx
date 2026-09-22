import { ImagePlaceholder } from '../ui'
import { formatPrice } from '../utils'

export default function MenuPage({ dishes, onOpenDish, onAddToCart }) {
  return (
    <section>
      {dishes.length === 0 ? (
        <p className="text-sm text-gray-600">Меню пока пустое.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {dishes.map((d) => (
            <div key={d.id} className="relative">
              <button
                type="button"
                onClick={() => onOpenDish(d)}
                className="flex h-full w-full flex-col items-center rounded-xl bg-white p-4 text-center transition hover:shadow-md"
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
              <span className="mt-2.5 inline-block rounded-full bg-[#eef2f7] px-4 py-1.5 text-sm font-semibold text-gray-800">
                {formatPrice(d.price)}
              </span>
              </button>
              <button
                type="button"
                onClick={() => onAddToCart(d)}
                aria-label="Добавить в корзину"
                className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#a2d9f7] text-lg font-bold text-[#0c4a6e] shadow transition hover:brightness-95"
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
