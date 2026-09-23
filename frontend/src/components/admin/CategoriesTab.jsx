import { useState } from 'react'
import { authFetch } from '../../api'
import { CloseIcon, Field } from '../../ui'

export default function CategoriesTab({ categories, onCategoriesChange }) {
  const [catForm, setCatForm] = useState(null) // null | {id?, name}
  const [catFormError, setCatFormError] = useState('')

  const saveCategory = async (e) => {
    e.preventDefault()
    setCatFormError('')
    try {
      if (catForm.id) {
        const updated = await authFetch(`/api/categories/${catForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ name: catForm.name }),
        })
        onCategoriesChange(categories.map((c) => (c.id === catForm.id ? updated : c)))
      } else {
        const created = await authFetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify({ name: catForm.name }),
        })
        onCategoriesChange([...categories, created])
      }
      setCatForm(null)
    } catch (err) {
      setCatFormError(err.message)
    }
  }

  const removeCategory = async (c) => {
    if (!window.confirm(`Удалить категорию «${c.name}»?`)) return
    try {
      await authFetch(`/api/categories/${c.id}`, { method: 'DELETE' })
      onCategoriesChange(categories.filter((x) => x.id !== c.id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => { setCatForm({ name: '' }); setCatFormError('') }}
          className="rounded-full bg-[#a2d9f7] px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
        >
          + Добавить категорию
        </button>
      </div>
      {categories.length === 0 ? (
        <p className="text-sm text-gray-600">Категорий пока нет.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-2.5 text-gray-900">{c.name}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setCatForm({ id: c.id, name: c.name }); setCatFormError('') }}
                        className="rounded-full border border-[#a2d9f7] bg-white px-3 py-1 text-xs font-semibold text-[#0c4a6e] transition hover:brightness-95"
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCategory(c)}
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

      {catForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setCatForm(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {catForm.id ? 'Изменить категорию' : 'Новая категория'}
              </h2>
              <button
                type="button"
                onClick={() => setCatForm(null)}
                className="text-gray-400 transition hover:text-gray-600"
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={saveCategory}>
              <Field
                label="Название"
                type="text"
                name="categoryName"
                value={catForm.name}
                onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                autoComplete="off"
              />
              {catFormError && <p className="text-sm text-red-600">{catFormError}</p>}
              <button
                type="submit"
                className="mt-1 rounded-full bg-[#a2d9f7] px-4 py-2.5 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
              >
                {catForm.id ? 'Сохранить' : 'Создать'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
