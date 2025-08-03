import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User } from '@/components/types'

interface UserAccountProps {
  user: User
  setUser: React.Dispatch<React.SetStateAction<User>>
}

export default function UserAccount({ user, setUser }: UserAccountProps) {
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

  return (
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
  )
}