import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { CartItem } from '@/components/types'

interface CartSidebarProps {
  showCart: boolean
  setShowCart: (show: boolean) => void
  cart: CartItem[]
  updateQuantity: (id: number, quantity: number) => void
  removeFromCart: (id: number) => void
  clearCart: () => void
  totalPrice: number
  isLoggedIn: boolean
  setShowCheckout: (show: boolean) => void
  setShowLogin: (show: boolean) => void
}

export default function CartSidebar({
  showCart,
  setShowCart,
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
  totalPrice,
  isLoggedIn,
  setShowCheckout,
  setShowLogin
}: CartSidebarProps) {
  if (!showCart) return null

  return (
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
  )
}