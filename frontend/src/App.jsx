import { useEffect, useState } from 'react'
import AuthModal from './components/AuthModal'
import CartDrawer from './components/CartDrawer'
import DishDetailModal from './components/DishDetailModal'
import Header from './components/Header'
import MenuPage from './components/MenuPage'
import AdminPanel from './components/admin/AdminPanel'

function App() {
  const [authMode, setAuthMode] = useState(null) // null | 'login' | 'register'
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [activeTab, setActiveTab] = useState('menu') // 'menu' | 'about' | 'contacts' | 'admin'
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [menuDishes, setMenuDishes] = useState([])
  const [dishDetail, setDishDetail] = useState(null)

  const isAdmin = !!user && ['admin', 'superadmin'].includes(user.role)

  useEffect(() => {
    if (activeTab !== 'menu') return
    fetch('/api/dishes')
      .then((res) => (res.ok ? res.json() : []))
      .then(setMenuDishes)
      .catch(() => {})
  }, [activeTab])

  const addToCart = (dish, qty = 1) => {
    setCartItems((items) => {
      const i = items.findIndex((x) => x.id === dish.id)
      if (i === -1) {
        return [...items, {
          id: dish.id,
          name: dish.name,
          image_url: dish.image_url,
          weight: dish.weight,
          price: dish.price,
          qty,
        }]
      }
      return items.map((x, idx) => (idx === i ? { ...x, qty: x.qty + qty } : x))
    })
  }

  const addToCartFromDetail = (dish, qty) => {
    addToCart(dish, qty)
    setDishDetail(null)
    setCartOpen(true)
  }

  const changeCartQty = (index, delta) => {
    setCartItems((items) =>
      items.map((it, i) => (i === index ? { ...it, qty: Math.max(1, it.qty + delta) } : it)),
    )
  }

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0)

  const saveSession = (data) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    setAuthMode(null)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    if (activeTab === 'admin') setActiveTab('menu')
  }

  return (
    <>
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
        user={user}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onLogin={() => setAuthMode('login')}
        onLogout={logout}
      />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-6">
        {activeTab === 'menu' && (
          <MenuPage dishes={menuDishes} onOpenDish={setDishDetail} onAddToCart={addToCart} />
        )}
        {activeTab === 'about' && (
          <section>
            <h1 className="mb-4 text-2xl font-semibold text-gray-900">О нас</h1>
            <p className="text-sm text-gray-600">
              Столовая Минского центра УВД — раздел в разработке.
            </p>
          </section>
        )}
        {activeTab === 'contacts' && (
          <section>
            <h1 className="mb-4 text-2xl font-semibold text-gray-900">Контакты</h1>
            <p className="text-sm text-gray-600">
              Контактная информация появится здесь позже.
            </p>
          </section>
        )}
        {activeTab === 'admin' && isAdmin && <AdminPanel user={user} />}
      </main>

      <CartDrawer
        open={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onRemove={(i) => setCartItems(cartItems.filter((_, idx) => idx !== i))}
        onQtyChange={changeCartQty}
      />

      <DishDetailModal
        key={dishDetail?.id ?? 'none'}
        dish={dishDetail}
        onClose={() => setDishDetail(null)}
        onAddToCart={addToCartFromDetail}
      />

      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSwitchMode={setAuthMode}
          onSuccess={saveSession}
        />
      )}
    </>
  )
}

export default App
