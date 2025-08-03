import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Icon from '@/components/ui/icon'

interface HeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
  totalItems: number
  setShowCart: (show: boolean) => void
  isLoggedIn: boolean
  showLogin: boolean
  setShowLogin: (show: boolean) => void
  handleLogin: () => void
  handleLogout: () => void
}

export default function Header({
  activeSection,
  setActiveSection,
  totalItems,
  setShowCart,
  isLoggedIn,
  showLogin,
  setShowLogin,
  handleLogin,
  handleLogout
}: HeaderProps) {
  return (
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
              onClick={() => setShowCart(true)}
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
  )
}