import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Icon from '@/components/ui/icon'
import Header from '@/components/Header'
import CartSidebar from '@/components/CartSidebar'
import UserAccount from '@/components/UserAccount'
import CheckoutModal from '@/components/CheckoutModal'
import { Product, CartItem, Order, User, OrderForm } from '@/components/types'

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Беспроводные наушники",
    price: 4999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    category: "Электроника",
    rating: 4.5,
    inStock: true
  },
  {
    id: 2,
    name: "Умные часы",
    price: 12999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop",
    category: "Электроника",
    rating: 4.8,
    inStock: true
  },
  {
    id: 3,
    name: "Рюкзак для ноутбука",
    price: 2499,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
    category: "Аксессуары",
    rating: 4.3,
    inStock: true
  },
  {
    id: 4,
    name: "Портативная колонка",
    price: 3499,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop",
    category: "Электроника",
    rating: 4.6,
    inStock: false
  }
]

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [showCheckout, setShowCheckout] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [user, setUser] = useState<User>({
    name: 'Иван Петров',
    email: 'ivan@example.com',
    phone: '+7 (999) 123-45-67',
    address: 'Москва, ул. Пушкина, д. 10, кв. 5',
    orders: [
      {
        id: 'ORD-2024-001',
        items: [
          {
            id: 1,
            name: 'Беспроводные наушники',
            price: 4999,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
            category: 'Электроника',
            rating: 4.5,
            inStock: true,
            quantity: 1
          }
        ],
        total: 4999,
        status: 'delivered',
        date: '2024-07-15',
        address: 'Москва, ул. Пушкина, д. 10, кв. 5',
        paymentMethod: 'Банковская карта'
      },
      {
        id: 'ORD-2024-002',
        items: [
          {
            id: 2,
            name: 'Умные часы',
            price: 12999,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
            category: 'Электроника',
            rating: 4.8,
            inStock: true,
            quantity: 1
          }
        ],
        total: 12999,
        status: 'shipped',
        date: '2024-07-28',
        address: 'Москва, ул. Пушкина, д. 10, кв. 5',
        paymentMethod: 'При получении'
      }
    ]
  })
  const [orderForm, setOrderForm] = useState<OrderForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'card'
  })

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleLogin = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setActiveSection('home')
  }

  const handleOrderSubmit = () => {
    const newOrder: Order = {
      id: `ORD-2024-${String(user.orders.length + 1).padStart(3, '0')}`,
      items: [...cart],
      total: totalPrice,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      address: orderForm.address,
      paymentMethod: orderForm.paymentMethod === 'card' ? 'Банковская карта' : 'При получении'
    }

    setUser(prev => ({
      ...prev,
      orders: [newOrder, ...prev.orders]
    }))

    setCart([])
    setShowCheckout(false)
    setShowCart(false)
    setActiveSection('account')
  }

  const clearCart = () => {
    setCart([])
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name={i < Math.floor(rating) ? "Star" : "StarIcon"}
        size={16}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        totalItems={totalItems}
        setShowCart={setShowCart}
        isLoggedIn={isLoggedIn}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />

      <CartSidebar
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        totalPrice={totalPrice}
        isLoggedIn={isLoggedIn}
        setShowCheckout={setShowCheckout}
        setShowLogin={setShowLogin}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'home' && (
          <>
            <section className="relative bg-gradient-to-r from-primary to-orange-400 rounded-2xl overflow-hidden mb-12">
              <div className="absolute inset-0">
                <img 
                  src="/img/e6f145d6-ab1a-4445-8536-c8184d60f728.jpg" 
                  alt="Hero" 
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              <div className="relative px-8 py-16 text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  Добро пожаловать в наш магазин
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                  Откройте для себя удивительный мир товаров высочайшего качества по доступным ценам
                </p>
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => setActiveSection('catalog')}
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  Посмотреть каталог
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </Button>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">Популярные товары</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockProducts.slice(0, 4).map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                        <div className="flex items-center space-x-1">
                          {renderStars(product.rating)}
                        </div>
                      </div>
                      <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                      <p className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'В корзину' : 'Нет в наличии'}
                        <Icon name="ShoppingCart" size={16} className="ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}

        {activeSection === 'catalog' && (
          <section>
            <h2 className="text-3xl font-bold mb-8">Каталог товаров</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockProducts.map(product => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                      </div>
                    </div>
                    <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
                    <p className="text-2xl font-bold text-primary">{product.price.toLocaleString()} ₽</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'В корзину' : 'Нет в наличии'}
                      <Icon name="ShoppingCart" size={16} className="ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'about' && (
          <section>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">О нас</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h3 className="text-2xl font-semibold mb-4">Наша миссия</h3>
                  <p className="text-gray-600 mb-6">
                    Мы стремимся предоставить нашим клиентам лучшие товары по доступным ценам, 
                    обеспечивая при этом высочайший уровень сервиса и качества.
                  </p>
                  <h3 className="text-2xl font-semibold mb-4">Почему выбирают нас?</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <Icon name="Check" size={16} className="text-primary mr-2" />
                      Широкий ассортимент товаров
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={16} className="text-primary mr-2" />
                      Быстрая доставка
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={16} className="text-primary mr-2" />
                      Гарантия качества
                    </li>
                    <li className="flex items-center">
                      <Icon name="Check" size={16} className="text-primary mr-2" />
                      Поддержка 24/7
                    </li>
                  </ul>
                </div>
                <div className="bg-primary/10 rounded-lg p-8">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary">1000+</div>
                      <div className="text-sm text-gray-600">Товаров</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">5000+</div>
                      <div className="text-sm text-gray-600">Клиентов</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">99%</div>
                      <div className="text-sm text-gray-600">Довольных</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary">24/7</div>
                      <div className="text-sm text-gray-600">Поддержка</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'contacts' && (
          <section>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Контакты</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Свяжитесь с нами</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="Phone" size={20} className="text-primary" />
                      <span>+7 (495) 123-45-67</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Mail" size={20} className="text-primary" />
                      <span>info@store.ru</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="MapPin" size={20} className="text-primary" />
                      <span>Москва, ул. Примерная, д. 123</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Clock" size={20} className="text-primary" />
                      <span>Пн-Пт: 9:00-18:00, Сб-Вс: 10:00-16:00</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Напишите нам</h3>
                  <form className="space-y-4">
                    <Input placeholder="Ваше имя" />
                    <Input type="email" placeholder="Email" />
                    <Textarea placeholder="Сообщение" rows={4} />
                    <Button className="w-full">Отправить сообщение</Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'account' && isLoggedIn && (
          <UserAccount user={user} setUser={setUser} />
        )}
      </main>

      <CheckoutModal
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
        cart={cart}
        totalPrice={totalPrice}
        orderForm={orderForm}
        setOrderForm={setOrderForm}
        handleOrderSubmit={handleOrderSubmit}
      />

      <footer className="bg-secondary text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ONLINE STORE</h3>
              <p className="text-gray-300 text-sm">
                Ваш надежный партнер в мире онлайн-покупок. Качество, доступность, сервис.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Разделы</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><button onClick={() => setActiveSection('home')} className="hover:text-white">Главная</button></li>
                <li><button onClick={() => setActiveSection('catalog')} className="hover:text-white">Каталог</button></li>
                <li><button onClick={() => setActiveSection('about')} className="hover:text-white">О нас</button></li>
                <li><button onClick={() => setActiveSection('contacts')} className="hover:text-white">Контакты</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Доставка</a></li>
                <li><a href="#" className="hover:text-white">Оплата</a></li>
                <li><a href="#" className="hover:text-white">Возврат</a></li>
                <li><a href="#" className="hover:text-white">Гарантия</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <p>+7 (495) 123-45-67</p>
                <p>info@store.ru</p>
                <p>Москва, ул. Примерная, д. 123</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 Online Store. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}