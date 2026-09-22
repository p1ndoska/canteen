export const inputClass =
  'rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-[#a2d9f7] focus:ring-2 focus:ring-[#a2d9f7]/40'

export const formatPrice = (p) =>
  `${Number(p).toFixed(2).replace('.', ',')} руб.`
