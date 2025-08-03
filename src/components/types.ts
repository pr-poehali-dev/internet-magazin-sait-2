export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  inStock: boolean
}

export interface CartItem extends Product {
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  date: string
  address: string
  paymentMethod: string
}

export interface User {
  name: string
  email: string
  phone: string
  address: string
  orders: Order[]
}

export interface OrderForm {
  name: string
  email: string
  phone: string
  address: string
  paymentMethod: string
}