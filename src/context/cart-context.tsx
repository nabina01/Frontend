"use client"

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  total: number
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Load cart from localStorage when user changes
  useEffect(() => {
    const loadCart = () => {
      const userData = localStorage.getItem("user")
      const userId = userData ? JSON.parse(userData).id : null
      setCurrentUserId(userId)

      if (userId) {
        const saved = localStorage.getItem(`cafe-cart-${userId}`)
        if (saved) {
          setItems(JSON.parse(saved))
        } else {
          setItems([])
        }
      } else {
        setItems([])
      }
    }

    loadCart()

    // Listen for storage changes (login/logout from other tabs or after login)
    window.addEventListener('storage', loadCart)
    
    return () => {
      window.removeEventListener('storage', loadCart)
    }
  }, [])

  // Save cart to localStorage whenever items or user changes
  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(`cafe-cart-${currentUserId}`, JSON.stringify(items))
    }
  }, [items, currentUserId])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addItem = useCallback((item: CartItem) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id)
      if (existing) {
        return prevItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i))
      }
      return [...prevItems, item]
    })
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id)
      } else {
        setItems((prevItems) => prevItems.map((i) => (i.id === id ? { ...i, quantity } : i)))
      }
    },
    [removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
    if (currentUserId) {
      localStorage.removeItem(`cafe-cart-${currentUserId}`)
    }
  }, [currentUserId])

  return (
    <CartContext.Provider value={{ items, total, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
