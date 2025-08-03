import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Icon from '@/components/ui/icon'
import { CartItem, OrderForm } from '@/components/types'

interface CheckoutModalProps {
  showCheckout: boolean
  setShowCheckout: (show: boolean) => void
  cart: CartItem[]
  totalPrice: number
  orderForm: OrderForm
  setOrderForm: React.Dispatch<React.SetStateAction<OrderForm>>
  handleOrderSubmit: () => void
}

export default function CheckoutModal({
  showCheckout,
  setShowCheckout,
  cart,
  totalPrice,
  orderForm,
  setOrderForm,
  handleOrderSubmit
}: CheckoutModalProps) {
  if (!showCheckout) return null

  return (
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
  )
}