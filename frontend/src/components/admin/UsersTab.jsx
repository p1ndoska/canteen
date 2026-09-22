import { useEffect, useState } from 'react'
import { authFetch } from '../../api'
import { CloseIcon, Field } from '../../ui'
import { inputClass } from '../../utils'

const emptyUserForm = { login: '', password: '', role: 'user' }

export default function UsersTab() {
  const [users, setUsers] = useState([])
  const [userForm, setUserForm] = useState(null) // null | {id?, login, password, role}
  const [userFormError, setUserFormError] = useState('')

  useEffect(() => {
    authFetch('/api/auth/users')
      .then(setUsers)
      .catch(() => {})
  }, [])

  const saveUser = async (e) => {
    e.preventDefault()
    setUserFormError('')
    try {
      if (userForm.id) {
        const body = { login: userForm.login, role: userForm.role }
        if (userForm.password) body.password = userForm.password
        const updated = await authFetch(`/api/auth/users/${userForm.id}`, {
          method: 'PATCH',
          body: JSON.stringify(body),
        })
        setUsers(users.map((u) => (u.id === userForm.id ? updated : u)))
      } else {
        const created = await authFetch('/api/auth/users', {
          method: 'POST',
          body: JSON.stringify(userForm),
        })
        setUsers([...users, created])
      }
      setUserForm(null)
    } catch (err) {
      setUserFormError(err.message)
    }
  }

  const removeUser = async (u) => {
    if (!window.confirm(`Удалить пользователя «${u.login}»?`)) return
    try {
      await authFetch(`/api/auth/users/${u.id}`, { method: 'DELETE' })
      setUsers(users.filter((x) => x.id !== u.id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          onClick={() => { setUserForm({ ...emptyUserForm }); setUserFormError('') }}
          className="rounded-full bg-[#a2d9f7] px-4 py-2 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
        >
          + Добавить пользователя
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
              <th className="px-4 py-2.5 font-medium">ID</th>
              <th className="px-4 py-2.5 font-medium">Логин</th>
              <th className="px-4 py-2.5 font-medium">Роль</th>
              <th className="px-4 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-2.5 text-gray-500">{u.id}</td>
                <td className="px-4 py-2.5 text-gray-900">{u.login}</td>
                <td className="px-4 py-2.5 text-gray-700">{u.role}</td>
                <td className="px-4 py-2.5 text-right">
                  {u.role !== 'superadmin' && (
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setUserForm({ id: u.id, login: u.login, password: '', role: u.role }); setUserFormError('') }}
                        className="rounded-full border border-[#a2d9f7] bg-white px-3 py-1 text-xs font-semibold text-[#0c4a6e] transition hover:brightness-95"
                      >
                        Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => removeUser(u)}
                        className="rounded-full border border-red-200 bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setUserForm(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {userForm.id ? 'Изменить пользователя' : 'Новый пользователь'}
              </h2>
              <button
                type="button"
                onClick={() => setUserForm(null)}
                className="text-gray-400 transition hover:text-gray-600"
                aria-label="Закрыть"
              >
                <CloseIcon />
              </button>
            </div>
            <form className="flex flex-col gap-4" onSubmit={saveUser}>
              <Field
                label="Логин"
                type="text"
                name="userLogin"
                value={userForm.login}
                onChange={(e) => setUserForm({ ...userForm, login: e.target.value })}
                autoComplete="off"
              />
              <Field
                label={userForm.id ? 'Новый пароль (оставьте пустым, чтобы не менять)' : 'Пароль'}
                type="password"
                name="userPassword"
                required={!userForm.id}
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                autoComplete="new-password"
              />
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Роль</span>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className={inputClass}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </label>
              {userFormError && <p className="text-sm text-red-600">{userFormError}</p>}
              <button
                type="submit"
                className="mt-1 rounded-full bg-[#a2d9f7] px-4 py-2.5 text-sm font-semibold text-[#0c4a6e] transition hover:brightness-95"
              >
                {userForm.id ? 'Сохранить' : 'Создать'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
