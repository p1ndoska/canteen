import { useEffect, useState } from 'react'
import { authFetch } from '../../api'
import { CloseIcon, Field } from '../../ui'
import { formatPrice, inputClass } from '../../utils'

export default function DishesTab({ categories }) {
  const [dishes, setDishes] = useState([])
  const [dishForm, setDishForm] = useState(null) // null | {id?, name, image, image_url, weight, price, description, category_id}
  const [dishFormError, setDishFormError] = useState('')

  useEffect(() => {
    fetch('/api/dishes')
      .then((res) => (res.ok ? res.json() : []))
      .then(setDishes)
      .catch(() => {})
  }, [])

  const categoryName = (id) => categories.find((c) => c.id === id)?.name

  const saveDish = async (e) => {
    e.preventDefault()
    setDishFormError('')
    try {
      const body = new FormData()
      body.append('name', dishForm.name)
      body.append('weight', dishForm.weight)
      body.append('price', dishForm.price)
      body.append('description', dishForm.description)
      body.append('category_id', dishForm.category_id)
      if (dishForm.image) body.append('image', dishForm.image)
      if (dishForm.id) {
        const updated = await authFetch(`/api/dishes/${dishForm.id}`, {
          method: 'PATCH',
          body,
        })
        setDishes(dishes.map((d) => (d.id === dishForm.id
          ? { ...updated, category_name: categoryName(updated.category_id) }
          : d)))
      } else {
        const created = await authFetch('/api/dishes', {
          method: 'POST',
          body,
        })
        setDishes([...dishes, { ...created, category_name: categoryName(created.category_id) }])
      }
      setDishForm(null)
    } catch (err) {
      setDishFormError(err.message)
    }
  }

  const removeDish = async (d) => {
    if (!window.confirm(`Удалить блюдо «${d.name}»?`)) return
    try {
      await authFetch(`/api/dishes/${d.id}`, { method: 'DELETE' })
      setDishes(dishes.filter((x) => x.id !== d.id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => { setDishForm({ name: '', image: null, image_url: '', weight: '', price: '', description: '', category_id: categories[0]?.id ?? '' }); setDishFormError('') }}
          className="rounded-full bg-[#a2d9f7] px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
        >
          + Добавить блюдо
        </button>
      </div>
      {dishes.length === 0 ? (
        <p className="text-sm text-gray-600">Блюд пока нет.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
                <th className="px-4 py-2.5 font-medium" />
                <th className="px-4 py-2.5 font-medium">Название</th>
                <th className="px-4 py-2.5 font-medium">Вес</th>
                <th className="px-4 py-2.5 font-medium">Цена</th>
                <th className="px-4 py-2.5 font-medium">Категория</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {dishes.map((d) => (
                <tr key={d.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5">
                    {d.image_url ? (
                      <img
                        src={d.image_url}
                        alt={d.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-100" />
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-gray-900">{d.name}</td>
                  <td className="px-4 py-2.5 text-gray-700">{d.weight}</td>
                  <td className="px-4 py-2.5 text-gray-700">{formatPrice(d.price)}</td>
                  <td className="px-4 py-2.5 text-gray-700">{d.category_name}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setDishForm({ id: d.id, name: d.name, image: null, image_url: d.image_url, weight: d.weight, price: d.price, description: d.description, category_id: d.category_id }); setDishFormError('') }}
                        className="rounded-full border border-[#a2d9f7] bg-white px-3 py-1 text-xs font-semibold text-[#0c4a6e] transition hover:brightness-95"
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDish(d)}
                        className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {dishForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDishForm(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {dishForm.id ? 'Изменить блюдо' : 'Новое блюдо'}
              </h2>
              <button
                type="button"
                onClick={() => setDishForm(null)}
                className="text-gray-400 transition hover:text-gray-600"
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={saveDish}>
              <Field
                label="Название"
                type="text"
                name="dishName"
                value={dishForm.name}
                onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                autoComplete="off"
              />
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Картинка</span>
                {(dishForm.image || dishForm.image_url) && (
                  <img
                    src={dishForm.image ? URL.createObjectURL(dishForm.image) : dishForm.image_url}
                    alt=""
                    className="h-20 w-20 rounded-md object-cover"
                  />
                )}
                <input
                  type="file"
                  name="dishImage"
                  accept="image/*"
                  onChange={(e) => setDishForm({ ...dishForm, image: e.target.files[0] || null })}
                  className="text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#a2d9f7] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#0c4a6e] file:transition hover:file:brightness-95"
                />
              </label>
              <Field
                label="Вес"
                type="text"
                name="dishWeight"
                placeholder="250 г"
                value={dishForm.weight}
                onChange={(e) => setDishForm({ ...dishForm, weight: e.target.value })}
                autoComplete="off"
              />
              <Field
                label="Цена"
                type="number"
                name="dishPrice"
                min="0"
                step="0.01"
                placeholder="45.90"
                value={dishForm.price}
                onChange={(e) => setDishForm({ ...dishForm, price: e.target.value })}
                autoComplete="off"
              />
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Описание</span>
                <textarea
                  name="dishDescription"
                  rows={3}
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Категория</span>
                <select
                  required
                  value={dishForm.category_id}
                  onChange={(e) => setDishForm({ ...dishForm, category_id: e.target.value })}
                  className={inputClass}
                >
                  <option value="" disabled>Выберите категорию</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
              {dishFormError && <p className="text-sm text-red-600">{dishFormError}</p>}
              <button
                type="submit"
                className="mt-1 rounded-full bg-[#a2d9f7] px-4 py-2.5 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
              >
                {dishForm.id ? 'Сохранить' : 'Создать'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
