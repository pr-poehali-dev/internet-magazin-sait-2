import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Icon from '@/components/ui/icon'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  inStock: boolean
}

interface CartItem extends Product {
  quantity: number
}

interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  date: string
  address: string
  paymentMethod: string
}

interface User {
  name: string
  email: string
  phone: string
  address: string
  orders: Order[]
}

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
  const [orderForm, setOrderForm] = useState({
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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'outline'
      case 'confirmed': return 'secondary'
      case 'shipped': return 'default'
      case 'delivered': return 'default'
      default: return 'outline'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Обрабатывается'
      case 'confirmed': return 'Подтверждён'
      case 'shipped': return 'Отправлен'
      case 'delivered': return 'Доставлен'
      default: return status
    }
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-secondary">ONLINE STORE</h1>
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setActiveSection('home')}
                  className={`text-sm font-medium transition-colors ${activeSection === 'home' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-600 hover:text-primary'}`}
                >
                  Главная
                </button>
                <button
                  onClick={() => setActiveSection('catalog')}
                  className={`text-sm font-medium transition-colors ${activeSection === 'catalog' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-600 hover:text-primary'}`}
                >
                  Каталог
                </button>
                <button
                  onClick={() => setActiveSection('about')}
                  className={`text-sm font-medium transition-colors ${activeSection === 'about' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-600 hover:text-primary'}`}
                >
                  О нас
                </button>
                <button
                  onClick={() => setActiveSection('contacts')}
                  className={`text-sm font-medium transition-colors ${activeSection === 'contacts' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-600 hover:text-primary'}`}
                >
                  Контакты
                </button>
                {isLoggedIn && (
                  <button
                    onClick={() => setActiveSection('account')}
                    className={`text-sm font-medium transition-colors ${activeSection === 'account' ? 'text-primary border-b-2 border-primary pb-1' : 'text-gray-600 hover:text-primary'}`}
                  >
                    Личный кабинет
                  </button>
                )}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Поиск товаров..."
                  className="w-64 pl-10"
                />
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCart(!showCart)}
                className="relative"
              >
                <Icon name="ShoppingCart" size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs bg-primary">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              {isLoggedIn ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <Icon name="LogOut" size={20} className="mr-2" />
                  Выйти
                </Button>
              ) : (
                <Dialog open={showLogin} onOpenChange={setShowLogin}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Icon name="User" size={20} className="mr-2" />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход в аккаунт</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Email" type="email" />
                      <Input placeholder="Пароль" type="password" />
                      <Button className="w-full" onClick={handleLogin}>
                        Войти
                      </Button>
                      <p className="text-sm text-gray-500 text-center">
                        Нет аккаунта? <button className="text-primary hover:underline">Регистрация</button>
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Корзина</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCart(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Корзина пуста</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-primary font-semibold">{item.price.toLocaleString()} ₽</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Icon name="Minus" size={12} />
                            </Button>
                            <span className="text-sm">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Icon name="Plus" size={12} />
                            </Button>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Итого:</span>
                      <span className="text-xl font-bold text-primary">{totalPrice.toLocaleString()} ₽</span>
                    </div>
                    <div className="space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => isLoggedIn ? setShowCheckout(true) : setShowLogin(true)}
                      >
                        Оформить заказ
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={clearCart}
                      >
                        Очистить корзину
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'home' && (
          <>
            {/* Hero Section */}
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

            {/* Featured Products */}
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
          <section>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">Личный кабинет</h2>
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Профиль</TabsTrigger>
                  <TabsTrigger value="orders">Заказы</TabsTrigger>
                  <TabsTrigger value="settings">Настройки</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Информация профиля</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Имя</Label>
                          <Input id="name" value={user.name} onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" value={user.email} onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))} />
                        </div>
                        <div>
                          <Label htmlFor="phone">Телефон</Label>
                          <Input id="phone" value={user.phone} onChange={(e) => setUser(prev => ({ ...prev, phone: e.target.value }))} />
                        </div>
                        <div>
                          <Label htmlFor="address">Адрес</Label>
                          <Input id="address" value={user.address} onChange={(e) => setUser(prev => ({ ...prev, address: e.target.value }))} />
                        </div>
                      </div>
                      <Button>Сохранить изменения</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders">
                  <div className="space-y-4">
                    {user.orders.map(order => (
                      <Card key={order.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Заказ #{order.id}</CardTitle>
                              <p className="text-sm text-gray-500">от {new Date(order.date).toLocaleDateString('ru-RU')}</p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {order.items.map(item => (
                              <div key={item.id} className="flex items-center space-x-3">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {item.quantity} шт. × {item.price.toLocaleString()} ₽
                                  </p>
                                </div>
                                <span className="font-semibold">
                                  {(item.price * item.quantity).toLocaleString()} ₽
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center mb-2">
                              <span>Способ оплаты:</span>
                              <span>{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span>Адрес доставки:</span>
                              <span className="text-sm">{order.address}</span>
                            </div>
                            <div className="flex justify-between items-center font-semibold text-lg">
                              <span>Итого:</span>
                              <span className="text-primary">{order.total.toLocaleString()} ₽</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Настройки аккаунта</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Текущий пароль</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">Новый пароль</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                      <Button>Изменить пароль</Button>
                      
                      <div className="border-t pt-4 mt-6">
                        <h3 className="font-semibold mb-3">Уведомления</h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked />
                            <span>Email уведомления о заказах</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked />
                            <span>SMS уведомления</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" />
                            <span>Промо-акции и скидки</span>
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Оформление заказа</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowCheckout(false)}>
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="order-name">Имя получателя</Label>
                  <Input 
                    id="order-name"
                    value={orderForm.name} 
                    onChange={(e) => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Введите ваше имя"
                  />
                </div>
                
                <div>
                  <Label htmlFor="order-email">Email</Label>
                  <Input 
                    id="order-email"
                    type="email"
                    value={orderForm.email} 
                    onChange={(e) => setOrderForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@mail.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="order-phone">Телефон</Label>
                  <Input 
                    id="order-phone"
                    value={orderForm.phone} 
                    onChange={(e) => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                
                <div>
                  <Label htmlFor="order-address">Адрес доставки</Label>
                  <Textarea 
                    id="order-address"
                    value={orderForm.address} 
                    onChange={(e) => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Укажите полный адрес доставки"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="payment-method">Способ оплаты</Label>
                  <Select 
                    value={orderForm.paymentMethod} 
                    onValueChange={(value) => setOrderForm(prev => ({ ...prev, paymentMethod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Банковская карта</SelectItem>
                      <SelectItem value="cash">Наличные при получении</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Ваш заказ</h3>
                  <div className="space-y-2">
                    {cart.map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} × {item.quantity}</span>
                        <span>{(item.price * item.quantity).toLocaleString()} ₽</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Итого:</span>
                      <span className="text-primary">{totalPrice.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" onClick={handleOrderSubmit}>
                  Подтвердить заказ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
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